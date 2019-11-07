import React, { FC } from "react";
import styled from "@emotion/styled";
import Icon from "./Icon";
import HorizontalRule from "./HorizontalRule";
import colors from "../colors";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  showHeader?: boolean;
  onClose?: () => void;
  transparentOverlay?: boolean;
  className?: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  title,
  showHeader,
  onClose,
  transparentOverlay,
  children,
  className
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay
      className={className}
      onMouseDown={onClose}
      transparent={transparentOverlay}
    >
      <Container
        onMouseDown={(e: Event) => e.stopPropagation()}
        withShadow={transparentOverlay}
      >
        {showHeader && (
          <>
            <Header>
              <Title>{title}</Title>
              {onClose && (
                <Close onClick={onClose}>
                  <Icon name="close" />
                </Close>
              )}
            </Header>
            <HorizontalRule small />
          </>
        )}
        <div>{children}</div>
      </Container>
    </Overlay>
  );
};

Modal.defaultProps = {
  isOpen: false,
  showHeader: true
};

export default Modal;

/* styled components */

interface OverlayProps {
  transparent?: boolean;
}
const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 20;
  background: ${(props: OverlayProps) =>
    props.transparent ? "transparent" : "rgba(0, 0, 0, 0.4)"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ContainerProps {
  withShadow?: boolean;
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background-color: white;
  box-shadow: ${(props: ContainerProps) =>
    props.withShadow ? "0 10px 40px 0 rgba(0, 0, 0, 0.1)" : "none"};
`;

const Header = styled.div`
  display: flex;
  height: 60px;
`;

const Title = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  display: flex;
  align-items: center;
`;

const Close = styled.div`
  color: ${colors.gray4};
  width: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
