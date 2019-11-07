import React, { FC } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { Button } from "@bitbloq/ui";
import LoginForm from "./LoginForm";

interface ILoginPanelProps {
  className?: string;
  email: string;
  logingError: boolean;
  logingIn: boolean;
  password: string;
  onLoginClick: () => any;
  secondaryButtonCallback: () => any;
  secondaryButtonText: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginPanel: FC<ILoginPanelProps> = props => {
  const {
    className,
    email,
    logingError,
    logingIn,
    password,
    onLoginClick,
    secondaryButtonCallback,
    secondaryButtonText,
    setEmail,
    setPassword
  } = props;
  return (
    <Panel
      className={className}
      onSubmit={(event: React.FormEvent) => event.preventDefault()}
    >
      <LoginForm
        email={email}
        logingError={logingError}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      <Button type="submit" onClick={() => onLoginClick()} disabled={logingIn}>
        Entrar
      </Button>
      <Button secondary onClick={secondaryButtonCallback}>
        {secondaryButtonText}
      </Button>
      <Link href="/forgot-password">
        <a>No recuerdo mi contraseña</a>
      </Link>
    </Panel>
  );
};

export default LoginPanel;

const Panel = styled.form`
  font-family: Roboto;

  a {
    color: #00ade5;
    display: block;
    font-size: 14px;
    font-style: italic;
    font-weight: bold;
    margin-top: 4px;
    text-align: center;
    text-decoration: none;
  }

  button {
    margin-bottom: 10px;
    width: 100%;
  }
`;
