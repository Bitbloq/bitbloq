import styled from "@emotion/styled";
import { css } from "@emotion/core";
import colors from "../colors";

export interface ButtonProps {
  small?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  quaternary?: boolean;
  blue?: boolean;
  orange?: boolean;
  pink?: boolean;
  yellow?: boolean;
}
const Button = styled.button<ButtonProps>`
  border-radius: 4px;
  border: ${props => {
    if (props.quaternary) {
      return "solid 1px #dddddd";
    } else {
      return "none";
    }
  }};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ${props =>
    props.small &&
    css`
      height: 30px;
    `}

  ${props => {
    let color = "white";
    let bgColor = colors.green;
    let hoverColor = colors.greenHover;
    let pressedColor = colors.greenPressed;

    if (props.orange) {
      bgColor = colors.brandOrange;
      hoverColor = colors.brandOrangeHover;
      pressedColor = colors.brandOrangePressed;
    } else if (props.blue) {
      bgColor = colors.brandBlue;
      hoverColor = colors.brandBlueHover;
      pressedColor = colors.brandBluePressed;
    } else if (props.pink) {
      bgColor = colors.brandPink;
      hoverColor = colors.brandPinkHover;
      pressedColor = colors.brandPinkPressed;
    } else if (props.yellow) {
      bgColor = colors.brandYellow;
      hoverColor = colors.brandYellowHover;
      pressedColor = colors.brandYellowPressed;
    } else if (props.secondary) {
      bgColor = colors.black;
      hoverColor = colors.blackHover;
      pressedColor = colors.blackPressed;
    } else if (props.tertiary) {
      color = colors.black;
      bgColor = colors.tertiary;
      hoverColor = colors.tertiaryHover;
      pressedColor = colors.tertiaryPressed;
    } else if (props.quaternary) {
      color = colors.black;
      bgColor = "white";
      hoverColor = "#ebebeb";
      pressedColor = "#dedede";
    }

    return css`
      color: ${color};
      background-color: ${bgColor};
      &:hover {
        background-color: ${hoverColor};
      }
      &:active {
        background-color: ${pressedColor};
      }
    `;
  }}

  &[disabled] {
    color: ${colors.disabledColor};
    background-color: ${colors.disabledBackground};
    cursor: not-allowed;
  }
`;

/** @component */
export default Button;
