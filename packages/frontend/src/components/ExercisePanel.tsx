import React, { FC, useState } from "react";
import { useMutation, Mutation } from "react-apollo";
import dayjs from "dayjs";
import { Spring } from "react-spring/renderprops.cjs";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  colors,
  Button,
  DialogModal,
  DropDown,
  Icon,
  Input,
  Switch,
  useTranslate
} from "@bitbloq/ui";
import DocumentCardMenu from "./DocumentCardMenu";
import EditTitleModal from "./EditTitleModal";
import {
  UPDATE_PASSWORD_SUBMISSION_MUTATION,
  SET_ACTIVESUBMISSION_MUTATION
} from "../apollo/queries";

export interface IExercisePanelProps {
  exercise: any;
  onCancelSubmission: (value: any) => void;
  onCheckSubmission: (value: any) => void;
  onAcceptedSubmissions: (value: boolean) => void;
  onChangeName: (value: string) => void;
  onRemove: () => void;
  onRemoveSubmission: (submissionID: string) => void;
}

const ExercisePanel: FC<IExercisePanelProps> = props => {
  const {
    exercise,
    onCancelSubmission,
    onCheckSubmission,
    onAcceptedSubmissions,
    onChangeName,
    onRemove,
    onRemoveSubmission
  } = props;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [submissionIdModal, setSubmissionIdModal] = useState("");
  const t = useTranslate();

  return (
    <Container>
      <Header>
        <HeaderLeft onClick={() => setOpen(!isOpen)}>
          <Toggle isOpen={isOpen}>
            <Icon name="angle" />
          </Toggle>
        </HeaderLeft>
        <HeaderCenter onClick={() => setOpen(!isOpen)}>
          <Title>{exercise.title}</Title>
          <Date>{dayjs(exercise.createdAt).format("DD/MM/YY HH:mm")}</Date>
        </HeaderCenter>
        <DropDown
          offset="-6px 0"
          constraints={[
            {
              attachment: "together",
              to: "window"
            }
          ]}
        >
          {(isOpen: boolean) => (
            <HeaderRight isOpen={isOpen}>
              <Icon name="ellipsis" />
            </HeaderRight>
          )}
          <DocumentCardMenu
            options={[
              {
                iconName: "pencil",
                label: t("menu-change-name"),
                onClick() {
                  onChangeName(exercise.title);
                }
              },
              {
                iconName: "trash",
                label: t("menu-delete-exercise"),
                onClick() {
                  onRemove();
                },
                red: true
              }
            ]}
          />
        </DropDown>
      </Header>
      <Spring to={{ height: isOpen ? "auto" : 0, opacity: 0 }}>
        {({ height }) => (
          <ExerciseDetails style={{ height }}>
            <ExerciseInfo>
              <div>
                <CodeBox>{exercise.code}</CodeBox>
                {t("exercise-details-code")}
              </div>
              <div>
                {t("exercise-details-submissions")}
                <SubmissionsSwitch
                  value={exercise.acceptSubmissions}
                  onChange={onAcceptedSubmissions}
                />
              </div>
            </ExerciseInfo>
            <ExerciseSubmissions>
              {exercise.submissions && exercise.submissions.length > 0 ? (
                <Table key="table">
                  <thead>
                    <tr>
                      <th>{t("submission-table-team")}</th>
                      <th>{t("submission-table-date")}</th>
                      <th>{t("submission-table-grade")}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.submissions.map(submission => (
                      <SubmissionPanel
                        key={submission.id}
                        exerciseId={exercise.id}
                        onCheckSubmission={onCheckSubmission}
                        t={t}
                        setDeleteModalOpen={setDeleteModalOpen}
                        setPasswordModalOpen={setPasswordModalOpen}
                        setSubmissionIdModal={setSubmissionIdModal}
                        submission={submission}
                      />
                    ))}
                  </tbody>
                </Table>
              ) : (
                <NoSubmissions>
                  {t("exercise-details-nosubmissions")}
                </NoSubmissions>
              )}
            </ExerciseSubmissions>
          </ExerciseDetails>
        )}
      </Spring>
      {passwordModalOpen && (
        <Mutation mutation={UPDATE_PASSWORD_SUBMISSION_MUTATION}>
          {updatePassword => (
            <EditTitleModal
              title=""
              onCancel={() => setPasswordModalOpen(false)}
              onSave={(value: string) => {
                updatePassword({
                  variables: {
                    id: submissionIdModal,
                    password: value
                  }
                });
                setPasswordModalOpen(false);
              }}
              modalTitle={t("submission-passwordmodal-title")}
              modalText={t("submission-passwordmodal-text")}
              placeholder={t("submission-passwordmodal-placeholder")}
              saveButton={t("general-accept-button")}
              type="password"
              validateInput={false}
            />
          )}
        </Mutation>
      )}
      <DialogModal
        isOpen={deleteModalOpen}
        text={t("submission-delete-text")}
        title={t("exercises-modal-remove")}
        okText={t("general-accept-button")}
        cancelText={t("general-cancel-button")}
        onOk={() => {
          onRemoveSubmission(submissionIdModal);
          setDeleteModalOpen(false);
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </Container>
  );
};

interface SubmissionPanelProps {
  exerciseId: string;
  onCheckSubmission: any;
  setDeleteModalOpen: (value: boolean) => void;
  setPasswordModalOpen: (value: boolean) => void;
  setSubmissionIdModal: (value: string) => void;
  submission: any;
  t: any;
}

const SubmissionPanel: FC<SubmissionPanelProps> = (
  props: SubmissionPanelProps
) => {
  const {
    exerciseId,
    onCheckSubmission,
    setDeleteModalOpen,
    setPasswordModalOpen,
    setSubmissionIdModal,
    submission,
    t
  } = props;

  const [passwordValue, setPasswordValue] = useState("");
  const [setActiveSubmission] = useMutation(SET_ACTIVESUBMISSION_MUTATION);

  return (
    <tr>
      <td>
        <StudentCell>
          {submission.active && <Online />}
          <StudentNick>{submission.studentNick}</StudentNick>
        </StudentCell>
      </td>
      <td>
        {submission.finished ? (
          dayjs(submission.finishedAt).format("DD/MM/YY HH:mm")
        ) : (
          <span
            style={{
              fontStyle: "italic",
              color: "#474749"
            }}
          >
            {t("submission-table-unsubmitted")}
          </span>
        )}
      </td>
      <td>{submission.grade || (submission.finished ? "-" : "")}</td>
      <td>
        <DropDown
          constraints={[
            {
              attachment: "together",
              to: "window"
            }
          ]}
          offset="-3.5px 0"
        >
          {(isOpen: boolean) => (
            <SubmissionOptions isOpen={isOpen}>
              <Icon name="ellipsis" />
            </SubmissionOptions>
          )}
          <SubmissionMenu
            options={[
              {
                disabled: !submission.finished,
                iconName: "eye",
                label: t("menu-submission-see"),
                onClick() {
                  onCheckSubmission(submission);
                }
              },
              {
                iconName: "padlock-close",
                label: t("menu-submission-password"),
                onClick() {
                  setSubmissionIdModal(submission.id);
                  setPasswordModalOpen(true);
                }
              },
              {
                disabled: submission.finished || !submission.active,
                iconName: "close",
                label: t("menu-submission-expel"),
                onClick() {
                  setActiveSubmission({
                    variables: {
                      submissionID: submission.id,
                      active: false
                    }
                  });
                }
              },
              {
                disabled: !!submission.grade,
                iconName: "trash",
                label: t("menu-submission-delete"),
                onClick() {
                  setSubmissionIdModal(submission.id);
                  setDeleteModalOpen(true);
                },
                red: true
              }
            ]}
          />
        </DropDown>
      </td>
    </tr>
  );
};

export default ExercisePanel;

/* styled components */

const Container = styled.div`
  border: 1px solid #c0c3c9;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

interface ExerciseDetailsProps {
  style: React.CSSProperties;
}
const ExerciseDetails = styled.div<ExerciseDetailsProps>`
  overflow: ${(props: ExerciseDetailsProps) =>
    props.style.height === "auto" ? "visible" : "hidden"};
`;

const ExerciseInfo = styled.div`
  align-items: center;
  border-top: 1px solid #c0c3c9;
  color: #777;
  display: flex;
  font-family: Roboto;
  font-size: 14px;
  text-align: right;
  height: 69px;
  justify-content: space-between;
  padding: 0 20px;

  div {
    align-items: center;
    display: flex;
  }
`;

const SubmissionsSwitch = styled(Switch)`
  margin-left: 10px;
`;

const ExerciseSubmissions = styled.div`
  position: relative;
`;

const SubmissionMenu = styled(DocumentCardMenu)`
  width: 293px;
`;

const NoSubmissions = styled.div`
  align-items: center;
  border-top: 1px solid #c0c3c9;
  color: #323843;
  display: flex;
  font-size: 14px;
  font-style: italic;
  height: 21px;
  justify-content: center;
  line-height: 1.57;
  padding: 30px 20px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
`;

const HeaderCenter = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 100%;
  justify-content: space-between;
  padding: 10px;
  width: calc(100% - 120px); /* 40px padding & 80px other headers*/
`;

const HeaderLeft = styled.div`
  align-items: center;
  border-right: 1px solid #c0c3c9;
  cursor: pointer;
  display: flex;
  flex: 1 0 39px;
  justify-content: center;
  max-width: 39px;
`;

interface ToggleProps {
  isOpen: boolean;
}
const Toggle = styled.div<ToggleProps>`
  svg {
    transform: rotate(-90deg);
    width: 16px;
  }

  ${(props: ToggleProps) =>
    props.isOpen &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}
`;

interface HeaderRightProps {
  isOpen: boolean;
}
const HeaderRight = styled.div<HeaderRightProps>`
  align-items: center;
  background-color: ${(props: HeaderRightProps) =>
    props.isOpen ? "#e8e8e8" : "white"};
  border-left: 1px solid #c0c3c9;
  cursor: pointer;
  display: flex;
  flex: 1 0 39px;
  height: 100%;
  justify-content: center;
  max-width: 39px;
  width: 39px;

  svg {
    transform: rotate(90deg);
  }

  &:hover {
    background-color: #e8e8e8;
  }
`;

const Title = styled.div`
  color: #474749;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 100px); /* 100px Date */
`;

const Date = styled.div`
  color: #777;
  font-size: 14px;
  font-size: 14px;
  min-width: 100px;
  text-align: right;
`;

const HeaderRow = styled.div`
  display: flex;
  font-size: 16px;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }

  span {
    margin-right: 10px;
    color: ${colors.gray4};
  }
`;

const CodeBox = styled.div`
  align-items: center;
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  color: #474749;
  display: flex;
  font-family: Roboto Mono;
  font-size: 14px;
  font-style: italic;
  font-weight: 500;
  height: 28px;
  justify-content: center;
  margin-right: 10px;
  padding: 0px 20px;
`;

const Content = styled.div`
  overflow: hidden;
`;

const Online = styled.div`
  background-color: #82ad3a;
  border-radius: 100%;
  height: 12px;
  margin-right: 6px;
  width: 12px;
`;

const Table = styled.table`
  width: 100%;

  thead {
    width: 100%;

    tr {
      border-top: 1px solid #c0c3c9;
      height: 40px;
      width: 100%;
    }

    th {
      color: #474749;
      font-family: Roboto;
      font-size: 12px;
      font-weight: bold;
      height: 25px;
      padding: 7px 20px;
      text-align: left;
      vertical-align: bottom;
    }
  }

  tbody {
    position: relative;
    width: 100%;

    tr {
      border-top: 1px solid #c0c3c9;
      position: relative;
      width: 100%;
    }

    td {
      color: #373b44;
      font-family: Roboto;
      font-size: 14px;
      height: 15px;
      padding: 12px 20px;
      vertical-align: middle;
      &:first-of-type {
        max-width: 0;
        width: 60%;
      }
      &:last-of-type {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        padding-left: 0;
        min-width: 32px;
      }
    }
  }
`;

interface SubmissionOptionsProps {
  isOpen?: boolean;
}
const SubmissionOptions = styled.div<SubmissionOptionsProps>`
  align-items: center;
  background-color: ${(props: SubmissionOptionsProps) =>
    props.isOpen ? "#e8e8e8" : "#fff"};
  border: solid 1px #dddddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  height: 30px;
  justify-content: center;
  width: 30px;

  &:hover {
    background-color: #e8e8e8;
  }

  svg {
    transform: rotate(90deg);
  }
`;

const StudentCell = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`;

const StudentNick = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
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
