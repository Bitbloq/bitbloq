import React, { useEffect, useState } from "react";
import cookie from "cookie";
import { NextApiRequest, NextPageContext } from "next";
import Head from "next/head";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { createClient } from "./client";
import { ME_QUERY } from "./queries";
import {
  getToken,
  setToken,
  shouldRenewToken,
  onSessionError,
  watchSession,
  useSessionEvent
} from "../lib/session";
import { UserDataContext } from "../lib/useUserData";
import useLogout from "../lib/useLogout";
import SessionWarningModal from "../components/SessionWarningModal";
import ErrorLayout from "../components/ErrorLayout";

export interface IContext extends NextPageContext {
  apolloClient: ApolloClient<any>;
}

const SessionWatcher = ({ tempSession }) => {
  const [anotherSession, setAnotherSession] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    const interval = watchSession(tempSession);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useSessionEvent("error", ({ error }) => {
    const code = error && error.extensions && error.extensions.code;
    if (code === "ANOTHER_OPEN_SESSION") {
      setAnotherSession(true);
      setToken("");
    }
  });

  useSessionEvent("expired", () => {
    logout(false);
  });
  if (anotherSession) {
    return (
      <ErrorLayout
        title="Has iniciado sesión en otro dispositivo"
        text="Solo se puede tener una sesión abierta al mismo tiempo"
        onOk={() => logout(false)}
      />
    );
  }

  return <SessionWarningModal tempSession={tempSession} />;
};

export default function withApollo(
  PageComponent,
  { ssr = true, tempSession = "", requiresSession = true } = {}
) {
  const WithApollo = ({
    apolloClient,
    apolloState,
    userData,
    ...pageProps
  }) => {
    const client = apolloClient || initApolloClient(apolloState, tempSession);

    return (
      <ApolloProvider client={client}>
        <UserDataContext.Provider value={userData}>
          <PageComponent {...pageProps} />
          {requiresSession && <SessionWatcher tempSession={tempSession} />}
        </UserDataContext.Provider>
      </ApolloProvider>
    );
  };

  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx;

      const apolloClient = (ctx.apolloClient = initApolloClient(
        {},
        tempSession,
        ctx.req
      ));

      const pageProps = PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : {};

      if (typeof window === "undefined") {
        if (ctx.res && ctx.res.finished) {
          return {};
        }

        if (ssr) {
          try {
            const { getDataFromTree } = await import("@apollo/react-ssr");
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            );
          } catch (error) {
            console.error("Error while running `getDataFromTree`", error);
          }
        }

        Head.rewind();
      }

      const apolloState = apolloClient.cache.extract();

      const { data, error } = await apolloClient.query({
        query: ME_QUERY,
        errorPolicy: "ignore"
      });

      return {
        ...pageProps,
        apolloState,
        userData: (data && data.me) || {}
      };
    };
  }

  return WithApollo;
}

const apolloClients = {};

function initApolloClient(
  apolloState,
  tempSession: string,
  req?: NextApiRequest
) {
  const sessionMethods = {
    getToken: () => getToken(tempSession, req),
    setToken: token => setToken(token, tempSession),
    shouldRenewToken: () => (req ? false : shouldRenewToken(tempSession)),
    onSessionError: error => onSessionError(error, tempSession)
  };

  if (typeof window === "undefined") {
    return createClient(apolloState, sessionMethods);
  }

  // Reuse client on the client-side
  if (!apolloClients[tempSession]) {
    apolloClients[tempSession] = createClient(apolloState, sessionMethods);
  }

  return apolloClients[tempSession];
}
