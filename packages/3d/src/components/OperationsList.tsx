import React, { FC, useRef, useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Droppable } from "react-beautiful-dnd";
import { Operation as Lib3DOperation } from "@bitbloq/lib3d";
import Operation from "./Operation";
import { IOperationParameter } from "../types";

export interface IOperationsListProps {
  operations: Lib3DOperation[];
  advancedMode: boolean;
  onOperationChange: (operation: Lib3DOperation) => any;
  onParameterFocus: (
    operation: Lib3DOperation,
    parameter: IOperationParameter
  ) => any;
  onParameterBlur: (
    operation: Lib3DOperation,
    parameter: IOperationParameter
  ) => any;
  onRemoveOperation: (operation: Lib3DOperation) => any;
}

const OperationsList: FC<IOperationsListProps> = ({
  operations,
  advancedMode,
  onOperationChange,
  onParameterFocus,
  onParameterBlur,
  onRemoveOperation
}) => {
  const [openOperations, setOpenOperations] = useState<string[]>([]);
  const prevOperations = useRef(operations);
  const prevOpenOperations = useRef(openOperations);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => {
      const newOperation = operations.find(
        o => !prevOperations.current.some(p => p.id === o.id)
      );
      if (newOperation) {
        setOpenOperations([...openOperations, newOperation.id!]);
      }
      prevOperations.current = operations;
    },
    [operations]
  );

  useEffect(
    () => {
      const lastOperation = operations[operations.length - 1] || {};
      if (
        openOperations.includes(lastOperation.id!) &&
        !prevOpenOperations.current.includes(lastOperation.id!)
      ) {
        if (container.current) {
          container.current.scrollTop = container.current.scrollHeight;
        }
      }
      prevOpenOperations.current = openOperations;
    },
    [openOperations]
  );

  const onOpen = useCallback(
    (operation: Lib3DOperation, isOpen: boolean) => {
      if (isOpen) {
        setOpenOperations([...openOperations, operation.id!]);
      } else {
        setOpenOperations(openOperations.filter(id => id !== operation.id));
      }
    },
    [openOperations]
  );

  const onParameterChange = useCallback(
    (operation: Lib3DOperation, parameter: IOperationParameter, value: any) => {
      onOperationChange(
        parameter.setValue
          ? parameter.setValue(operation, value)
          : { ...operation, [parameter.name!]: value }
      );
    },
    [onOperationChange]
  );

  return (
    <Droppable droppableId="operations">
      {provided => (
        <Container
          {...provided.droppableProps}
          ref={el => {
            container.current = el;
            provided.innerRef(el);
          }}
        >
          {operations.map((operation, i) => (
            <Operation
              key={operation.id}
              index={i}
              operation={operation}
              advancedMode={advancedMode}
              isOpen={openOperations.includes(operation.id!)}
              onOpen={onOpen}
              onParameterChange={onParameterChange}
              onOperationChange={onOperationChange}
              onParameterFocus={onParameterFocus}
              onParameterBlur={onParameterBlur}
              onRemove={onRemoveOperation}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
};

export default OperationsList;

/* styled components */

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  padding: 10px;
  height: 0;
`;
