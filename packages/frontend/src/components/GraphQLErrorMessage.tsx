import React, { FC } from "react";
import { ApolloError } from "apollo-client";
import ErrorLayout from "./ErrorLayout";

export interface GraphQLErrorMessageProps {
  apolloError: ApolloError;
}

const GraphQLErrorMessage: FC<GraphQLErrorMessageProps> = ({ apolloError }) => {
  const { graphQLErrors } = apolloError;
  if (graphQLErrors.length === 0) {
    return null;
  }

  const error = graphQLErrors[0];
  const extensionCode = (error.extensions && error.extensions.code) || "";

  return <ErrorLayout {...getErrorProps(extensionCode)} />;
};

export default GraphQLErrorMessage;

const getErrorProps = (extensionCode: string) => {
  switch (extensionCode) {
    case "DOCUMENT_NOT_FOUND":
      return {
        title: "Documento no encontrado",
        text: "Lo sentimos, no encontramos este documento."
      };

    case "NOT_YOUR_DOCUMENT":
    case "UNAUTHENTICATED":
      return {
        code: "403",
        text: "Lo sentimos, no tienes permisos para poder ver este contenido"
      };

    case "EXERCISE_NOT_FOUND":
      return {
        title: "Ejercicio no encontrado",
        text: "Lo sentimos, no encontramos este ejercicio."
      };

    case "FOLDER_NOT_FOUND":
      return {
        title: "Carpeta no encontrada",
        text: "Lo sentimos, no encontramos esta carpeta."
      };

    default:
      return {
        code: "500",
        text:
          "¡Uy! Ha ocurrido un error inesperado, vuelve a intentarlo más tarde."
      };
  }
};
