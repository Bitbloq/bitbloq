import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";

interface IBrowserVersionWarningProps {
  version: number;
  color?: string;
}

const BrowserVersionWarning: React.SFC<IBrowserVersionWarningProps> = ({
  version,
  color
}) => (
  <WarningScreen color={color}>
    <WarningModal>
      <h2>Aviso</h2>
      <p>
        Hemos detectado que el navegador que estas utilizando no es compatible
        con Bitbloq. Para hacer un uso optimo de la herramienta, asegúrate de
        utilizar <b>Google Chrome con la versión {version} o superior</b>.
        Puedes descargarlo haciendo clic en{" "}
        <a href="https://www.google.com/chrome/">este enlace</a>.
      </p>
    </WarningModal>
  </WarningScreen>
);

export default BrowserVersionWarning;

/* styled components */

interface IWarningScreenProps {
  color?: string;
}
const WarningScreen = styled.div<IWarningScreenProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningModal = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 4px;
  width: 400px;
  text-align: center;

  h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 0px 0px 40px 0px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    color: ${colors.blackHover};
  }

  a {
    color: #00ade5;
    text-decoration: none;
    font-style: italic;
    font-weight: bold;
  }
`;
