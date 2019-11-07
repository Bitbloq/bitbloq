import React, { FC } from "react";
import styled from "@emotion/styled";
import Router from "next/router";
import { Button, colors } from "@bitbloq/ui";
import logoBetaImage from "../images/logo-beta.svg";

export interface ErrorLayoutProps {
  title?: string;
  code?: string;
  text?: string;
  okText?: string;
  onOk?: () => any;
}

const ErrorLayout: FC<ErrorLayoutProps> = ({
  title,
  code,
  text,
  okText,
  onOk
}) => {
  return (
    <Wrap>
      <Container>
        <Logo src={logoBetaImage} alt="Bitbloq Beta" />
        <MainPanel>
          {code && <Code>{code}</Code>}
          {title && <Title>{title}</Title>}
          {text && <Text>{text}</Text>}
          <Button tertiary onClick={onOk}>
            {okText}
          </Button>
        </MainPanel>
      </Container>
    </Wrap>
  );
};

ErrorLayout.defaultProps = {
  okText: "Volver al inicio",
  onOk: () => Router.push("/")
};

export default ErrorLayout;

/* Styled components */

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Container = styled.div`
  max-width: 400px;
  margin: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

const Logo = styled.img`
  height: 40px;
  margin-bottom: 40px;
`;

const MainPanel = styled.div`
  border-radius: 10px;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 30px;
  text-align: center;

  button {
    width: 100%;
    margin-top: 40px;
  }
`;

const Code = styled.div`
  font-size: 100px;
  font-weight: 300;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Text = styled.div`
  margin-top: 40px;
  font-size: 14px;
  line-height: 1.57;
  color: #5d6069;
`;
