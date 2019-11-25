import {
  ApolloError,
  AuthenticationError,
  withFilter
} from "apollo-server-koa";
import { DocumentModel, IDocument } from "../models/document";
import { ExerciseModel } from "../models/exercise";
import { FolderModel, IFolder } from "../models/folder";
import { SubmissionModel } from "../models/submission";
import { IUpload, UploadModel, IResource } from "../models/upload";
import { UserModel, IUser } from "../models/user";
import { pubsub } from "../server";
import { uploadDocumentImage } from "./upload";
import { getParentsPath, orderFunctions } from "../utils";
import { IUserInToken } from "../models/interfaces";
import {
  IMutationCreateDocumentArgs,
  IMutationDeleteDocumentArgs,
  IMutationUpdateDocumentContentArgs,
  IMutationUpdateDocumentArgs,
  IMutationSetDocumentImageArgs,
  IMutationPublishDocumentArgs,
  IQueryDocumentArgs,
  IQueryOpenPublicDocumentArgs,
  IQueryDocumentsAndFoldersArgs,
  IQueryHasExercisesArgs
} from "../api-types";

export const DOCUMENT_UPDATED: string = "DOCUMENT_UPDATED";

const hasDocsWithEx = async (folder: IFolder): Promise<boolean> => {
  if (folder.documentsID && folder.documentsID.length > 0) {
    const docsEx = await ExerciseModel.find({
      document: { $in: folder.documentsID }
    });
    if (docsEx.length > 0) {
      return true;
    }
  }
  if (folder.foldersID && folder.foldersID.length > 0) {
    const folders = await FolderModel.find({ _id: { $in: folder.foldersID } });
    return (await Promise.all(folders.map(hasDocsWithEx))).some(
      result => result
    );
  } else {
    return false;
  }
};

const documentResolver = {
  Subscription: {
    documentUpdated: {
      subscribe: withFilter(
        // Filtra para devolver solo los documentos del usuario
        () => pubsub.asyncIterator([DOCUMENT_UPDATED]),
        (
          payload: { documentUpdated: IDocument },
          variables,
          context: { user: IUserInToken }
        ) => {
          return (
            String(context.user.userID) === String(payload.documentUpdated.user)
          );
        }
      )
    }
  },

  Mutation: {
    /**
     * Create document: create a new empty document
     * It stores the new document in the database and if there is a image,
     * it uploads to Google Cloud and stores the public URL.
     * args: document information
     */
    createDocument: async (
      _,
      args: IMutationCreateDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      if (args.input.folder) {
        if (!(await FolderModel.findOne({ _id: args.input.folder }))) {
          throw new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
        }
      }
      const documentNew: IDocument = new DocumentModel({
        user: context.user.userID,
        title: args.input.title,
        type: args.input.type,
        folder:
          args.input.folder ||
          ((await UserModel.findOne({ _id: context.user.userID })) as IUser)
            .rootFolder,
        content: args.input.content,
        advancedMode: args.input.advancedMode,
        cache: args.input.cache,
        description: args.input.description,
        version: args.input.version,
        image: args.input.image
      });
      const newDocument: IDocument = await DocumentModel.create(documentNew);

      await FolderModel.updateOne(
        { _id: documentNew.folder },
        { $push: { documentsID: newDocument._id } },
        { new: true }
      );
      pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: newDocument });
      return newDocument;
    },

    /**
     * Delete document: delete one document of the user logged.
     * It deletes the document passed in the arguments if it belongs to the user logged.
     * This method deletes all the exercises, submissions and uploads related with the document ID.
     * args: document ID
     */
    deleteDocument: async (
      _,
      args: IMutationDeleteDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      const existDocument: IDocument | null = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (existDocument) {
        await FolderModel.updateOne(
          { _id: existDocument.folder }, // modifico los documentsID de la carpeta
          { $pull: { documentsID: existDocument._id } }
        );
        await UploadModel.deleteMany({ document: existDocument._id });
        await SubmissionModel.deleteMany({ document: existDocument._id });
        await ExerciseModel.deleteMany({ document: existDocument._id });
        return DocumentModel.deleteOne({ _id: args.id }); // delete all the document dependencies
      } else {
        throw new ApolloError(
          "You only can delete your documents",
          "DOCUMENT_NOT_FOUND"
        );
      }
    },

    /**
     *  Update document Content: update content of existing document.
     *  It updates document content with the new information provided.
     *  args: id, content and cache
     */
    updateDocumentContent: async (
      _,
      args: IMutationUpdateDocumentContentArgs,
      context: { user: IUserInToken }
    ) => {
      const existDocument: IDocument | null = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (existDocument) {
        const updatedDoc: IDocument | null = await DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          {
            $set: {
              content: args.content || existDocument.content,
              cache: args.cache || existDocument.cache,
              advancedMode:
                args.advancedMode !== undefined
                  ? args.advancedMode
                  : existDocument.advancedMode
            }
          },
          { new: true }
        );
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: updatedDoc });
        return updatedDoc;
      } else {
        return new ApolloError("Document does not exist", "DOCUMENT_NOT_FOUND");
      }
    },

    /**
     * Update document: update information of existing document.
     * It updates the document with the new information provided.
     * args: document ID, new document information.
     */
    updateDocument: async (
      _,
      args: IMutationUpdateDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      const existDocument: IDocument | null = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (args.input && args.input!.folder) {
        if (!(await FolderModel.findOne({ _id: args.input.folder }))) {
          throw new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
        }
      }
      if (existDocument) {
        if (
          args.input &&
          args.input.folder &&
          args.input &&
          args.input.folder !== String(existDocument.folder)
        ) {
          await FolderModel.updateOne(
            { _id: args.input.folder }, // modifico los documentsID de la carpeta
            { $push: { documentsID: existDocument._id } }
          );
          await FolderModel.updateOne(
            { _id: existDocument.folder }, // modifico los documentsID de la carpeta donde estaba el documento
            { $pull: { documentsID: existDocument._id } }
          );
        }
        if (
          (args.input && args.input.content) ||
          (args.input && args.input.cache)
        ) {
          console.log(
            "You should use Update document Content IMutation, USE_UPDATECONTENT_MUTATION"
          );
        }
        const updatedDoc: IDocument | null = await DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          {
            $set: {
              title: args.input
                ? args.input.title || existDocument.title
                : existDocument.title,
              type: args.input
                ? args.input.type || existDocument.type
                : existDocument.type,
              folder: args.input
                ? args.input.folder || existDocument.folder
                : existDocument.folder,
              content: args.input
                ? args.input.content || existDocument.content
                : existDocument.content,
              advancedMode:
                args.input && args.input.advancedMode
                  ? args.input.advancedMode
                  : existDocument.advancedMode,
              cache: args.input
                ? args.input.cache || existDocument.cache
                : existDocument.cache,
              description: args.input
                ? args.input.description || existDocument.description
                : existDocument.description,
              version: args.input
                ? args.input.version || existDocument.version
                : existDocument.version
            }
          },
          { new: true }
        );
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: updatedDoc });
        return updatedDoc;
      } else {
        return new ApolloError("Document does not exist", "DOCUMENT_NOT_FOUND");
      }
    },

    /**
     * setDocumentImage: mutation for uploading images to the document.
     * It could be an image uploaded by the user or a snapshot taken by the app.
     * args: imag: Upload and isSnapshot: Boolean
     */
    setDocumentImage: async (
      _,
      args: IMutationSetDocumentImageArgs,
      context: { user: IUserInToken }
    ) => {
      const docFound: IDocument | null = await DocumentModel.findOne({
        _id: args.id
      });
      if (!docFound) {
        return new ApolloError("Document does not exist", "DOCUMENT_NOT_FOUND");
      }
      const imageUploaded: IUpload = await uploadDocumentImage(
        args.image,
        docFound._id,
        context.user.userID
      );
      const image = imageUploaded.publicUrl;

      const updatedDoc = await DocumentModel.findOneAndUpdate(
        { _id: docFound._id },
        { $set: { image: { image, isSnapshot: args.isSnapshot } } },
        { new: true }
      );
      pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: updatedDoc });

      return updatedDoc;
    },

    /**
     * publish Document: only an admin user can publish a document.
     * A public document is an example file. Once the document is public, every user can see it.
     * args: document id, and public value.
     */
    publishDocument: async (
      _,
      args: IMutationPublishDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      const docFound: IDocument | null = await DocumentModel.findOne({
        _id: args.id
      });
      if (!docFound) {
        return new ApolloError("Document does not exist", "DOCUMENT_NOT_FOUND");
      }
      if (args.example && !args.public) {
        return new ApolloError(
          "Example documents must be also public",
          "EXAMPLE_DOCUMENT_MUST_BE_PUBLIC"
        );
      }
      return DocumentModel.findOneAndUpdate(
        { _id: docFound._id },
        { $set: { public: args.public, example: args.example } },
        { new: true }
      );
    }
  },
  Query: {
    /**
     * Documents: returns all the documents of the user logged.
     * args: nothing.
     */
    documents: async (_, __, context: { user: IUserInToken }) => {
      return DocumentModel.find({ user: context.user.userID });
    },
    /**
     * Document: returns the information of the document ID provided in the arguments.
     * args: document ID.
     */
    document: async (
      _,
      args: IQueryDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      if (!args.id || !args.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApolloError("Invalid or missing id", "DOCUMENT_NOT_FOUND");
      }
      const existDocument: IDocument | null = await DocumentModel.findOne({
        _id: args.id
      });
      if (!existDocument) {
        throw new ApolloError("Document does not exist", "DOCUMENT_NOT_FOUND");
      }
      if (String(existDocument.user) !== context.user.userID) {
        throw new ApolloError(
          "This ID does not belong to one of your documents",
          "NOT_YOUR_DOCUMENT"
        );
      }
      return existDocument;
    },

    /**
     * open public document: returns the information of the public document ID provided in the arguments.
     * args: public document ID.
     */
    openPublicDocument: async (_, args: IQueryOpenPublicDocumentArgs) => {
      if (!args.id || !args.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApolloError("Invalid or missing id", "DOCUMENT_NOT_FOUND");
      }
      const existDocument: IDocument | null = await DocumentModel.findOne({
        _id: args.id,
        public: true
      });
      if (!existDocument) {
        throw new ApolloError("Document does not exist", "DOCUMENT_NOT_FOUND");
      }
      return existDocument;
    },

    /**
     * Examples: returns all the examples in the platform.
     * args: nothing.
     */
    examples: async () => {
      return DocumentModel.find({ example: true });
    },

    /**
     * documentsAndFolders: returns all the documents and folders of the user logged in the order passed as argument.
     * It also returns the total number of pages, the parent folders path of the current location and the number of folders in the current location.
     * args: itemsPerPage: Number, order: String, searchTitle: String.
     */
    documentsAndFolders: async (
      _,
      args: IQueryDocumentsAndFoldersArgs,
      context: { user: IUserInToken }
    ) => {
      const user: IUser | null = await UserModel.findOne({
        _id: context.user.userID
      });
      if (!user) {
        return new AuthenticationError("You need to be logged in");
      }

      const currentLocation: string = args.currentLocation
        ? String(args.currentLocation)
        : String(user.rootFolder);
      const location: IFolder | null = await FolderModel.findOne({
        _id: currentLocation
      });
      if (!location) {
        return new ApolloError("Location does not exists", "FOLDER_NOT_FOUND");
      } else if (String(location.user) !== String(context.user.userID)) {
        return new AuthenticationError("Not your folder");
      }
      const itemsPerPage: number = args.itemsPerPage || 8;
      const skipN: number = ((args.currentPage || 1) - 1) * itemsPerPage;
      const limit: number = skipN + itemsPerPage;
      const text: string = args.searchTitle || "";

      const orderFunction = orderFunctions[args.order!];

      const filterOptionsDoc =
        text === ""
          ? {
              folder: currentLocation
            }
          : {};
      const filterOptionsFol =
        text === ""
          ? {
              parent: currentLocation
            }
          : {};

      const docs: IDocument[] = await DocumentModel.find({
        title: { $regex: `.*${text}.*`, $options: "i" },
        user: context.user.userID,
        ...filterOptionsDoc
      });
      const fols: IFolder[] = await FolderModel.find({
        name: { $regex: `.*${text}.*`, $options: "i" },
        user: context.user.userID,
        ...filterOptionsFol
      });

      const docsParent = await Promise.all(
        docs.map(
          async ({
            title,
            _id: id,
            createdAt,
            updatedAt,
            type,
            folder: parent,
            image,
            ...op
          }) => {
            return {
              title,
              id,
              createdAt,
              updatedAt,
              type,
              parent,
              image: image!.image,
              ...op
            };
          }
        )
      );
      const folsTitle = await Promise.all(
        fols.map(
          async ({
            name: title,
            _id: id,
            createdAt,
            updatedAt,
            parent,
            documentsID,
            foldersID,
            ...op
          }) => {
            return {
              title,
              id,
              createdAt,
              updatedAt,
              type: "folder",
              parent,
              ...op
            };
          }
        )
      );

      const allData = [...docsParent, ...folsTitle];
      const allDataSorted = allData.sort(orderFunction);
      const pagesNumber: number = Math.ceil(
        allDataSorted.length / itemsPerPage
      );
      const nFolders: number = await FolderModel.countDocuments({
        user: context.user.userID,
        parent: currentLocation
      });
      const folderLoc: IFolder | null = await FolderModel.findOne({
        _id: currentLocation
      });
      if (!folderLoc) {
        throw new ApolloError("Folder not found");
      }
      const parentsPath = getParentsPath(folderLoc);
      const result = allDataSorted.slice(skipN, limit);
      return {
        result,
        pagesNumber,
        nFolders,
        parentsPath
      };
    },

    documentPageWithFilters: async (
      _,
      args: any,
      context: { user: IUserInToken }
    ) => {
      console.log("llama funcion", args);
      const user: IUser | null = await UserModel.findOne({
        _id: context.user.userID
      });
      if (!user) {
        return new AuthenticationError("You need to be logged in");
      }
      const currentLocation: string = args.currentLocation
        ? String(args.currentLocation)
        : String(user.rootFolder);
      const location: IFolder | null = await FolderModel.findOne({
        _id: currentLocation
      });
      if (!location) {
        return new ApolloError("Location does not exists", "FOLDER_NOT_FOUND");
      } else if (String(location.user) !== String(context.user.userID)) {
        return new AuthenticationError("Not your folder");
      }
      const itemsPerPage: number = args.itemsPerPage || 8;
      const text: string = args.searchTitle || "";

      const orderFunction = orderFunctions[args.order!];

      const filterOptionsDoc =
        text === ""
          ? {
              folder: currentLocation
            }
          : {};
      const filterOptionsFol =
        text === ""
          ? {
              parent: currentLocation
            }
          : {};

      const docs: IDocument[] = await DocumentModel.find({
        title: { $regex: `.*${text}.*`, $options: "i" },
        user: context.user.userID,
        ...filterOptionsDoc
      });
      const fols: IFolder[] = await FolderModel.find({
        name: { $regex: `.*${text}.*`, $options: "i" },
        user: context.user.userID,
        ...filterOptionsFol
      });

      const docsParent = await Promise.all(
        docs.map(
          async ({
            title,
            _id: id,
            createdAt,
            updatedAt,
            type,
            folder: parent,
            image,
            ...op
          }) => {
            return {
              title,
              id,
              createdAt,
              updatedAt,
              type,
              parent,
              image: image!.image,
              ...op
            };
          }
        )
      );
      const folsTitle = await Promise.all(
        fols.map(
          async ({
            name: title,
            _id: id,
            createdAt,
            updatedAt,
            parent,
            documentsID,
            foldersID,
            ...op
          }) => {
            return {
              title,
              id,
              createdAt,
              updatedAt,
              type: "folder",
              parent,
              ...op
            };
          }
        )
      );

      const allData = [...docsParent, ...folsTitle];
      const allDataSorted = allData.sort(orderFunction);
      const docIndex: number = allDataSorted.findIndex(element => {
        return String(element.id) === String(args.documentID);
      });
      const page: number = Math.ceil(docIndex / itemsPerPage);
      return page;
    },

    hasExercises: async (
      _,
      args: IQueryHasExercisesArgs,
      context: { user: IUserInToken }
    ) => {
      let hasChildren: boolean;
      if (args.type === "folder") {
        const fol: IFolder | null = await FolderModel.findOne({
          _id: args.id,
          user: context.user.userID
        });
        if (!fol) {
          throw new ApolloError("Folder not found");
        }
        hasChildren = await hasDocsWithEx(fol);
      } else {
        hasChildren =
          (await ExerciseModel.find({
            document: args.id,
            user: context.user.userID
          })).length > 0;
      }
      return hasChildren;
    }
  },

  Document: {
    exercises: async (document: IDocument) =>
      ExerciseModel.find({ document: document._id }),
    images: async (document: IDocument) =>
      UploadModel.find({ document: document._id }),
    parentsPath: async (document: IDocument) => {
      const parent: IFolder | null = await FolderModel.findOne({
        _id: document.folder
      });
      if (!parent) {
        throw new ApolloError("Folder has no parent");
      }
      const result: IFolder[] = await getParentsPath(parent);
      return result;
    },
    resources: async (document: IDocument) => {
      const result: IResource[] | any = (await UploadModel.find({
        _id: { $in: document.resourcesID }
      })).map(i => {
        return {
          id: i._id,
          title: i.filename,
          type: i.type,
          size: i.size,
          thumbnail: i.image,
          preview: i.image,
          file: i.publicUrl,
          deleted: i.deleted,
          createdAt: i.createdAt
        };
      });
      return result;
    },
    exercisesResources: async (document: IDocument) => {
      const result: IResource[] | any = (await UploadModel.find({
        _id: { $in: document.exResourcesID }
      })).map(i => {
        return {
          id: i._id,
          title: i.filename,
          type: i.type,
          size: i.size,
          thumbnail: i.image,
          preview: i.image,
          file: i.publicUrl,
          deleted: i.deleted,
          createdAt: i.createdAt
        };
      });
      return result;
    }
  }
};

export default documentResolver;
