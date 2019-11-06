import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Modal, Input, DialogModal, useTranslate } from "@bitbloq/ui";
import { useMutation } from "@apollo/react-hooks";
import {
  START_SUBMISSION_MUTATION,
  LOGIN_SUBMISSION_MUTATION
} from "../apollo/queries";
import { setToken } from "../lib/session";

enum Steps {
  StartOrContinue,
  Start,
  Continue
}

interface ExerciseLoginModalProps {
  code: string;
  onSuccess: (teamName: string) => any;
}

const ExerciseLoginModal: FC<ExerciseLoginModalProps> = ({
  code,
  onSuccess
}) => {
  const [step, setStep] = useState(Steps.StartOrContinue);
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [start] = useMutation(START_SUBMISSION_MUTATION);
  const [login] = useMutation(LOGIN_SUBMISSION_MUTATION);

  const t = useTranslate();

  useEffect(
    () => {
      setTeamNameError("");
      setPasswordError("");
    },
    [step]
  );

  const gotoStep = (step: Steps) => {
    setTeamName("");
    setPassword("");
    setStep(step);
  };

  const onStartClick = async () => {
    if (!teamName) {
      setTeamNameError(t("submission-error-not-name"));
    } else {
      try {
        const result = await start({
          variables: {
            studentNick: teamName,
            exerciseCode: code,
            password
          }
        }).catch(e => {
          if (e.graphQLErrors[0].extensions.code === "SUBMISSION_EXISTS") {
            setTeamNameError(t("submission-error-submission-exists"));
          } else if (
            e.graphQLErrors[0].extensions.code === "NOT_ACCEPT_SUBMISSIONS"
          ) {
            setTeamNameError(t("submission-error-not-accepted-submission"));
          } else {
            setTeamNameError(e.message);
          }
        });
        if (result && result.data) {
          const { token } = result.data.startSubmission;
          setToken(token, "exercise-team");
          onSuccess(teamName);
        }
      } catch (e) {}
    }
  };

  const onContinueClick = async () => {
    if (!teamName) {
      setTeamNameError(t("submission-error-not-name"));
    } else {
      try {
        const { data } = await login({
          variables: {
            studentNick: teamName,
            exerciseCode: code,
            password
          }
        });
        const { token } = data.loginSubmission;
        setToken(token, "exercise-team");
        onSuccess(teamName);
      } catch (e) {
        const submissionNotFound = (e.graphQLErrors || []).some(
          ({ path, extensions }) =>
            extensions && extensions.code === "SUBMISSION_NOT_FOUND"
        );

        const notAcceptSubmissions = (e.graphQLErrors || []).some(
          ({ path, extensions }) =>
            extensions && extensions.code === "NOT_ACCEPT_SUBMISSIONS"
        );

        if (submissionNotFound) {
          setTeamNameError(t("submission-error-submission-not-found"));
        } else if (notAcceptSubmissions) {
          setTeamNameError(t("submission-error-not-accepted-submission"));
        } else {
          setPasswordError(t("submission-error-wrong-password"));
        }
      }
    }
  };

  if (step === Steps.StartOrContinue) {
    return (
      <DialogModal
        isOpen={true}
        title="Bienvenido al ejercicio"
        text="¿Qué quieres hacer?"
        content={
          <>
            <Button onClick={() => gotoStep(Steps.Start)}>
              Empezar una entrega
            </Button>
            <Button onClick={() => gotoStep(Steps.Continue)}>
              Continuar una entrega
            </Button>
          </>
        }
        cancelText="Salir del ejercicio"
        onCancel={() => {
          window.close();
          window.location.assign("/");
        }}
      />
    );
  } else {
    return (
      <Modal
        isOpen={true}
        title={
          step === Steps.Start ? "Empezar una entrega" : "Continuar una entrega"
        }
      >
        <ModalContent>
          <LoginForm>
            <FormGroup>
              <label>Nombre del equipo</label>
              <Input
                value={teamName}
                error={!!teamNameError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTeamName(e.target.value)
                }
                placeholder="Nombre del equipo"
              />
            </FormGroup>
            <FormGroup>
              <label>Contraseña {step === Steps.Start && "(opcional)"}</label>
              <Input
                value={password}
                error={!!passwordError}
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Contraseña"
              />
            </FormGroup>
          </LoginForm>
          {(teamNameError || passwordError) && (
            <Error>{teamNameError || passwordError}</Error>
          )}
          <Buttons>
            <Button tertiary onClick={() => gotoStep(Steps.StartOrContinue)}>
              Atrás
            </Button>
            <Button
              onClick={() =>
                step === Steps.Start ? onStartClick() : onContinueClick()
              }
            >
              Empezar
            </Button>
          </Buttons>
        </ModalContent>
      </Modal>
    );
  }
};

export default ExerciseLoginModal;

const ModalContent = styled.div`
  font-size: 14px;
  padding: 30px;
`;

const LoginForm = styled.div`
  display: flex;
  margin: 0px -10px;
`;

const FormGroup = styled.div`
  margin: 0px 10px;
  flex: 1;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const Error = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-top: 10px;
`;
