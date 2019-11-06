import React, { FC, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Draggable } from "react-beautiful-dnd";
import ProportionalGroup from "./ProportionalGroup";
import PropertyInput from "./PropertyInput";
import config from "../config";
import { Icon, Tooltip, useTranslate } from "@bitbloq/ui";
import { Operation as Lib3DOperation } from "@bitbloq/lib3d";
import { IOperationParameter } from "../types";

const objectOperationsMap: { [key: string]: IOperationParameter } = {};
config.objectOperations.forEach(
  operation => (objectOperationsMap[operation.name] = operation)
);

export interface IOperationProps {
  index: number;
  operation: Lib3DOperation;
  advancedMode: boolean;
  isOpen: boolean;
  onOpen: (operation: Lib3DOperation, isOpen: boolean) => any;
  onParameterChange: (
    operation: Lib3DOperation,
    parameter: IOperationParameter,
    value: any
  ) => any;
  onOperationChange: (operation: Lib3DOperation) => any;
  onParameterFocus: (
    operation: Lib3DOperation,
    parameter: IOperationParameter
  ) => any;
  onParameterBlur: (
    operation: Lib3DOperation,
    parameter: IOperationParameter
  ) => any;
  onRemove: (operation: Lib3DOperation) => any;
}

const Operation: FC<IOperationProps> = ({
  index,
  operation,
  advancedMode,
  isOpen,
  onOpen,
  onParameterChange,
  onOperationChange,
  onParameterFocus,
  onParameterBlur,
  onRemove
}) => {
  const t = useTranslate();

  const { label, basicLabel, parameters, color } = objectOperationsMap[
    operation.type
  ];

  const title = advancedMode || !basicLabel ? t(label!) : t(basicLabel);

  const onTitleClick = useCallback(
    () => {
      onOpen(operation, !isOpen);
    },
    [isOpen, onOpen]
  );

  return (
    <Draggable draggableId={operation.id!} index={index}>
      {(provided, snapshot) => (
        <Wrap
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          color={color}
        >
          <Container>
            <Header isOpen={isOpen} advancedMode={advancedMode}>
              <Handler
                {...provided.dragHandleProps}
                onMouseDown={e => {
                  e.persist();
                  onOpen(operation, false);
                  setTimeout(() => {
                    if (provided.dragHandleProps) {
                      provided.dragHandleProps.onMouseDown(e);
                    }
                  }, 300);
                }}
              >
                <Icon name="drag" />
              </Handler>
              <HeaderContent onClick={onTitleClick}>
                <Icon name="angle" />
                <Title>{title}</Title>
              </HeaderContent>
              <HeaderButtons>
                <HeaderButton onClick={() => onRemove(operation)}>
                  <Icon name="trash" />
                </HeaderButton>
              </HeaderButtons>
            </Header>
            {isOpen && (
              <Content>
                {(parameters || []).map((parameter, i) => (
                  <OperationParameter
                    key={parameter.name || `operation-parameter-${i}`}
                    operation={operation}
                    parameter={parameter}
                    advancedMode={advancedMode}
                    onParameterChange={onParameterChange}
                    onOperationChange={onOperationChange}
                    onParameterFocus={onParameterFocus}
                    onParameterBlur={onParameterBlur}
                  />
                ))}
              </Content>
            )}
          </Container>
        </Wrap>
      )}
    </Draggable>
  );
};

export default Operation;

interface IOperationParameterProps {
  operation: Lib3DOperation;
  parameter: IOperationParameter;
  advancedMode: boolean;
  onParameterChange: (
    operation: Lib3DOperation,
    parameter: IOperationParameter,
    value: any
  ) => any;
  onOperationChange: (operation: Lib3DOperation) => any;
  onParameterFocus: (
    operation: Lib3DOperation,
    parameter: IOperationParameter
  ) => any;
  onParameterBlur: (
    operation: Lib3DOperation,
    parameter: IOperationParameter
  ) => any;
}
const OperationParameter: FC<IOperationParameterProps> = ({
  operation,
  parameter,
  advancedMode,
  onParameterChange,
  onOperationChange,
  onParameterFocus,
  onParameterBlur
}) => {
  const onInputChange = useCallback(
    (newValue: any) => {
      onParameterChange(operation, parameter, newValue);
    },
    [operation, parameter, onParameterChange]
  );

  const onInputFocus = useCallback(
    () => {
      onParameterFocus(operation, parameter);
    },
    [operation, parameter, onParameterFocus]
  );

  const onInputBlur = useCallback(
    () => {
      onParameterBlur(operation, parameter);
    },
    [operation, parameter, onParameterBlur]
  );

  if (
    (parameter.advancedMode && !advancedMode) ||
    (parameter.basicMode && advancedMode)
  ) {
    return null;
  }

  if (parameter.type === "proportional-group") {
    return (
      <ProportionalGroup
        parameters={parameter.parameters!}
        object={operation}
        onObjectChange={onOperationChange}
      />
    );
  }

  const value = parameter.getValue
    ? parameter.getValue(operation)
    : operation[parameter.name!];

  return (
    <PropertyInput
      parameter={parameter}
      value={value}
      onChange={onInputChange}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
    />
  );
};

/* styled components */

interface IWrapProps {
  isDragging: boolean;
  color?: string;
}
const Wrap = styled.div<IWrapProps>`
  border-radius: 3px;
  border-left: 5px solid ${props => props.color};
  margin: 4px 0px;
  ${props =>
    props.isDragging &&
    css`
      box-shadow: 0 0 0 2px #4dc3ff;
    `};
`;

const Container = styled.div`
  background-color: white;
  border: 1px solid #ebebeb;
  border-radius: 0px 3px 3px 0px;
`;

const HeaderContent = styled.div`
  display: flex;
  height: 40px;
  flex: 1;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  padding-left: 10px;

  svg {
    transform: rotate(-90deg);
    margin: 0px 8px 0px 2px;
  }
`;

const HeaderButtons = styled.div`
  display: none;
  margin-right: 15px;
`;

const HeaderButton = styled.div`
  color: #8c919b;
  padding: 0px 5px;
  svg {
    height: auto;
    width: 12px;
  }
`;

const Handler = styled.div`
  height: 18px;
  margin: 0px 6px;
  color: #cccccc;
  display: none;
`;

interface IHeaderProps {
  isOpen: boolean;
  advancedMode: boolean;
}
const Header = styled.div<IHeaderProps>`
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #ebebeb;

  ${props =>
    props.isOpen &&
    css`
      ${HeaderContent} svg {
        transform: rotate(0deg);
      }
    `};

  ${props =>
    props.advancedMode &&
    css`
      ${Handler} {
        display: block;
      }

      ${HeaderContent} {
        padding-left: 0px;
      }
    `}

  &:hover ${HeaderButtons} {
    display: ${props => (props.advancedMode ? "block" : "none")};
  }
`;

const Title = styled.div`
  flex: 1;
  text-transform: capitalize;
`;

const Content = styled.div`
  padding: 20px;
  font-size: 13px;
`;
