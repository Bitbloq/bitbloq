import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

export interface SwitchProps {
  className?: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
  leftRight?: boolean;
}

export const Switch: React.SFC<SwitchProps> = ({
  className,
  value,
  onChange,
  leftRight
}) => (
  <Container
    className={className}
    onClick={() => onChange(!value)}
    leftRight={leftRight}
  >
    <Toggle active={value} leftRight={leftRight} />
  </Container>
);

export default Switch;

/* styled components */

interface ContainerProps {
  leftRight?: boolean;
}
const Container = styled.div<ContainerProps>`
  align-items: center;
  display: flex;
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 14px;
  border: 1px solid #cfcfcf;
  cursor: pointer;
`;

interface ToggleProps {
  active: boolean;
  leftRight?: boolean;
}
const Toggle = styled.div<ToggleProps>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #9b9da1;
  transition: transform 100ms ease-out;
  transform: translate(2px);

  ${props =>
    props.active &&
    !props.leftRight &&
    css`
      background-color: #82ad3a;
    `};

  ${props =>
    props.active &&
    css`
      transform: translate(24px);
    `};
`;
