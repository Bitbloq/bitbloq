import React, { FC, useLayoutEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Icon, colors, DialogModal, DropDown } from "@bitbloq/ui";
import { useDrop } from "react-dnd";

import DocumentCard from "./DocumentCard";
import EditTitleModal from "./EditTitleModal";
import DocumentCardMenu from "./DocumentCardMenu";

import { css } from "@emotion/core";

import {
  UPDATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  UPDATE_FOLDER_MUTATION,
  DELETE_FOLDER_MUTATION,
  CREATE_DOCUMENT_MUTATION
} from "../apollo/queries";
import FolderSelectorMenu from "./FolderSelectorMenu";
import Paginator from "./Paginator";

interface Folder {
  name: string;
  id: string;
}
export interface DocumentListProps {
  currentPage: number;
  docsAndFols?: any;
  pagesNumber: number;
  parentsPath?: any;
  className?: string;
  currentLocation?: Folder;
  onFolderClick?: (e) => any;
  onDocumentClick?: (e) => any;
  refetchDocsFols: () => any;
  selectPage: (page: number) => void;
  setItemsPerPage: (page: number) => void;
  nFolders: number;
}

const DocumentListComp: FC<DocumentListProps> = ({
  currentPage,
  docsAndFols,
  pagesNumber,
  parentsPath,
  currentLocation,
  className,
  onFolderClick,
  onDocumentClick,
  refetchDocsFols,
  selectPage,
  setItemsPerPage,
  nFolders
}) => {
  const [deleteDoc, setDeleteDoc] = useState({
    id: null,
    hasChildren: null
  });
  const [deleteFol, setDeleteFol] = useState({
    id: null,
    hasChildren: null
  });
  const [editDocTitleModal, setEditDocTitleModal] = useState({
    id: null,
    title: null
  });
  const [editFolderNameModal, setEditFolderNameModal] = useState({
    id: null,
    name: null
  });
  const [menuOpenId, setMenuOpenId] = useState("");
  const [docWithEx, setDocWithEx] = useState(false);
  const [folWithChildren, setFolWithChildren] = useState(false);
  const [selectedToMove, setSelectedToMove] = useState({
    id: null,
    parent: null
  });
  const [draggingItemId, setDraggingItemId] = useState("");
  const [droppedItemId, setDroppedItemId] = useState("");

  const docsAndFoldsRef = useRef<HTMLDivElement[]>(new Array(8));
  const gridRef = useRef<HTMLDivElement>(null);

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT_MUTATION);
  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);
  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION);

  const checkItemsPerPage = () => {
    const positionInit = gridRef.current ? gridRef.current.offsetTop : 0;
    const positionLimit =
      window.innerHeight - // window height
      54 - // footer height
      60 - // footer - paginator margin
      34 - // paginator height
      40; // paginator - list margin

    let rows = gridRef.current
      ? Math.floor((positionLimit - positionInit) / 240)
      : 0;

    const itemsPerRow = gridRef.current
      ? Math.floor(
          gridRef.current.clientWidth / docsAndFoldsRef.current[0].clientWidth
        )
      : 0;

    if (rows * itemsPerRow !== 0) {
      setItemsPerPage(rows * itemsPerRow || 8);
    }
  };

  useLayoutEffect(() => {
    checkItemsPerPage();
    window.addEventListener("resize", checkItemsPerPage);
  });

  const [, drop] = useDrop({
    accept: ["document", "folder"],
    drop: () => {}
  });

  const onDocumentMenuClick = (e, document) => {
    e.stopPropagation();
    if (menuOpenId === document.id) {
      setMenuOpenId("");
      setSelectedToMove({
        id: null,
        parent: null
      });
    } else {
      setMenuOpenId(document.id);
      setSelectedToMove({
        id: null,
        parent: null
      });
    }
  };

  const onDocumentRenameClick = (e, document) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setEditDocTitleModal({ id: document.id, title: document.title });
  };

  const onDocumentDeleteClick = (e, document) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setDeleteDoc({ id: document.id, hasChildren: document.hasChildren });
  };

  const confirmDeleteDoc = () => {
    if (deleteDoc.hasChildren) {
      setDocWithEx(true);
      return;
    } else {
      onDeleteDocument();
      return;
    }
  };

  const onDeleteDocument = async () => {
    await deleteDocument({
      variables: { id: deleteDoc.id }
    });
    refetchDocsFols();
    setDeleteDoc({ id: null, hasChildren: null });
    setDocWithEx(false);
  };

  const onFolderRenameClick = (e, folder) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setEditFolderNameModal({ id: folder.id, name: folder.name });
  };

  const onFolderDeleteClick = (e, folder) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setDeleteFol({ id: folder.id, hasChildren: folder.hasChildren });
  };

  const confirmDeleteFol = () => {
    if (deleteFol.hasChildren) {
      setFolWithChildren(true);
      return;
    } else {
      onDeleteFolder();
      return;
    }
  };

  const onDeleteFolder = async () => {
    await deleteFolder({
      variables: { id: deleteFol.id }
    });
    refetchDocsFols();
    setFolWithChildren(false);
    setDeleteFol({ id: null, hasChildren: null });
  };

  const onUpdateDocTitle = async docTitle => {
    await updateDocument({
      variables: {
        id: editDocTitleModal.id,
        title: docTitle ? docTitle : "Documento sin título"
      }
    });
    refetchDocsFols();
    setEditDocTitleModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onUpdateFolderName = async folderName => {
    await updateFolder({
      variables: {
        id: editFolderNameModal.id,
        input: { name: folderName ? folderName : "Carpeta sin título" }
      }
    });
    refetchDocsFols();
    setEditFolderNameModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onDuplicateDocument = async (e, document) => {
    e.stopPropagation();
    let newTitle: string = `${document.title} copia`;

    if (newTitle.length >= 64) {
      newTitle = newTitle.slice(0, 63);
    }

    await createDocument({
      variables: {
        ...document,
        image: {
          image: document.image,
          isSnapshot: document.image.indexOf("blob") > -1
        },
        title: newTitle,
        folder: currentLocation.id
      }
    });
    refetchDocsFols();
    setMenuOpenId("");
  };

  const onMoveDocumentClick = async (e, document) => {
    e.stopPropagation();
    if (selectedToMove.id) {
      setSelectedToMove({
        id: null,
        parent: null
      });
    } else {
      setSelectedToMove({ id: document.id, parent: document.parent });
    }
  };
  const onMoveFolderClick = async (e, folder) => {
    e.stopPropagation();
    if (selectedToMove.id) {
      setSelectedToMove({
        id: null,
        parent: null
      });
    } else {
      setSelectedToMove({ id: folder.id, parent: folder.parent });
    }
  };

  const onMove = () => {
    refetchDocsFols();
    setMenuOpenId(null);
    setSelectedToMove({
      id: null,
      parent: null
    });
    if (
      pagesNumber > 1 &&
      pagesNumber === currentPage &&
      docsAndFols.length === 1
    ) {
      selectPage(currentPage - 1);
    }
  };

  const onMoveDocument = async (e, folder, documentId?) => {
    e && e.stopPropagation();
    await updateDocument({
      variables: { id: documentId || selectedToMove.id, folder: folder.id }
    });
    onMove();
  };
  const onMoveFolder = async (e, folderParent, folderMovedId?) => {
    e && e.stopPropagation();
    await updateFolder({
      variables: {
        id: folderMovedId || selectedToMove.id,
        input: { parent: folderParent.id }
      }
    });
    onMove();
  };

  return (
    <>
      <DocumentsAndPaginator ref={drop}>
        <DocumentList className={className} ref={gridRef}>
          {docsAndFols &&
            docsAndFols.map((document: any, index: number) => (
              <StyledDocumentCard
                ref={(el: HTMLDivElement) =>
                  (docsAndFoldsRef.current[index] = el)
                }
                beginFunction={() => setDraggingItemId(document.id)}
                endFunction={() => setDraggingItemId("")}
                draggable={
                  (document.type === "folder" && nFolders > 1) ||
                  (document.type !== "folder" && nFolders > 0)
                }
                dropDocumentCallback={() => {
                  onMoveDocument(undefined, document, draggingItemId);
                }}
                dropFolderCallback={() => {
                  setDroppedItemId(draggingItemId);
                  onMoveFolder(undefined, document, draggingItemId);
                }}
                hidden={document.id === droppedItemId}
                key={document.id}
                document={document}
                onClick={e =>
                  document.type === "folder"
                    ? onFolderClick && onFolderClick(document)
                    : onDocumentClick && onDocumentClick(document)
                }
              >
                <DropDown
                  constraints={[
                    {
                      attachment: "together",
                      to: "window"
                    }
                  ]}
                  closeOnClick={!(selectedToMove.id === document.id)}
                  targetOffset="-165px -14px"
                  targetPosition="top right"
                >
                  {(isOpen: boolean) => (
                    <DocumentMenuButton
                      isOpen={menuOpenId === document.id}
                      onClick={e => onDocumentMenuClick(e, document)}
                    >
                      <Icon name="ellipsis" />
                    </DocumentMenuButton>
                  )}
                  <DropDown
                    constraints={[
                      {
                        attachment: "together",
                        to: "window"
                      }
                    ]}
                    closeOnClick={!(selectedToMove.id === document.id)}
                    targetPosition="top right"
                    attachmentPosition="top left"
                    offset="60px 0"
                  >
                    {(isOpen: boolean) => (
                      <DocumentCardMenu
                        options={[
                          {
                            iconName: "pencil",
                            label: "Cambiar nombre",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              setMenuOpenId("");
                              document.type !== "folder"
                                ? onDocumentRenameClick(e, document)
                                : onFolderRenameClick(e, document);
                            }
                          },
                          {
                            iconName: "duplicate",
                            label: "Crear una copia",
                            disabled: document.type === "folder",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              setMenuOpenId("");
                              document.type !== "folder"
                                ? onDuplicateDocument(e, document)
                                : null;
                            }
                          },
                          {
                            selected: document.id === selectedToMove.id,
                            disabled:
                              ((document.type === "folder" && nFolders === 1) ||
                                (document.type !== "folder" &&
                                  nFolders === 0)) &&
                              parentsPath.length === 1,
                            iconName: "move-document",
                            label: "Mover a",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              document.type !== "folder"
                                ? onMoveDocumentClick(e, document)
                                : onMoveFolderClick(e, document);
                            }
                          },
                          {
                            iconName: "trash",
                            label:
                              document.type !== "folder"
                                ? "Eliminar documento"
                                : "Eliminar carpeta",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              setMenuOpenId("");
                              document.type !== "folder"
                                ? onDocumentDeleteClick(e, document)
                                : onFolderDeleteClick(e, document);
                            },
                            red: true
                          }
                        ]}
                      />
                    )}
                    {selectedToMove.id === document.id && (
                      <FolderSelectorMenu
                        selectedToMove={selectedToMove}
                        onMove={
                          document.type !== "folder"
                            ? onMoveDocument
                            : onMoveFolder
                        }
                        currentLocation={currentLocation}
                      />
                    )}
                  </DropDown>
                </DropDown>
              </StyledDocumentCard>
            ))}
        </DocumentList>
        <DocumentsPaginator
          currentPage={currentPage}
          pages={pagesNumber}
          selectPage={selectPage}
        />
      </DocumentsAndPaginator>
      <DialogModal
        isOpen={!!deleteDoc.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar este documento?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDeleteDoc}
        onCancel={() => setDeleteDoc({ id: null, hasChildren: null })}
      />
      <DialogModal
        isOpen={!!deleteFol.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar esta carpeta?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDeleteFol}
        onCancel={() => setDeleteFol({ id: null, hasChildren: null })}
      />
      <DialogModal
        isOpen={!!docWithEx}
        title="Aviso"
        text="Has creado ejercicios a partir de este documento, si lo eliminas, eliminarás también estos ejercicios y sus entregas. ¿Seguro que quieres hacerlo?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteDocument}
        onCancel={() => {
          setDeleteDoc({ id: null, hasChildren: null });
          setDocWithEx(false);
        }}
      />

      <DialogModal
        isOpen={!!folWithChildren}
        title="Aviso"
        text="Has creado ejercicios en los documentos que contiene esta carpeta, si los eliminas, eliminarás también estos ejercicios y sus entregas. ¿Seguro que quieres hacerlo?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteFolder}
        onCancel={() => {
          setDeleteFol({ id: null, hasChildren: null });
          setFolWithChildren(false);
        }}
      />

      {editDocTitleModal.id && (
        <EditTitleModal
          title={editDocTitleModal.title}
          onCancel={() => setEditDocTitleModal({ id: null, title: null })}
          onSave={onUpdateDocTitle}
          modalTitle="Cambiar nombre del documento"
          modalText="Nombre del documento"
          placeholder={editDocTitleModal.title}
          saveButton="Cambiar"
        />
      )}
      {editFolderNameModal.id && (
        <EditTitleModal
          title={editFolderNameModal.name}
          onCancel={() => setEditFolderNameModal({ id: null, name: null })}
          onSave={onUpdateFolderName}
          modalTitle="Cambiar nombre de la carpeta"
          modalText="Nombre de la carpeta"
          placeholder={editFolderNameModal.name}
          saveButton="Cambiar"
        />
      )}
    </>
  );
};

export default DocumentListComp;

const DocumentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 1fr;
  grid-column-gap: 40px;
  grid-row-gap: 40px;
  margin-bottom: 40px;

  &::before {
    content: "";
    width: 0px;
    padding-bottom: 85.7%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  & > div:first-of-type {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
`;

const DocumentMenuButton = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 14px;
  top: 14px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  background-color: white;
  display: none;

  &:hover {
    background-color: ${colors.gray1};
    border-color: ${colors.gray4};
  }

  ${props =>
    props.isOpen &&
    css`
      display: flex;
      border: solid 1px #dddddd;
      background-color: "red";
    `} svg {
    transform: rotate(90deg);
  }
`;

const DocumentsAndPaginator = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  justify-content: space-between;
  width: 100%;
`;

const DocumentsPaginator = styled(Paginator)`
  margin-bottom: 60px;
`;

const StyledDocumentCard = styled(DocumentCard)`
  &:hover {
    ${DocumentMenuButton} {
      display: flex;
    }
  }
`;
