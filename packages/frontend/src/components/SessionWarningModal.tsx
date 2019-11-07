import React, { FC, useState } from "react";
import { DialogModal } from "@bitbloq/ui";
import { useSessionEvent, setToken } from "../lib/session";
import { RENEW_TOKEN_MUTATION } from "../apollo/queries";
import { useMutation } from "@apollo/react-hooks";

export interface ISessionWarningModalProps {
  tempSession?: string;
}
const SessionWarningModal: FC<ISessionWarningModalProps> = ({
  tempSession
}) => {
  const [renewToken] = useMutation(RENEW_TOKEN_MUTATION, {
    context: { tempSession }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useSessionEvent(
    "expiration-warning",
    e => {
      if (e.tempSession === tempSession) {
        setIsOpen(true);
        setRemainingSeconds(e.remainingSeconds || 0);
      }
    },
    tempSession
  );

  useSessionEvent("new-token", () => setIsOpen(false), tempSession);

  const onContinue = async () => {
    const { data } = await renewToken();
    setToken(data.renewToken, tempSession);
    setIsOpen(false);
  };

  return (
    <DialogModal
      isOpen={isOpen}
      title="¿Sigues ahí?"
      content={
        <p>
          Parece que te has ido, si no quieres seguir trabajando saldrás de tu
          cuenta en <b>{remainingSeconds} segundos</b>.
        </p>
      }
      okText="Aceptar"
      onOk={() => onContinue()}
    />
  );
};

export default SessionWarningModal;
