import React, { FC, useState } from "react";
import Router from "next/router";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import withApollo from "../apollo/withApollo";
import AccessLayout from "../components/AccessLayout";
import BrowserVersionWarning from "../components/BrowserVersionWarning";
import LoginPanel from "../components/LoginPanel";
import { LOGIN_MUTATION } from "../apollo/queries";
import { setToken } from "../lib/session";

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logingError, setLogingError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const client = useApolloClient();

  const onLoginClick = async () => {
    try {
      setLoggingIn(true);
      setLogingError(false);
      const result = await login({ variables: { email, password } });
      setLoggingIn(false);
      onLoginSuccess(result.data.login);
    } catch (e) {
      setLoggingIn(false);
      setLogingError(true);
    }
  };

  const onLoginSuccess = (token: string) => {
    client.resetStore();
    setToken(token);
    Router.push("/app");
  };

  return (
    <AccessLayout panelTitle="Entrar">
      <LoginPanel
        email={email}
        logingError={logingError}
        logingIn={loggingIn}
        password={password}
        onLoginClick={onLoginClick}
        secondaryButtonCallback={() => Router.push("/signup")}
        secondaryButtonText="Crear una cuenta"
        setEmail={setEmail}
        setPassword={setPassword}
      />
    </AccessLayout>
  );
};

export default withApollo(LoginPage, { requiresSession: false });
