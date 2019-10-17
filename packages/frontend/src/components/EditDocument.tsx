import React, {
  Dispatch,
  FC,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from "react";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Document, Icon, Spinner, useTranslate } from "@bitbloq/ui";
import { navigate } from "gatsby";
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
  ME_QUERY
} from "../apollo/queries";
import { documentTypes } from "../config";

import debounce from "lodash/debounce";

interface EditDocumentProps {
  folder?: string;
  id: string;
  type: string;
}
const EditDocument: FC<EditDocumentProps> = ({ folder, id, type }) => {
  const t = useTranslate();
  let imageToUpload: Blob = new Blob();

  const user = useUserData();
  const isPublisher = user && user.publisher;
  const isNew = id === "new";

  const [isEditTitleVisible, setIsEditTitleVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState({
    content: "[]",
    title: "",
    description: "",
    public: false,
    example: false,
    type,
    advancedMode: false
  });
  const [image, setImage] = useState("");

  const { loading: loadingDocument, error, data, refetch } = useQuery(
    DOCUMENT_QUERY,
    {
      variables: { id },
      skip: isNew
    }
  );

  useEffect(() => {
    let updateInterval: any, saveUpdate: any;
    if (!loadingDocument) {
      window.addEventListener(
        "unload",
        event => {
          event.preventDefault();
          updateImage();
        },
        true
      );
      saveImage();
      updateInterval = setInterval(updateImage, 10 * 60 * 1000);
      saveUpdate = setInterval(saveImage, 30 * 1000);
    }

    return () => (
      window.removeEventListener("unload", event => {
        updateImage();
      }),
      clearInterval(updateInterval),
      clearInterval(saveUpdate)
    );
  }, [loadingDocument]);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
    } else if (!loadingDocument) {
      setDocument(data.document);
      setImage(data.document && data.document.image);
      setLoading(false);
    }
  }, [loadingDocument]);

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [publishDocument] = useMutation(PUBLISH_DOCUMENT_MUTATION);

  const saveImage = async () => {
    if (!image || !image.match(/^http/) || image.match(/blob$/)) {
      const picture: HTMLElement | null = window.document.querySelector(
        ".image-snapshot"
      );
      if (picture) {
        const canvas: HTMLCanvasElement = await html2canvas(picture);
        const imgData: string = canvas.toDataURL("image/jpeg");

        if (imgData !== "data:,") {
          const file: Blob = dataURItoBlob(imgData);
          imageToUpload = file;
        }
      }
    }
  };

  const updateImage = () => {
    if (imageToUpload && imageToUpload.size > 0) {
      updateDocument({ variables: { image: imageToUpload, id } });
    }
  };

  const debouncedUpdate = useCallback(
    debounce(async (document: any, image: string) => {
      await updateDocument({ variables: { ...document, id } });
      refetch();
    }, 1000),
    [id]
  );

  useEffect(() => {
    setImage(data && data.document && data.document.image);
  }, [data]);

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
      const {
        data: {
          createDocument: { id: newId }
        }
      } = await createDocument({
        variables: {
          ...document,
          folder: folder,
          title: document.title || "Documento sin título"
        }
      });
      navigate(`/app/document/${folder}/${type}/${newId}`, { replace: true });
    } else {
      debouncedUpdate(document, image);
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

  if (loading) return <Loading color={documentType.color} />;

  const {
    title,
    description,
    public: isPublic,
    example: isExample,
    advancedMode
  } = document || {};

  window.sessionStorage.setItem("advancedMode", `${advancedMode}`);

  const location = window.location;
  const publicUrl = `${location.protocol}//${location.host}/app/public-document/${type}/${id}`;

  const EditorComponent = documentType.editorComponent;

  let content: any[] = [];
  try {
    content = JSON.parse(document.content);
  } catch (e) {
    console.warn("Error parsing document content", e);
  }

  const onEditTitle = () => {
    setIsEditTitleVisible(true);
  };

  const onSaveTitle = (title: string) => {
    update({ ...document, title, image: undefined });
    setIsEditTitleVisible(false);
  };

  const onContentChange = (content: any[]) => {
    update({
      ...document,
      content: JSON.stringify(content),
      image: undefined
    });
  };

  const onSetAdvancedMode = (advancedMode: boolean) => {
    update({
      ...document,
      advancedMode,
      image: undefined
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
        image={image}
        onChange={({ title, description, image }) => {
          const newDocument = { ...document, title, description, image };
          if (!image || typeof image === "string") {
            delete newDocument.image;
          }
          update(newDocument);
        }}
      />
    </Document.Tab>
  );

  const headerRightContent: JSX.Element = (
    <HeaderRightContent>
      <UserInfo name={user.name} />
    </HeaderRightContent>
  );

  return (
    <>
      <EditorComponent
        brandColor={documentType.color}
        canEditTitle={true}
        content={content}
        tabIndex={tabIndex}
        onTabChange={(tabIndex: number) => setTabIndex(tabIndex)}
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
        backCallback={() => navigate("/")}
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
