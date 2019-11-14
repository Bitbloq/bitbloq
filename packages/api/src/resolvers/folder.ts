import { ApolloError, withFilter } from "apollo-server-koa";
import { documentModel, IDocument } from "../models/document";
import { folderModel, IFolder } from "../models/folder";
import { IUser, userModel } from "../models/user";
import documentResolver from "./document";

import { pubsub } from "../server";
import { getParentsPath } from "../utils";
import { IUserInToken } from "../models/interfaces";
import {
  IMutationCreateFolderArgs,
  IMutationDeleteFolderArgs,
  IMutationUpdateFolderArgs,
  IQueryFolderArgs
} from "../api-types";

const FOLDER_UPDATED: string = "FOLDER_UPDATED";

const folderResolver = {
  Subscription: {
    folderUpdated: {
      subscribe: withFilter(
        // Filtra para devolver solo los documentos del usuario
        () => pubsub.asyncIterator([FOLDER_UPDATED]),
        (
          payload: { folderUpdated: IFolder },
          variables,
          context: { user: IUserInToken }
        ) => {
          return (
            String(context.user.userID) === String(payload.folderUpdated.user)
          );
        }
      )
    }
  },

  Mutation: {
    /**
     * Create folder: create a new empty folder.
     * args: folder information
     */
    createFolder: async (
      _,
      args: IMutationCreateFolderArgs,
      context: { user: IUserInToken }
    ) => {
      const user: IUser = await userModel.findOne({ _id: context.user.userID });
      if (args.input.parent) {
        if (!(await folderModel.findOne({ _id: args.input.parent }))) {
          throw new ApolloError(
            "Parent folder does not exist",
            "PARENT_NOT_FOUND"
          );
        }
      }
      const folderNew: IFolder = new folderModel({
        name: args.input.name,
        user: context.user.userID,
        parent: args.input.parent || user.rootFolder
      });
      const newFolder: IFolder = await folderModel.create(folderNew);
      await folderModel.findOneAndUpdate(
        { _id: folderNew.parent },
        { $push: { foldersID: newFolder._id } },
        { new: true }
      );
      pubsub.publish(FOLDER_UPDATED, { folderUpdated: newFolder });
      return newFolder;
    },

    /**
     * Delete folder: delete one folder of the user logged.
     * It deletes the folder passed in the arguments if it belongs to the user logged.
     * The method deletes all the documents inside de document
     * args: folder ID
     */
    deleteFolder: async (
      _,
      args: IMutationDeleteFolderArgs,
      context: { user: IUserInToken }
    ) => {
      const existFolder: IFolder = await folderModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!existFolder) {
        throw new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
      }
      if (existFolder.name === "root") {
        throw new ApolloError(
          "You can not delete your Root folder",
          "CANT_DELETE_ROOT"
        );
      }
      if (existFolder) {
        if (existFolder.documentsID.length > 0) {
          for (const document of existFolder.documentsID) {
            await documentResolver.Mutation.deleteDocument(
              _,
              { id: document },
              context
            );
            await folderModel.updateOne(
              { _id: existFolder.parent },
              { $pull: { documentsID: document } },
              { new: true }
            );
          }
        }
        if (existFolder.foldersID.length > 0) {
          for (const folder of existFolder.foldersID) {
            await folderResolver.Mutation.deleteFolder(
              _,
              { id: folder },
              context
            );
          }
        }
        await folderModel.updateOne(
          { _id: existFolder.parent },
          { $pull: { foldersID: existFolder._id } },
          { new: true }
        );
        return folderModel.deleteOne({ _id: args.id });
      } else {
        return new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
      }
    },

    /**
     * Update folder: update existing folder.
     * It updates the folder with the new information provided.
     * args: folder ID, new folder information.
     */
    updateFolder: async (
      _,
      args: IMutationUpdateFolderArgs,
      context: { user: IUserInToken }
    ) => {
      const existFolder: IFolder = await folderModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (args.input.parent) {
        if (!(await folderModel.findOne({ _id: args.input.parent }))) {
          throw new ApolloError(
            "Parent folder does not exist",
            "PARENT_NOT_FOUND"
          );
        }
      }
      if (!existFolder) {
        throw new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
      }
      if (existFolder) {
        if (args.input.foldersID) {
          // si se pasa lista de carpetas hay que modificarlas para añadirlas el parent
          for (const folder of args.input.foldersID) {
            const fol: IFolder = await folderModel.findOne({ _id: folder });
            if (!fol) {
              throw new ApolloError(
                "Folder ID does not exist",
                "FOLDER_NOT_FOUND"
              );
            }
            await folderModel.updateOne(
              // quito la carpeta de la carpeta en la que estuviera
              { _id: fol.parent },
              { $pull: { foldersID: folder } },
              { new: true }
            );
            await folderModel.updateOne(
              // actualizo la carpeta con el nuevo padre
              { _id: folder },
              { parent: existFolder._id }
            );
            await folderModel.updateOne(
              { _id: existFolder._id },
              { $push: { foldersID: folder } }, // añado la nueva carpeta a los hijos de la carpeta
              { new: true }
            );
          }
        }
        if (args.input.documentsID) {
          // si se pasa lista de documentos hay que modificarlos para añadir la carpeta
          for (const document of args.input.documentsID) {
            const doc: IDocument = await documentModel.findOne({
              _id: document
            });
            if (!doc) {
              throw new ApolloError(
                "Document ID does not exist",
                "DOCUMENT_NOT_FOUND"
              );
            }
            await folderModel.updateOne(
              // quito el documento de la carpeta en la que estuviera
              { _id: doc.folder },
              { $pull: { documentsID: document } },
              { new: true }
            );
            await documentModel.updateOne(
              // actualizo el documento con la nueva carpeta
              { _id: document },
              { folder: existFolder._id }
            );
            await folderModel.updateOne(
              { _id: existFolder._id },
              { $push: { documentsID: document } }, // añado el nuevo document a los hijos de la carpeta
              { new: true }
            );
          }
        }
        if (args.input.parent && args.input.parent !== existFolder.parent) {
          // si se pasa un nuevo parent hay que modificarlo para que tenga al hijo en la lista
          await folderModel.updateOne(
            { _id: args.input.parent },
            { $push: { foldersID: existFolder._id } }
          );
          await folderModel.updateOne(
            { _id: existFolder.parent },
            { $pull: { foldersID: existFolder._id } }
          );
        }
        if (existFolder.name === "root" && args.input.name) {
          throw new ApolloError(
            "You can not update your Root folder name",
            "CANT_UPDATE_ROOT"
          );
        }
        const updatedFolder: IFolder = await folderModel.findOneAndUpdate(
          { _id: existFolder._id },
          {
            $set: {
              name: args.input.name || existFolder.name,
              parent: args.input.parent || existFolder.parent
            }
          },
          { new: true }
        );
        pubsub.publish(FOLDER_UPDATED, { folderUpdated: updatedFolder });
        return updatedFolder;
      } else {
        return new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
      }
    }
  },

  Query: {
    /**
     * Folders: returns all the folders of the user logged.
     * args: nothing.
     */
    folders: async (_, __, context: { user: IUserInToken }) => {
      return folderModel.find({ user: context.user.userID });
    },

    /**
     * Folder: returns the information of the folder ID provided in the arguments.
     * args: folder ID.
     */
    folder: async (
      _,
      args: IQueryFolderArgs,
      context: { user: IUserInToken }
    ) => {
      const existFolder: IFolder = await folderModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!existFolder) {
        throw new ApolloError("Folder does not exist", "FOLDER_NOT_FOUND");
      }
      return existFolder;
    },

    /**
     * Root: returns the root folder of the user logged.
     * args: nothing.
     */
    rootFolder: async (_, __, context: { user: IUserInToken }) => {
      return folderModel.findOne({
        name: "root",
        user: context.user.userID
      });
    }
  },

  Folder: {
    documents: async (folder: IFolder) =>
      documentModel.find({ folder: folder.id }),
    folders: async (folder: IFolder) => folderModel.find({ parent: folder.id }),
    parentsPath: async (folder: IFolder) => {
      const result = await getParentsPath(folder);
      return result;
    }
  }
};

export default folderResolver;
