import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Document, Icon, Spinner, useTranslate } from "@bitbloq/ui";
import useUserData from "../lib/useUserData";
import DocumentInfoForm from "./DocumentInfoForm";
import EditTitleModal from "./EditTitleModal";
import PublishBar from "./PublishBar";
import HeaderRightContent from "./HeaderRightContent";
import UserInfo from "./UserInfo";
import {
  DOCUMENT_QUERY,
  CREATE_DOCUMENT_MUTATION,
  UPDATE_DOCUMENT_MUTATION,
  PUBLISH_DOCUMENT_MUTATION,
  SET_DOCUMENT_IMAGE_MUTATION
} from "../apollo/queries";
import { documentTypes } from "../config";

import debounce from "lodash/debounce";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

interface DocumentImage {
  image: string;
  isSnapshot: boolean;
}

interface EditDocumentProps {
  folder?: string;
  id: string;
  type: string;
}
const EditDocument: FC<EditDocumentProps> = ({ folder, id, type }) => {
  const t = useTranslate();

  const user = useUserData();
  const isPublisher = user && user.publisher;
  const isNew = id === "new";

  const [isEditTitleVisible, setIsEditTitleVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState({
    id: "",
    content: "[]",
    title: "",
    description: "",
    public: false,
    example: false,
    type,
    advancedMode: false
  });
  const [image, setImage] = useState<DocumentImage>();
  const imageToUpload = useRef(new Blob());

  const {
    loading: loadingDocument,
    error: errorDocument,
    data,
    refetch
  } = useQuery(DOCUMENT_QUERY, {
    variables: { id },
    skip: isNew
  });

  useEffect(
    () => {
      imageToUpload.current;
      if (firstLoad) {
        saveImage();
        if (
          document &&
          document.id &&
          image &&
          image.isSnapshot &&
          imageToUpload.current &&
          imageToUpload.current.size > 0
        ) {
          updateImage(document.id);
          setFirstLoad(false);
          setInterval(updateImage, 10 * 60 * 1000, document.id);
        }
      }
    },
    [imageToUpload.current]
  );

  useEffect(
    () => {
      if (isNew) {
        setLoading(false);
        setError(null);
      } else if (!loadingDocument && !errorDocument) {
        setDocument(data.document);
        setImage(data.document && data.document.image);
        setLoading(false);
        setError(null);
      } else if (errorDocument) {
        setError(errorDocument);
        setLoading(false);
      }
    },
    [loadingDocument]
  );

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [publishDocument] = useMutation(PUBLISH_DOCUMENT_MUTATION);
  const [setDocumentImage] = useMutation(SET_DOCUMENT_IMAGE_MUTATION);

  const saveImage = async () => {
    if (!image || image.isSnapshot) {
      const picture: HTMLElement | null = window.document.querySelector(
        ".image-snapshot"
      );
      if (picture) {
        const canvas: HTMLCanvasElement = await html2canvas(picture);
        const imgData: string = canvas.toDataURL("image/jpeg");

        if (imgData !== "data:,") {
          const file: Blob = dataURItoBlob(imgData);
          imageToUpload.current = file;
        }
      }
    }
  };

  const updateImage = (
    id: string,
    imageFile?: Blob,
    isImageSnapshot?: boolean
  ) => {
    const image = imageFile || imageToUpload.current;
    const isSnapshot = isImageSnapshot === undefined ? true : isImageSnapshot;
    setImage({ image: "udpated", isSnapshot });

    if (isSnapshot) {
      setImage({ image: "blob", isSnapshot: true });
    }

    if (image.size > 0) {
      setDocumentImage({
        variables: {
          id,
          image,
          isSnapshot
        }
      }).catch(e => {
        return setError(e);
      });
    }
  };

  const debouncedUpdate = useCallback(
    debounce(async (document: any) => {
      saveImage();
      await updateDocument({ variables: { ...document, id } }).catch(e => {
        return setError(e);
      });
      refetch();
    }, 1000),
    [id]
  );

  useEffect(
    () => {
      setImage(data && data.document && data.document.image);
    },
    [data]
  );

  const dataURItoBlob = (dataURI: string): Blob => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    let mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  };

  const update = async (document: any) => {
    setDocument(document);
    if (isNew) {
      const result = await createDocument({
        variables: {
          ...document,
          folder: folder,
          title: document.title || t("untitled-project")
        }
      }).catch(e => {
        return setError(e);
      });
      if (result) {
        const {
          data: {
            createDocument: { id: newId }
          }
        } = result;
        Router.replace(`/app/edit-document/${folder}/${type}/${newId}`);
      }
    } else {
      debouncedUpdate(document);
    }
  };

  const publish = async (isPublic: boolean, isExample: boolean) => {
    if (!isNew) {
      setDocument({ ...document, public: isPublic, example: isExample });
      await publishDocument({
        variables: { id, public: isPublic, example: isExample }
      });
      refetch();
    }
  };

  const documentType = documentTypes[type];

  const onEditTitle = useCallback(() => {
    setIsEditTitleVisible(true);
  }, []);

  const onTabChange = useCallback((tabIndex: number) => {
    setTabIndex(tabIndex);
  }, []);

  if (loading) return <Loading color={documentType.color} />;
  if (error) return <GraphQLErrorMessage apolloError={error!} />;

  const {
    title,
    description,
    public: isPublic,
    example: isExample,
    advancedMode
  } = document || {};

  window.sessionStorage.setItem("advancedMode", `${advancedMode}`);

  const location = window.location;
  const publicUrl = `${location.protocol}//${
    location.host
  }/app/public-document/${type}/${id}`;

  const EditorComponent = documentType.editorComponent;

  let content: any;
  try {
    content = JSON.parse(document.content);
  } catch (e) {
    console.warn("Error parsing document content", e);
  }

  const onSaveTitle = (title: string) => {
    update({ ...document, title: title || t("untitled-project") });
    setIsEditTitleVisible(false);
  };

  const onContentChange = (content: any[]) => {
    update({
      ...document,
      content: JSON.stringify(content)
    });
  };

  const onSetAdvancedMode = (advancedMode: boolean) => {
    update({
      ...document,
      advancedMode
    });
  };

  const onChangePublic = (isPublic: boolean, isExample: boolean) => {
    if (publish) {
      publish(isPublic, isExample);
    }
  };

  const onSaveDocument = () => {
    const documentJSON = {
      type,
      title: title || `document${type}`,
      description: description || `bitbloq ${type} document`,
      content: JSON.stringify(content),
      advancedMode: document.advancedMode,
      image
    };

    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });

    saveAs(blob, `${documentJSON.title}.bitbloq`);
  };

  const InfoTab = (
    <Document.Tab
      key="info"
      icon={<Icon name="info" />}
      label={t("tab-project-info")}
    >
      <DocumentInfoForm
        title={title}
        description={description}
        image={image ? image.image : ""}
        onChange={({ title, description, image }) => {
          const newDocument = {
            ...document,
            title: title || t("untitled-project"),
            description: description || t("document-body-description")
          };
          if (image) {
            updateImage(document.id, image, false);
          }
          update(newDocument);
        }}
      />
    </Document.Tab>
  );

  const headerRightContent: JSX.Element = (
    <HeaderRightContent>
      <UserInfo name={user && user.name} />
    </HeaderRightContent>
  );

  return (
    <>
      <EditorComponent
        brandColor={documentType.color}
        content={content}
        tabIndex={tabIndex}
        onTabChange={onTabChange}
        getTabs={(mainTabs: any[]) => [...mainTabs, InfoTab]}
        title={title}
        onEditTitle={onEditTitle}
        onSaveDocument={onSaveDocument}
        onContentChange={(content: any[]) => onContentChange(content)}
        preMenuContent={
          isPublisher && (
            <PublishBar
              isPublic={isPublic}
              isExample={isExample}
              onChange={onChangePublic}
              url={isPublic ? publicUrl : ""}
            />
          )
        }
        changeAdvancedMode={onSetAdvancedMode}
        documentAdvancedMode={advancedMode}
        headerRightContent={headerRightContent}
        backCallback={() => Router.push("/")}
      />
      {isEditTitleVisible && (
        <EditTitleModal
          title={title}
          onCancel={() => setIsEditTitleVisible(false)}
          onSave={onSaveTitle}
          modalTitle="Cambiar nombre del documento"
          modalText="Nombre del documento"
          placeholder="Documento sin título"
          saveButton="Cambiar"
        />
      )}
    </>
  );
};

export default EditDocument;

/* styled components */

interface LoadingProps {
  color: string;
}
const Loading = styled(Spinner)<LoadingProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${(props: LoadingProps) => props.color};
`;
