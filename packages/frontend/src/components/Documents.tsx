import React, { FC, useEffect, useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import {
  Button,
  colors,
  Icon,
  DropDown,
  Select,
  Spinner,
  Input,
  HorizontalRule
} from "@bitbloq/ui";
import { navigate } from "gatsby";
import { Subscription } from "react-apollo";
import debounce from "lodash/debounce";
import AppHeader from "./AppHeader";
import NewDocumentDropDown from "./NewDocumentDropDown";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import useUserData from "../lib/useUserData";
import {
  CREATE_DOCUMENT_MUTATION,
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_BY_CODE_QUERY,
  CREATE_FOLDER_MUTATION,
  DOCS_FOLDERS_PAGE_QUERY
} from "../apollo/queries";
import NewExerciseButton from "./NewExerciseButton";
import EditTitleModal from "./EditTitleModal";
import DocumentListComp from "./DocumentsList";

import Breadcrumbs from "./Breadcrumbs";
import AppFooter from "./Footer";
import Paginator from "./Paginator";
import { ApolloError } from "apollo-client";

enum OrderType {
  Creation = "creation",
  Modification = "modification",
  NameAZ = "nameAZ",
  NameZA = "nameZA"
}

const orderOptions = [
  {
    label: "Orden: Creación",
    value: OrderType.Creation
  },
  {
    label: "Orden: Modificación",
    value: OrderType.Modification
  },
  {
    label: "Orden: Nombre A-Z",
    value: OrderType.NameAZ
  },
  {
    label: "Orden: Nombre Z-A",
    value: OrderType.NameZA
  }
];

const Documents: FC<{ id?: string }> = ({ id }) => {
  const userData = useUserData();
  const client = useApolloClient();

  const [order, setOrder] = useState(OrderType.Creation);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [folderTitleModal, setFolderTitleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLocation] = useState({
    id: id ? id : userData ? userData.rootFolder : null,
    name: "root"
  });
  const [breadcrumbLinks, setBreadcrumbsLinks] = useState([
    {
      route: userData ? "/" : "",
      text: userData ? "Mis documentos" : "",
      type: ""
    }
  ]);

  let openFile = React.createRef<HTMLInputElement>();

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [createFolder] = useMutation(CREATE_FOLDER_MUTATION);
  const [documentsData, setDocumentsData] = useState<any>({});
  const [error, setError] = useState<ApolloError>();

  const {
    data: resultData,
    loading,
    error: errorQuery,
    refetch: refetchDocsFols
  } = useQuery(DOCS_FOLDERS_PAGE_QUERY, {
    variables: {
      currentLocation: currentLocation.id,
      currentPage: currentPage,
      order: order,
      searchTitle: searchQuery,
      itemsPerPage: 8
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (!loading && !errorQuery) {
      setError(null);
      setDocumentsData(resultData);
    }
    if (errorQuery) {
      setError(errorQuery);
    }
  }, [loading, errorQuery]);

  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);

  const onFolderClick = async ({ id, title }) => {
    window.open(`/app/folder/${id}`, "_self");
  };

  const onDocumentClick = ({ id, type, title }) => {
    setBreadcrumbsLinks([
      ...breadcrumbLinks,
      { route: id, text: title, type: "document" }
    ]);
    window.open(`/app/document/${id}`);
  };

  const onCreateFolder = async folderName => {
    await createFolder({
      variables: {
        input: { name: folderName, parent: currentLocation.id }
      }
    }).catch(e => {
      setError(e);
    });
    refetchDocsFols();
    setFolderTitleModal(false);
  };

  const onNewDocument = type => {
    window.open(`/app/document/${currentLocation.id}/${type}/new`);
  };

  const onDocumentCreated = ({ createDocument: { id, type } }) => {
    navigate(`/app/document/${currentLocation.id}/${type}/${id}`);
  };

  const onOrderChange = order => {
    setOrder(order);
    refetchDocsFols();
  };

  const onOpenDocumentClick = () => {
    refetchDocsFols();
    openFile.current.click();
  };

  const onOpenExercise = async exerciseCode => {
    if (exerciseCode) {
      try {
        setLoadingExercise(true);
        const {
          data: { exerciseByCode: exercise }
        } = await client.query({
          query: EXERCISE_BY_CODE_QUERY,
          variables: { code: exerciseCode }
        });
        setLoadingExercise(false);
        setExerciseError(false);
        window.open(`/app/exercise/${exercise.type}/${exercise.id}`);
      } catch (e) {
        setLoadingExercise(false);
        setExerciseError(true);
      }
    }
  };

  const onSearchInput = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const onFileSelected = file => {
    const reader = new FileReader();
    reader.onload = async e => {
      const document = JSON.parse(reader.result as string);
      const { data } = await createDocument({
        variables: { ...document, folder: currentLocation.id }
      });
      refetchDocsFols();
      onDocumentCreated(data);
    };

    reader.readAsText(file);
  };

  if (error) {
    return <GraphQLErrorMessage apolloError={error} />;
  }
  if (!documentsData || !documentsData.documentsAndFolders)
    return (
      <Container>
        <Loading />
      </Container>
    );

  const {
    pagesNumber,
    result: docsAndFols,
    parentsPath,
    nFolders
  } = documentsData.documentsAndFolders;

  const breadParents = parentsPath.map(item => ({
    route: `/app/folder/${item.id}`,
    text: item.name,
    type: "folder"
  }));

  return (
    <Container>
      <AppHeader />
      <Content>
        <Header>
          {currentLocation.id === userData.rootFolder ? (
            <h1>Mis documentos</h1>
          ) : (
            <Breadcrumbs links={breadParents} />
          )}
        </Header>
        <Rule />
        <DocumentListHeader>
          {(docsAndFols.length > 0 || searchQuery) && (
            <>
              <ViewOptions>
                <OrderSelect
                  options={orderOptions}
                  onChange={onOrderChange}
                  selectConfig={{ isSearchable: false }}
                />
              </ViewOptions>
              <SearchInput
                value={searchText}
                onChange={e => (
                  setSearchText(e.target.value), onSearchInput(e.target.value)
                )}
                placeholder="Buscar..."
              />
            </>
          )}
          <HeaderButtons>
            <NewFolderButton
              tertiary
              onClick={() => {
                setFolderTitleModal(true);
              }}
            >
              <Icon name="new-folder" />
              Nueva carpeta
            </NewFolderButton>
            <NewExerciseButton
              onOpenExercise={onOpenExercise}
              exerciseError={exerciseError}
              loadingExercise={loadingExercise}
            />
            <DropDown
              attachmentPosition={"top center"}
              targetPosition={"bottom center"}
            >
              {(isOpen: boolean) => (
                <NewDocumentButton tertiary isOpen={isOpen}>
                  <Icon name="new-document" />
                  Nuevo documento
                </NewDocumentButton>
              )}
              <NewDocumentDropDown
                onNewDocument={onNewDocument}
                onOpenDocument={onOpenDocumentClick}
                arrowOffset={10}
              />
            </DropDown>
          </HeaderButtons>
        </DocumentListHeader>
        {docsAndFols.length > 0 ? (
          <DocumentsAndPaginator>
            <DocumentListComp
              parentsPath={parentsPath}
              refetchDocsFols={refetchDocsFols}
              docsAndFols={docsAndFols}
              currentLocation={currentLocation}
              onFolderClick={onFolderClick}
              onDocumentClick={onDocumentClick}
              order={order}
              searchTitle={searchText}
              nFolders={nFolders}
            />
            <DocumentsPaginator
              currentPage={currentPage}
              pages={pagesNumber}
              selectPage={(page: number) => setCurrentPage(page)}
            />
          </DocumentsAndPaginator>
        ) : searchQuery ? (
          <NoDocuments>
            <h1>No hay resultados para tu búsqueda</h1>
          </NoDocuments>
        ) : (
          <NoDocuments>
            <h1>No tienes ningún documento</h1>
            <p>
              Puedes crear un documento nuevo o subir uno desde tu ordenador.
            </p>
          </NoDocuments>
        )}
        <Subscription
          subscription={DOCUMENT_UPDATED_SUBSCRIPTION}
          shouldResubscribe={true}
          onSubscriptionData={() => {
            refetchDocsFols();
          }}
        />
      </Content>
      <input
        ref={openFile}
        type="file"
        onChange={e => onFileSelected(e.target.files[0])}
        style={{ display: "none" }}
      />
      {folderTitleModal && (
        <EditTitleModal
          title={"Carpeta sin título"}
          onCancel={() => setFolderTitleModal(false)}
          onSave={onCreateFolder}
          modalTitle="Crear carpeta"
          modalText="Nombre de la carpeta"
          placeholder="Carpeta sin título"
          saveButton="Crear"
        />
      )}
      <AppFooter />
    </Container>
  );
};

const DocumentsWithDelete = props => <Documents {...props} />;

export default DocumentsWithDelete;

/* styled components */

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${colors.gray1};
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  padding: 0px 50px;

  & > div {
    flex-shrink: 0;
  }
`;

const Header = styled.div`
  height: 80px;
  display: flex;
  align-items: center;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    flex: 1;
    font-weight: bold;
    font-size: 24px;
    &:hover {
      cursor: pointer;
    }
  }
`;

const Loading = styled(Spinner)`
  flex: 1;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -10px;
`;

const DocumentListHeader = styled.div`
  display: flex;
  height: 115px;
  align-items: center;
`;

const HeaderButtons = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const ViewOptions = styled.div`
  margin-right: 10px;
`;

const OrderSelect: Select = styled(Select)`
  width: 200px;
`;

const SearchInput: Input = styled(Input)`
  width: 210px;
  flex: inherit;
`;

interface NewDocumentButtonProps {
  isOpen: boolean;
}
const NewDocumentButton = styled(Button)<NewDocumentButtonProps>`
  border-radius: 4px;
  font-size: 14px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;

  &:hover {
    background-color: ${colors.gray2};
  }

  svg {
    height: 20px;
    margin-right: 8px;
  }
`;

const NoDocuments = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  margin-top: 100px;
  justify-content: center;
  align-items: center;

  h1 {
    width: 1179px;
    height: 28px;
    font-family: Roboto;
    font-size: 24px;
    font-weight: 300;
    text-align: center;
    color: #373b44;
    margin-bottom: 20px;
  }

  p {
    width: 1179px;
    height: 22px;
    font-family: Roboto;
    font-size: 14px;
    line-height: 1.57;
    text-align: center;
    color: #474749;
  }
`;

const NewFolderButton = styled(Button)`
  padding: 0px 20px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
`;

const DocumentsPaginator = styled(Paginator)`
  margin-bottom: 60px;
`;

const DocumentsAndPaginator = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  justify-content: space-between;
  width: 100%;
`;
