import React, { useEffect, useState } from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { useMutation } from "react-apollo";
import { Spinner } from "@bitbloq/ui";
import gql from "graphql-tag";
import { setToken } from "../lib/session";
import { ApolloError } from "apollo-client";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation ActivateAccount($token: String!) {
    activateAccount(token: $token)
  }
`;

const Activate = () => {
  const [activateAccount] = useMutation(ACTIVATE_ACCOUNT_MUTATION);
  const [error, setError] = useState<ApolloError>();
  const token = location.search.split("?token=")[1];

  useEffect(() => {
    activateAccount({ variables: { token } })
      .then(({ data }) => {
        setToken(data.activateAccount);
        Router.push("/app");
      })
      .catch(e => setError(e));
  }, []);

  if (error) return <GraphQLErrorMessage apolloError={error} />;
  return (
    <Container>
      <Loading />
    </Container>
  );
};

export default Activate;

/* styled components */

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Loading = styled(Spinner)`
  flex: 1;
`;
