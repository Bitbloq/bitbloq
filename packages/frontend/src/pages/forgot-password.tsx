import React, { FC, useState, useEffect } from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { Input, Button } from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import { RESET_PASSWORD_MUTATION } from "../apollo/queries";
import AccessLayout, { AccessLayoutSize } from "../components/AccessLayout";
import ModalLayout from "../components/ModalLayout";

const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [disableRetry, setDisableRetry] = useState(false);
  const [retryTime, setRetryTime] = useState(0);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  useEffect(() => {
    let interval: number;
    if (disableRetry) {
      let time = retryTime;
      interval = window.setInterval(() => {
        if (time > 0) {
          time = time - 1;
          setRetryTime(time);
        } else {
          clearInterval(interval);
          setDisableRetry(false);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [disableRetry]);

  const onSendClick = async () => {
    try {
      setEmailError(false);
      const result = await resetPassword({ variables: { email } });
      setEmailSent(true);
    } catch (e) {
      setEmailError(true);
    }
  };

  const onResendClick = () => {
    setRetryTime(59);
    setDisableRetry(true);
    onSendClick();
  };

  if (emailSent) {
    return (
      <ModalLayout
        title="Bitbloq | Email enviado"
        modalTitle="Email enviado"
        text={
          "Revisa la bandeja de tu correo electrónico, si no se encuentra ahí," +
          " es posible que esté en la carpeta de Spam."
        }
        okButton={
          <Button onClick={onResendClick} disabled={disableRetry}>
            Volver a enviar email {disableRetry && `(0:${retryTime})`}
          </Button>
        }
        cancelText="Volver al inicio"
        onCancel={() => Router.push("/")}
        isOpen={true}
      />
    );
  }

  return (
    <AccessLayout
      panelTitle="Contraseña olvidada"
      size={AccessLayoutSize.MEDIUM}
    >
      <Text>
        Escribe tu correo electrónico y te enviaremos un email con un enlace
        para que puedas crear una nueva contraseña.
      </Text>
      <FormGroup>
        <label>Correo electrónico</label>
        <Input
          name="email"
          type="text"
          placeholder="Correo electrónico"
          value={email}
          error={emailError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </FormGroup>
      {emailError && (
        <ErrorMessage>
          No existe una cuenta de usuario asociada a este correo electrónico
        </ErrorMessage>
      )}
      <Buttons>
        <Button secondary onClick={() => Router.push("/login")}>
          Cancelar
        </Button>
        <Button onClick={() => onSendClick()} disabled={loading}>
          Enviar
        </Button>
      </Buttons>
    </AccessLayout>
  );
};

export default withApollo(ForgotPasswordPage, { requiresSession: false });

const Text = styled.p`
  line-height: 1.57;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 8px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;

const Buttons = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;
