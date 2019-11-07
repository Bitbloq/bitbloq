import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import { css } from "@emotion/core";
import logoBetaImage from "../images/logo-beta.svg";
import Layout from "./Layout";

export interface IAppHeaderProps {
  isSticky?: boolean;
}

const AppHeader: FC<IAppHeaderProps> = ({ children, isSticky }) => {
  return (
    <Container isSticky={isSticky}>
      <Layout>
        <Header isSticky={isSticky}>
          <Logo isSticky={isSticky} src={logoBetaImage} alt="Bitbloq" />
          <Content>{children}</Content>
        </Header>
      </Layout>
    </Container>
  );
};

export default AppHeader;

/* styled components */

const Container = styled.div<IAppHeaderProps>`
  background-color: white;
  border-bottom: 1px solid ${colors.gray3};
  transition: min-height 0.3s ease-out;

  ${props =>
    props.isSticky
      ? css`
          border-bottom: 1px solid ${colors.gray3};
          position: fixed;
          width: -webkit-fill-available;
          z-index: 19; /* modals z-index = 20 */
        `
      : props.isSticky !== undefined &&
        css`
          border-bottom: none;
          margin-top: 10px;
        `};
`;

const Content = styled.div`
  align-items: center;
  display: flex;
  > * {
    margin-left: 10px;
  }
`;

const Header = styled.div<IAppHeaderProps>`
  display: flex;
  justify-content: space-between;
  min-height: ${props =>
    props.isSticky !== undefined && !props.isSticky ? "80" : "60"}px;
  transition: min-height 0.3s ease-out;
`;

const Logo = styled.img<IAppHeaderProps>`
  height: ${props =>
    props.isSticky === undefined || props.isSticky ? "30" : "40"}px;
  transform: translateY(50%);
  transition: height 100ms ease-out;
`;
