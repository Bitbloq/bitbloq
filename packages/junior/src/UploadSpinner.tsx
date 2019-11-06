import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { keyframes } from "@emotion/core";
import { Icon, colors } from "@bitbloq/ui";

export interface UploadSpinnerProps {
  uploading: boolean;
  success: boolean;
  onClick: (e: React.MouseEvent) => any;
}

const UploadSpinner: FC<UploadSpinnerProps> = ({
  uploading,
  success,
  onClick
}) => {
  let icon = "";
  if (uploading) {
    icon = "brain";
  } else if (success) {
    icon = "tick";
  } else if (!success) {
    icon = "close";
  }

  return (
    <Overlay onClick={onClick}>
      <Container uploading={uploading} success={success}>
        <Icon name={icon} />
        <Spinner uploading={uploading} success={success} />
      </Container>
    </Overlay>
  );
};

export default UploadSpinner;

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IContainerProps {
  uploading: boolean;
  success: boolean;
}
const Container = styled.div<IContainerProps>`
  width: 164px;
  height: 164px;
  border-radius: 4px;
  background-color: #373b44;
  color: ${props => {
    if (props.uploading) {
      return "white";
    } else if (props.success) {
      return colors.green;
    } else if (!props.success) {
      return colors.red;
    } else {
      return "white";
    }
  }};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 60px;
    height: 60px;
  }
`;

const rotation = keyframes`
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
`;

interface ISpinnerProps {
  uploading: boolean;
  success: boolean;
}
const Spinner = styled.div<ISpinnerProps>`
  position: absolute;
  top: 18px;
  left: 18px;
  width: 120px;
  height: 120px;
  border-radius: 64px;
  border-width: 4px;
  border-style: solid;

  ${props => {
    if (props.uploading) {
      return css`
        animation: ${rotation} 2s ease infinite;
        border-color: white white white rgba(255, 255, 255, 0.4);
      `;
    }
    if (props.success) {
      return css`
        border-color: ${colors.green};
      `;
    }
    if (!props.success) {
      return css`
        border-color: ${colors.red};
      `;
    }
    return css``;
  }}
`;
