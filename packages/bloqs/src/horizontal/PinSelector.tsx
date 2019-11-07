import React, { FC } from "react";
import styled from "@emotion/styled";
import { useTranslate } from "@bitbloq/ui";

import {
  IComponentInstance,
  IBoard,
  IPort,
  IComponent,
  IPortDirection
} from "../index";

interface IPinSelectorProps {
  value: string;
  onChange: (newValue: string) => any;
  componentInstances: IComponentInstance[];
  fallbackComponent: string;
  board: IBoard;
  components: IComponent[];
}

const PinSelector: FC<IPinSelectorProps> = ({
  value,
  onChange,
  componentInstances,
  fallbackComponent,
  board,
  components
}) => {
  const t = useTranslate();
  const componentInstance = componentInstances.find(c => c.name === value)!;
  const component =
    componentInstance &&
    components.find(c => c.name === componentInstance.component);

  if (componentInstance && componentInstance.integrated) {
    return null;
  }

  const connectionPath = (port: IPort) => {
    const portX = port.schematicPosition.x * 95;
    const portY = -port.schematicPosition.y * 85;
    const placeholderX = port.schematicPlaceholderPosition.x * 95;
    const placeholderY = -port.schematicPlaceholderPosition.y * 85;

    if (
      port.direction === IPortDirection.West ||
      port.direction === IPortDirection.East
    ) {
      return `
        M ${portX},${portY}
        L ${placeholderX},${portY}
        L ${placeholderX},${placeholderY}
      `;
    }

    return `
      M ${portX},${portY}
      L ${portX},${placeholderY}
      L ${placeholderX},${placeholderY}
    `;
  };

  return (
    <Container>
      <Header>
        <img src={component && component.image && component.image.url} />
        {component ? t(component.label!) : t("junior.component-not-found")}
      </Header>
      <BoardSchema>
        <Connections viewBox="-95 -85 190 170">
          {board.ports.map((port, i) => (
            <React.Fragment key={port.name}>
              <path
                d={connectionPath(port)}
                fill="none"
                stroke="#979797"
                strokeWidth={1}
              />
              <circle
                fill="#979797"
                r={13}
                cx={board.schematicCenter.x * 95}
                cy={-board.schematicCenter.y * 85}
              />
              <circle
                fill="#979797"
                r={10}
                cx={port.schematicPlaceholderPosition.x * 95}
                cy={-port.schematicPlaceholderPosition.y * 85}
              />
            </React.Fragment>
          ))}
        </Connections>
        {componentInstances.map(c => {
          const port = board.ports.find(p => p.name === c.port)!;
          return (
            <PortButton
              key={c.name}
              selected={componentInstance === c}
              left={port.schematicPlaceholderPosition.x * 95 + 95}
              top={-port.schematicPlaceholderPosition.y * 85 + 85}
              onClick={() => onChange(c.name)}
            >
              <button>{port.name}</button>
            </PortButton>
          );
        })}
      </BoardSchema>
    </Container>
  );
};

export default PinSelector;

const Container = styled.div`
  border: 1px solid #979797;
  border-radius: 3px;
`;

const Header = styled.div`
  border-bottom: 1px solid #979797;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0px 10px;
  line-height: 1.2;

  img {
    height: 40px;
    margin-right: 12px;
  }
`;

const BoardSchema = styled.div`
  position: relative;
  margin-top: 10px;
`;

const Connections = styled.svg`
  width: 190px;
`;

interface IPortButtonProps {
  selected?: boolean;
  top: number;
  left: number;
}
const PortButton = styled.div<IPortButtonProps>`
  position: absolute;
  transform: translate(-50%, -50%);
  border: 3px solid #979797;
  border-radius: 9px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;

  button {
    cursor: pointer;
    border-radius: 6px;
    width: 30px;
    height: 30px;
    border: none;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    box-shadow: 0 ${props => (props.selected ? 2 : 8)}px 0 0 #ddd;
    transform: translate(0, ${props => (props.selected ? -2 : -8)}px);

    &:focus {
      outline: none;
    }

    &:active {
      box-shadow: 0 ${props => (props.selected ? 2 : 7)}px 0 0 #ddd;
      transform: translate(0, ${props => (props.selected ? -2 : -7)}px);
    }
  }
`;
