import * as React from "react";
import styled from "@emotion/styled";
import { Icon, useTranslate } from "@bitbloq/ui";
import { documentTypes } from "../config";

interface IDocumentTypeTagProps {
  document: any;
  small?: boolean;
}

const DocumentTypeTag: React.SFC<IDocumentTypeTagProps> = ({
  document,
  small
}) => {
  const t = useTranslate();
  const documentType = documentTypes[document.type] || {};

  return (
    <Container color={documentType.color} small={small}>
      <Icon name={documentType.icon} />
      {t(documentType.shortLabel)}
    </Container>
  );
};

export default DocumentTypeTag;

const Container = styled.div<{ color: string; small?: boolean }>`
  background-color: ${props => props.color};
  color: white;
  display: inline-flex;
  align-items: center;
  padding: 0px 5px;
  box-sizing: border-box;
  font-weight: 500;
  border-radius: 1px;
  height: ${props => (props.small ? "24px" : "30px")};
  font-size: ${props => (props.small ? "12px" : "14px")};

  svg {
    width: ${props => (props.small ? "16px" : "19px")};
    height: ${props => (props.small ? "16px" : "19px")};
    margin-right: 6px;
  }
`;
