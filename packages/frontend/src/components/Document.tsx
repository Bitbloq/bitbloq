import * as React from "react";
import { Query, Mutation, Subscription } from "react-apollo";
import Router from "next/router";
import {
  colors,
  Button,
  DialogModal,
  HorizontalRule,
  Icon,
  Input,
  Spinner,
  Modal,
  Translate
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import gql from "graphql-tag";
import { ApolloError } from "apollo-client";
import {
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_UPDATE_MUTATION,
  EXERCISE_DELETE_MUTATION,
  SUBMISSION_UPDATED_SUBSCRIPTION,
  REMOVE_SUBMISSION_MUTATION
} from "../apollo/queries";
import { UserDataContext } from "../lib/useUserData";
import { sortByCreatedAt } from "../util";
import AppFooter from "./Footer";
import AppHeader from "./AppHeader";
import Breadcrumbs from "./Breadcrumbs";
import DocumentTypeTag from "./DocumentTypeTag";
import EditTitleModal from "./EditTitleModal";
import ExercisePanel from "./ExercisePanel";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import UserSession from "./UserSession";

const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      image {
        image
        isSnapshot
      }
      folder
      parentsPath {
        id
        name
      }
      exercises {
        id
        code
        title
        acceptSubmissions
        createdAt
        submissions {
          id
          studentNick
          finished
          finishedAt
          type
          grade
          active
        }
      }
    }
  }
`;

const CREATE_EXERCISE_MUTATION = gql`
  mutation CreateExercise($documentId: ObjectID!, $title: String!) {
    createExercise(input: { document: $documentId, title: $title }) {
      id
    }
  }
`;

const DELETE_SUBMISSION_MUTATION = gql`
  mutation DeleteSubmission($id: ObjectID!) {
    deleteSubmission(submissionID: $id) {
      id
    }
  }
`;

const CHANGE_SUBMISSIONS_STATE_MUTATION = gql`
  mutation ChangeSubmissionsState($id: ObjectID!, $subState: Boolean!) {
    changeSubmissionsState(id: $id, subState: $subState) {
      id
    }
  }
`;

class DocumentState {
  readonly isCreateExerciseOpen: boolean = false;
  readonly isUpdateExerciseOpen: boolean = false;
  readonly isRemoveExerciseOpen: 0 | 1 | 2 = 0; // 0 -> cerrada; 1 -> sin entregas; 2 -> con entregas
  readonly errorName: boolean = false;
  readonly newExerciseTitle: string = "";
  readonly exerciseId: string = "";
  readonly stateError: ApolloError | null = null;
}

class Document extends React.Component<any, DocumentState> {
  readonly state = new DocumentState();
  newExerciseTitleInput = React.createRef<HTMLInputElement>();

  componentDidUpdate(prevProps: any, prevState: DocumentState) {
    const { isCreateExerciseOpen, isUpdateExerciseOpen } = this.state;
    if (isCreateExerciseOpen && !prevState.isCreateExerciseOpen) {
      const input = this.newExerciseTitleInput.current;
      if (input) {
        input.focus();
      }
    }
    if (isUpdateExerciseOpen && !prevState.isUpdateExerciseOpen) {
      const input = this.newExerciseTitleInput.current;
      if (input) {
        input.focus();
      }
    }
  }

  renderHeader(document) {
    let breadParents = [];
    for (let item of document.parentsPath) {
      breadParents = [
        ...breadParents,
        ...[
          { route: `/app/folder/${item.id}`, text: item.name, type: "folder" }
        ]
      ];
    }
    breadParents.push({ route: "", text: document.title, type: "document" });
    return (
      <Header>
        <Breadcrumbs links={breadParents} title={document.title} />
      </Header>
    );
  }

  renderDocumentInfo(document, t) {
    return (
      <DocumentInfo>
        <DocumentHeader>
          <DocumentHeaderText>
            <Icon name="document" />
            {t("document-header-info")}
          </DocumentHeaderText>
          <DocumentHeaderButton
            onClick={() =>
              window.open(
                `/app/edit-document/${document.folder}/${document.type}/${
                  document.id
                }`
              )
            }
          >
            {t("document-header-button")}
          </DocumentHeaderButton>
        </DocumentHeader>
        <DocumentBody>
          <DocumentImage src={document.image.image} />
          <DocumentBodyInfo>
            <DocumentTypeTag document={document} />
            <DocumentTitle>
              {document.title || t("document-body-title")}
            </DocumentTitle>
            <DocumentDescription>
              {document.description || t("document-body-description")}
            </DocumentDescription>
          </DocumentBodyInfo>
        </DocumentBody>
      </DocumentInfo>
    );
  }

  renderDocumentTeacherInfo(document, t) {
    return (
      <DocumentInfo teacher>
        <DocumentHeader>
          <DocumentHeaderText>
            <Icon name="document" />
            {t("document-header-info")}
          </DocumentHeaderText>
          <DocumentHeaderButton
            onClick={() =>
              window.open(
                `/app/edit-document/${document.folder}/${document.type}/${
                  document.id
                }`
              )
            }
          >
            {t("document-header-button")}
          </DocumentHeaderButton>
        </DocumentHeader>
        <DocumentBody teacher>
          <DocumentImage src={document.image.image} teacher />
          <DocumentBodyInfo teacher>
            <DocumentTypeTag document={document} />
            <DocumentTitle>
              {document.title || t("document-body-title")}
            </DocumentTitle>
            <DocumentDescription>
              {document.description || t("document-body-description")}
            </DocumentDescription>
          </DocumentBodyInfo>
        </DocumentBody>
      </DocumentInfo>
    );
  }

  renderExercise = (exercise, refetch) => {
    const { id: documentId } = this.props;

    return (
      <React.Fragment key={exercise.id}>
        <Mutation mutation={DELETE_SUBMISSION_MUTATION}>
          {deleteSubmission => (
            <Mutation mutation={CHANGE_SUBMISSIONS_STATE_MUTATION}>
              {changeSubmissionsState => (
                <Mutation mutation={REMOVE_SUBMISSION_MUTATION}>
                  {removeSubmission => (
                    <ExercisePanel
                      exercise={exercise}
                      onCancelSubmission={submission =>
                        deleteSubmission({
                          variables: { id: submission.id },
                          refetchQueries: [
                            {
                              query: DOCUMENT_QUERY,
                              variables: { id: documentId }
                            }
                          ]
                        }).catch(e => this.setState({ stateError: e }))
                      }
                      onCheckSubmission={({ type, id }) =>
                        window.open(`/app/submission/${type}/${id}`)
                      }
                      onAcceptedSubmissions={(value: boolean) => {
                        changeSubmissionsState({
                          variables: { id: exercise.id, subState: value },
                          refetchQueries: [
                            {
                              query: DOCUMENT_QUERY,
                              variables: { id: documentId }
                            }
                          ]
                        }).catch(e => this.setState({ stateError: e }));
                      }}
                      onChangeName={(currentName: string) => {
                        this.setState({
                          isUpdateExerciseOpen: true,
                          newExerciseTitle: currentName,
                          exerciseId: exercise.id
                        });
                      }}
                      onRemove={() => {
                        this.setState({
                          isRemoveExerciseOpen:
                            exercise.submissions.length > 0 ? 2 : 1,
                          exerciseId: exercise.id
                        });
                      }}
                      onRemoveSubmission={(submissionID: string) => {
                        removeSubmission({
                          variables: {
                            submissionID
                          },
                          refetchQueries: [
                            {
                              query: DOCUMENT_QUERY,
                              variables: { id: documentId }
                            }
                          ]
                        }).catch(e => this.setState({ stateError: e }));
                      }}
                    />
                  )}
                </Mutation>
              )}
            </Mutation>
          )}
        </Mutation>
        <Subscription
          subscription={SUBMISSION_UPDATED_SUBSCRIPTION}
          variables={{ exercise: exercise.id }}
          shouldResubscribe={true}
          onSubscriptionData={() => {
            refetch();
          }}
        />
      </React.Fragment>
    );
  };

  renderExercises(exercises, refetch, t) {
    return (
      <Exercises>
        <DocumentHeader>
          <DocumentHeaderText exercise>
            <Icon name="airplane-document" />
            {t("exercises-header-info")}
          </DocumentHeaderText>
          <DocumentHeaderButton
            onClick={() =>
              this.setState({
                isCreateExerciseOpen: true,
                newExerciseTitle: ""
              })
            }
          >
            <Icon name="plus" />
            {t("exercises-header-button")}
          </DocumentHeaderButton>
        </DocumentHeader>
        {exercises && exercises.length > 0 ? (
          <ExercisesPanel>
            {exercises
              .slice()
              .sort(sortByCreatedAt)
              .map(exercise => this.renderExercise(exercise, refetch))}
          </ExercisesPanel>
        ) : (
          <EmptyExercises>
            <h2>{t("exercises-empty-title")}</h2>
            <p>{t("exercises-empty-description")}</p>
            <MyButton
              onClick={() =>
                this.setState({
                  isCreateExerciseOpen: true,
                  newExerciseTitle: ""
                })
              }
            >
              <Icon name="plus" />
              {t("exercises-header-button")}
            </MyButton>
          </EmptyExercises>
        )}
      </Exercises>
    );
  }

  renderCreateExerciseModal(document, t) {
    const { id: documentId } = this.props;
    const { errorName, isCreateExerciseOpen, newExerciseTitle } = this.state;

    return (
      <Mutation mutation={CREATE_EXERCISE_MUTATION}>
        {createExercise => (
          <EditTitleModal
            title={newExerciseTitle}
            onCancel={() =>
              this.setState({ isCreateExerciseOpen: false, errorName: false })
            }
            onSave={(value: string) => {
              createExercise({
                variables: {
                  documentId,
                  title: value || "Ejercicio sin título"
                },
                refetchQueries: [
                  {
                    query: DOCUMENT_QUERY,
                    variables: { id: documentId }
                  }
                ]
              }).catch(e => this.setState({ stateError: e }));
              this.setState({
                isCreateExerciseOpen: false,
                errorName: false
              });
            }}
            modalTitle={t("exercises-modal-title")}
            modalText={t("exercises-modal-text")}
            placeholder={t("exercises-modal-placeholder")}
            saveButton={t("general-create-button")}
          />
        )}
      </Mutation>
    );
  }

  renderUpdateExerciseModal(t) {
    const { id: documentId } = this.props;
    const {
      errorName,
      isUpdateExerciseOpen,
      newExerciseTitle,
      exerciseId
    } = this.state;

    return (
      <Mutation mutation={EXERCISE_UPDATE_MUTATION}>
        {updateExercise => (
          <EditTitleModal
            title={newExerciseTitle}
            onCancel={() =>
              this.setState({ isUpdateExerciseOpen: false, errorName: false })
            }
            onSave={(value: string) => {
              updateExercise({
                variables: {
                  id: exerciseId,
                  input: {
                    title: value || "Ejercicio sin título"
                  }
                },
                refetchQueries: [
                  {
                    query: DOCUMENT_QUERY,
                    variables: { id: documentId }
                  }
                ]
              }).catch(e => this.setState({ stateError: e }));
              this.setState({
                isUpdateExerciseOpen: false,
                errorName: false
              });
            }}
            modalTitle={t("exercises-modal-update")}
            modalText={t("exercises-modal-text")}
            placeholder={t("exercises-modal-placeholder")}
            saveButton={t("general-change-button")}
          />
        )}
      </Mutation>
    );
  }

  renderRemoveExerciseModal(t) {
    const { id: documentId } = this.props;
    const { isRemoveExerciseOpen, exerciseId } = this.state;

    return (
      <Mutation mutation={EXERCISE_DELETE_MUTATION}>
        {deleteExercise => (
          <DialogModal
            isOpen={isRemoveExerciseOpen !== 0}
            title={t("exercises-modal-remove")}
            text={
              isRemoveExerciseOpen === 1
                ? t("exercises-remove-nosubmission")
                : t("exercises-remove-submission")
            }
            okText={t("general-accept-button")}
            cancelText={t("general-cancel-button")}
            onOk={() => {
              deleteExercise({
                variables: {
                  id: exerciseId
                },
                refetchQueries: [
                  {
                    query: DOCUMENT_QUERY,
                    variables: { id: documentId }
                  }
                ]
              }).catch(e => this.setState({ stateError: e }));
              this.setState({
                isRemoveExerciseOpen: 0
              });
            }}
            onCancel={() => this.setState({ isRemoveExerciseOpen: 0 })}
          />
        )}
      </Mutation>
    );
  }

  render() {
    const { id } = this.props;
    const {
      isCreateExerciseOpen,
      isUpdateExerciseOpen,
      stateError
    } = this.state;

    return (
      <UserDataContext.Consumer>
        {user => (
          <Translate>
            {t => (
              <Container>
                <AppHeader>
                  <UserSession />
                </AppHeader>
                <Query query={DOCUMENT_QUERY} variables={{ id }}>
                  {({ loading, error, data, refetch }) => {
                    if (error) {
                      return <GraphQLErrorMessage apolloError={error} />;
                    }
                    if (loading) return <Loading />;

                    if (stateError) {
                      return <GraphQLErrorMessage apolloError={stateError} />;
                    }

                    const { document } = data;

                    return (
                      <>
                        <Content>
                          {this.renderHeader(document)}
                          <Rule />
                          <DocumentData>
                            {user && user.teacher
                              ? this.renderDocumentTeacherInfo(document, t)
                              : this.renderDocumentInfo(document, t)}
                            {user && user.teacher
                              ? this.renderExercises(
                                  document.exercises,
                                  refetch,
                                  t
                                )
                              : ""}
                          </DocumentData>
                        </Content>
                        <Subscription
                          subscription={DOCUMENT_UPDATED_SUBSCRIPTION}
                          shouldResubscribe={true}
                          onSubscriptionData={({ subscriptionData }) => {
                            const { data } = subscriptionData;
                            if (
                              data &&
                              data.documentUpdated &&
                              data.documentUpdated.id === id
                            ) {
                              refetch();
                            }
                          }}
                        />
                      </>
                    );
                  }}
                </Query>
                {isCreateExerciseOpen
                  ? this.renderCreateExerciseModal(document, t)
                  : ""}
                {isUpdateExerciseOpen ? this.renderUpdateExerciseModal(t) : ""}
                {this.renderRemoveExerciseModal(t)}
                <AppFooter />
              </Container>
            )}
          </Translate>
        )}
      </UserDataContext.Consumer>
    );
  }
}

const withCreateExercise = Component => props => (
  <Mutation mutation={CREATE_EXERCISE_MUTATION}>
    {mutate => <Component createExercise={mutate} {...props} />}
  </Mutation>
);

export default Document;

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
  flex: 1;
  padding: 0px 50px;
`;

const Header = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  font-size: 14px;

  a {
    font-weight: bold;
    color: inherit;
    text-decoration: none;
    margin-right: 6px;
  }
`;

const Loading = styled(Spinner)`
  flex: 1;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -10px;
`;

const EmptyExercises = styled.div`
  align-items: center;
  color: #474749;
  display: flex;
  flex-flow: column nowrap;
  font-family: Roboto;
  height: calc(100% - 60px); /* 60px like header height*/
  justify-content: center;
  padding: 0 60px;
  text-align: center;

  h2 {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    line-height: 1.57;
    margin-bottom: 20px;
  }
`;

interface DocumentBodyProps {
  teacher?: boolean;
}
const DocumentBody = styled.div<DocumentBodyProps>`
  display: flex;
  flex-flow: ${(props: DocumentBodyProps) =>
    props.teacher ? "column nowrap" : "row nowrap"};
  padding: ${(props: DocumentBodyProps) =>
    props.teacher ? "20px" : "40px 20px"};
  width: calc(100% - 40px);
`;

const ExercisesPanel = styled.div`
  padding: 23px 20px;
`;

interface DocumentBodyInfoProps {
  teacher?: boolean;
}
const DocumentBodyInfo = styled.div<DocumentBodyInfoProps>`
  color: #474749;
  flex-grow: 0;
  margin-top: ${(props: DocumentBodyInfoProps) => (props.teacher ? 20 : 0)}px;
  width: ${(props: DocumentBodyInfoProps) =>
    props.teacher ? "100%" : "calc(100% - 375px)"};
`;

const DocumentHeader = styled.div`
  border-bottom: solid 1px #c0c3c9;
  display: flex;
  flex-flow: column wrap;
  height: 39px;
  justify-content: center;
  padding: 10px 20px;
  width: calc(100% - 40px);

  svg {
    margin-right: 10px;
  }
`;

const MyButton = styled(Button)`
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 20px;

  svg {
    margin-right: 6px;
  }
`;

const DocumentHeaderButton = styled(MyButton)`
  align-self: flex-end;
`;

interface DocumentHeaderTextProps {
  exercise?: boolean;
}
const DocumentHeaderText = styled.div<DocumentHeaderTextProps>`
  align-items: center;
  display: flex;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;

  svg {
    height: ${(props: DocumentHeaderTextProps) =>
      props.exercise ? "24px" : "auto"};
    width: ${(props: DocumentHeaderTextProps) =>
      props.exercise ? "24px" : "auto"};
  }
`;

const DocumentData = styled.div`
  background-color: #fff;
  border: solid 1px #c0c3c9;
  border-radius: 4px;
  display: flex;
  flex-flow: row nowrap;
  margin-top: 23px;
  width: 100%;
`;

interface DocumentInfoProps {
  teacher?: boolean;
}
const DocumentInfo = styled.div<DocumentInfoProps>`
  border-right: ${(props: DocumentInfoProps) =>
    props.teacher ? "solid 1px #c0c3c9" : "none"};
  display: flex;
  flex-flow: column nowrap;
  width: ${(props: DocumentInfoProps) => (props.teacher ? 34 : 100)}%;
`;

interface DocumentImageProps {
  src: string;
  teacher?: boolean;
}
const DocumentImage = styled.div<DocumentImageProps>`
  background-color: ${colors.gray2};
  background-image: url(${(props: DocumentImageProps) => props.src});
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  flex-shrink: 0;
  height: 215px;
  margin: ${(props: DocumentImageProps) => (props.teacher ? 0 : "0 20px 0 0")};
  width: ${(props: DocumentImageProps) => (props.teacher ? "100%" : "360px")};
`;

const DocumentTitle = styled.div`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  margin: 20px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  height: 22px;
`;

const DocumentDescription = styled.div`
  font-size: 16px;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const Buttons = styled.div`
  display: flex;
  & > * {
    margin-right: 10px;
    svg {
      width: 11px;
      height: 11px;
      margin-right: 6px;
    }
  }
`;

const DocumentButton = styled.div`
  margin-right: 10px;
  color: white;
`;

const Exercises = styled.div`
  width: 66%;
`;

const ModalContent = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
`;

const ModalButton = styled(Button)`
  height: 40px;
  padding: 0 20px;
`;
