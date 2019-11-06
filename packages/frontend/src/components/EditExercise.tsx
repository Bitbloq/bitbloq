import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import { Subscription } from "react-apollo";
import debounce from "lodash/debounce";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  colors,
  Button,
  DialogModal,
  Document,
  Spinner,
  Modal,
  Icon,
  useTranslate
} from "@bitbloq/ui";
import {
  EXERCISE_QUERY,
  STUDENT_SUBMISSION_QUERY,
  UPDATE_SUBMISSION_MUTATION,
  FINISH_SUBMISSION_MUTATION,
  SET_ACTIVESUBMISSION_MUTATION,
  SUBMISSION_UPDATED_SUBSCRIPTION,
  SUBMISSION_ACTIVE_SUBSCRIPTION
} from "../apollo/queries";
import ExerciseInfo from "./ExerciseInfo";
import ExerciseLoginModal from "./ExerciseLoginModal";
import SaveCopyModal from "./SaveCopyModal";
import { documentTypes } from "../config";
import { setToken, getToken } from "../lib/session";
import SessionWarningModal from "./SessionWarningModal";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

const EditExercise = ({ type, id }) => {
  const t = useTranslate();
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  const [isSubmissionSuccessOpen, setIsSubmissionSuccessOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);

  const [loginVisible, setLoginVisible] = useState(true);
  const [teamName, setTeamName] = useState("");

  const [isSaveCopyVisible, setIsSaveCopyVisible] = useState(false);
  const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const [initialContent, setInitialContent] = useState([]);

  const { data, loading, error } = useQuery(EXERCISE_QUERY, {
    variables: { id }
  });
  const [updateSubmission] = useMutation(UPDATE_SUBMISSION_MUTATION);
  const [finishSubmission] = useMutation(FINISH_SUBMISSION_MUTATION);

  const [submissionContent, setSubmissionContent] = useState([]);
  const currentContent = useRef([]);

  const client = useApolloClient();

  const exercise = data && data.exercise;

  useEffect(() => {
    setToken("", "exercise-team");
  }, []);

  useEffect(
    () => {
      if (!loginVisible) {
        loadSubmission();
      }
    },
    [loginVisible]
  );

  useEffect(
    () => {
      if (exercise && teamName) {
        const setActiveToFalse = () => {
          updateSubmission({
            variables: {
              active: false
            }
          });
        };

        window.addEventListener("beforeunload", setActiveToFalse, true);

        return () => {
          setActiveToFalse();
          window.removeEventListener("beforeunload", setActiveToFalse, true);
        };
      } else {
        return () => {};
      }
    },
    [teamName]
  );

  useEffect(
    () => {
      if (exercise && exercise.content) {
        try {
          const content = JSON.parse(data.exercise.content);
          setInitialContent(content);
        } catch (e) {
          console.warn("Error parsing submission content", e);
        }
      }
    },
    [exercise]
  );

  if (loading) return <Loading />;
  if (error) return <GraphQLErrorMessage apolloError={error} />;

  const loadSubmission = async () => {
    const { data } = await client.query({
      query: STUDENT_SUBMISSION_QUERY
    });
    try {
      const content = JSON.parse(data.submission.content);
      setSubmissionContent(content);
      setRestartCount(restartCount + 1);
      currentContent.current = content;
    } catch (e) {
      console.warn("Error parsing submission content", e);
    }
  };

  const restart = () => {
    setRestartCount(restartCount + 1);
    setSubmissionContent(initialContent);
    updateSubmission({
      variables: {
        content: JSON.stringify(initialContent || [])
      }
    });
    currentContent.current = initialContent;
    setIsRestartModalVisible(false);
  };

  const onSaveCopyClick = () => {
    setIsSaveCopyVisible(true);
  };

  const onRestartClick = () => {
    setIsRestartModalVisible(true);
  };

  const onSubmitClick = async () => {
    await finishSubmission({
      variables: {
        content: JSON.stringify(currentContent.current || [])
      }
    });
    setIsSubmissionSuccessOpen(true);
  };

  const { title, teacherName } = exercise;

  return (
    <>
      <EditorComponent
        brandColor={documentType.color}
        key={restartCount}
        content={submissionContent}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        title={
          <Title>
            <TitleIcon>
              <Icon name="airplane-document" />
            </TitleIcon>
            <div>
              <TitleText>{title}</TitleText>
              <TeacherName>Profesor: {teacherName}</TeacherName>
            </div>
          </Title>
        }
        onContentChange={debounce((content: any[]) => {
          if (teamName) {
            updateSubmission({
              variables: { content: JSON.stringify(content || []) }
            });
          }
          currentContent.current = content;
        }, 1000)}
        getTabs={mainTab => [
          mainTab,
          <Document.Tab
            key="info"
            icon={<Icon name="info" />}
            label={t("tab-project-info")}
          >
            <ExerciseInfo
              exercise={exercise}
              onGotoExercise={() => setTabIndex(0)}
            />
          </Document.Tab>
        ]}
        headerButtons={[
          { id: "save-copy", icon: "add-document" },
          { id: "restart", icon: "reload" },
          { id: "submit", icon: "airplane" }
        ]}
        onHeaderButtonClick={(buttonId: string) => {
          switch (buttonId) {
            case "save-copy":
              onSaveCopyClick();
              return;
            case "restart":
              onRestartClick();
              return;
            case "submit":
              onSubmitClick();
              return;
          }
        }}
        headerRightContent={teamName && <TeamName>{teamName}</TeamName>}
        backCallback={() => Router.push("/")}
      />
      <Modal
        isOpen={isSubmissionSuccessOpen}
        title="Entregar ejercicio"
        onClose={() => setIsSubmissionSuccessOpen(false)}
      >
        <ModalContent>
          <p>Ejercicio entregado con éxito</p>
          <ModalButtons>
            <ModalButton onClick={() => setIsSubmissionSuccessOpen(false)}>
              Aceptar
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </Modal>
      {loginVisible && (
        <ExerciseLoginModal
          code={exercise.code}
          onSuccess={teamName => {
            setTeamName(teamName);
            setLoginVisible(false);
          }}
        />
      )}
      {isSaveCopyVisible && (
        <SaveCopyModal
          onClose={() => setIsSaveCopyVisible(false)}
          document={exercise}
          content={currentContent.current}
        />
      )}
      <DialogModal
        isOpen={isRestartModalVisible}
        title="Aviso"
        text="¿Seguro que quieres reiniciar el ejercicio? Si lo haces perderás todo lo que hayas hecho y el ejercicio volverá a su estado original."
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={() => restart()}
        onCancel={() => setIsRestartModalVisible(false)}
      />
      <SessionWarningModal tempSession="exercise-team" />
      {teamName && (
        <Subscription
          subscription={SUBMISSION_ACTIVE_SUBSCRIPTION}
          shouldResubscribe={true}
          variables={{
            token: getToken("exercise-team")
          }}
          onSubscriptionData={({ subscriptionData }) => {
            const { data } = subscriptionData;
            if (
              data &&
              data.submissionActive &&
              !data.submissionActive.active
            ) {
              setToken("", "exercise-team");
              Router.replace("/");
            }
          }}
        />
      )}
    </>
  );
};

export default EditExercise;

/* styled components */

const Loading = styled(Spinner)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${colors.brandBlue};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const TitleIcon = styled.div`
  margin-right: 10px;
  svg {
    width: 28px;
  }
`;

const TitleText = styled.div`
  font-style: normal;
  margin-bottom: 6px;
`;

const TeacherName = styled.div`
  font-style: italic;
  font-size: 14px;
  font-weight: normal;
`;

const TeamName = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 20px;
  border-left: solid 1px #cfcfcf;
  background-color: #ebebeb;
`;

const ModalContent = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    font-size: 14px;
    margin-bottom: 30px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalButton = styled(Button)`
  height: 50px;
  width: 170px;
  margin-right: 20px;
`;
