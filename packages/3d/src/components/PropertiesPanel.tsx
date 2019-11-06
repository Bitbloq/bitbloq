import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  IObjectsCommonJSON,
  IPrimitiveObjectJSON,
  ICompoundObjectJSON,
  IHelperDescription,
  Operation as Lib3DOperation
} from "@bitbloq/lib3d";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import PropertyInput from "./PropertyInput";
import OperationsList from "./OperationsList";
import { DropDown, Icon, Input, Tooltip, useTranslate } from "@bitbloq/ui";
import config from "../config";
import { IObjectParameter, IOperation, IOperationParameter } from "../types";

const colorParameter = {
  name: "color",
  label: "param-color",
  type: "color",
  isViewOption: true
};

const baseObjectParameter = {};

interface IPropertiesPanelProps {
  advancedMode: boolean;
  object: IObjectsCommonJSON;
  onSetActiveOperation: (helper: IHelperDescription) => any;
  onUnsetActiveOperation: () => any;
  isTopObject: boolean;
  onUpdateObject: (object: IObjectsCommonJSON) => any;
  onDeleteObject: (object: IObjectsCommonJSON) => any;
  onDuplicateObject: (object: IObjectsCommonJSON) => any;
  onUndoObject: (object: IObjectsCommonJSON) => any;
  onConvertToGroup: (object: IObjectsCommonJSON) => any;
}

const PropertiesPanel: FC<IPropertiesPanelProps> = ({
  advancedMode,
  object,
  onSetActiveOperation,
  onUnsetActiveOperation,
  isTopObject,
  onUpdateObject,
  onDeleteObject,
  onDuplicateObject,
  onUndoObject,
  onConvertToGroup
}) => {
  const t = useTranslate();
  const [draggingOperations, setDraggingOperations] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const { color } = object.viewOptions;

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(
    () => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    },
    [editingName]
  );

  const typeConfig = config.objectTypes.find(s => s.name === object.type)!;
  const {
    parameters: baseParameters,
    getParameters,
    icon,
    canUndo,
    undoLabel,
    canUngroup,
    canConverToGroup
  } = typeConfig;

  const parameters = [
    ...(getParameters
      ? getParameters(object as IPrimitiveObjectJSON)
      : baseParameters!)
  ];

  if (typeConfig.showBaseObject) {
    parameters.push({
      name: "baseObject",
      label: "param-base-object",
      type: "select",
      options: (object as ICompoundObjectJSON).children.map(child => ({
        label: child.viewOptions.name!,
        value: child
      }))
    });
  }

  if (!typeConfig.withoutColor) {
    parameters.push(colorParameter);
  }

  const onNameChange = (name: string) => {
    onUpdateObject(update(object, { viewOptions: { name: { $set: name } } }));
  };

  const objectRef = useRef(object);
  useEffect(
    () => {
      objectRef.current = object;
    },
    [object]
  );

  const onObjectParameterChange = useCallback(
    (parameter: IObjectParameter, value: any) => {
      const o = objectRef.current;
      if (parameter.name === "baseObject") {
        const compoundObject = o as ICompoundObjectJSON;
        const newChildren = compoundObject.children.filter(c => c !== value);
        newChildren.unshift(value);
        const newObject = { ...o, children: newChildren };
        onUpdateObject(newObject);
      } else if (parameter.isViewOption) {
        onUpdateObject(
          update(o, { viewOptions: { [parameter.name]: { $set: value } } })
        );
      } else {
        onUpdateObject(
          update(o as IPrimitiveObjectJSON, {
            parameters: { [parameter.name]: { $set: value } }
          })
        );
      }
    },
    [onUpdateObject]
  );

  const onObjectNameChange = (name: string) => {
    onUpdateObject(update(object, { viewOptions: { name: { $set: name } } }));
  };

  const onOperationChange = useCallback(
    (operation: Lib3DOperation) => {
      onUpdateObject(
        update(object, {
          operations: operations =>
            operations.map(o => (o.id === operation.id ? operation : o))
        })
      );
    },
    [object, onUpdateObject]
  );

  const onOperationParameterFocus = useCallback(
    (operation: Lib3DOperation, parameter: IOperationParameter) => {
      if (parameter.activeOperation) {
        onSetActiveOperation(parameter.activeOperation(object, operation));
      }
    },
    [object, onSetActiveOperation]
  );

  const onOperationParameterBlur = useCallback(
    (operation: Lib3DOperation, parameter: IOperationParameter) => {
      if (parameter.activeOperation) {
        onUnsetActiveOperation();
      }
    },
    [object, onUnsetActiveOperation]
  );

  const onDragStart = () => {
    setDraggingOperations(true);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    const operation = object.operations.find(({ id }) => id === draggableId);

    setDraggingOperations(false);

    if (!destination || !operation) {
      return;
    }

    onUpdateObject(
      update(object, {
        operations: {
          $splice: [[source.index, 1], [destination.index, 0, operation]]
        }
      })
    );
  };

  const onRenameClick = () => {
    setEditingName(true);
  };

  const onDeleteClick = () => {
    onDeleteObject(object);
  };

  const onDuplicateClick = () => {
    onDuplicateObject(object);
  };

  const onUngroupClick = () => {
    onUndoObject(object);
  };

  const onConvertToGroupClick = () => {
    onConvertToGroup(object);
  };

  const onUndoClick = () => {
    onUndoObject(object);
  };

  const onAddOperation = (operation: IOperation) => {
    onUpdateObject(
      update(object, { operations: { $push: [operation.create()] } })
    );
  };

  const onRemoveOperation = useCallback(
    (operation: Lib3DOperation) => {
      onUpdateObject(
        update(object, {
          operations: operations => operations.filter(op => op !== operation)
        })
      );
    },
    [object, onUpdateObject]
  );

  return (
    <Container>
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={result => onDragEnd(result)}
      >
        <Header>
          <HeaderIcon>{icon}</HeaderIcon>
          {editingName && (
            <NameInput
              type="text"
              ref={nameInputRef}
              value={object.viewOptions.name}
              onChange={e => onObjectNameChange(e.target.value)}
              onBlur={() => setEditingName(false)}
            />
          )}
          {!editingName && (
            <ObjectName onClick={() => setEditingName(true)}>
              <p>{object.viewOptions.name}</p> <Icon name="pencil" />
            </ObjectName>
          )}
          <DropDown>
            {(isOpen: boolean) => (
              <ContextButton isOpen={isOpen}>
                <Icon name="ellipsis" />
              </ContextButton>
            )}
            <ContextMenu>
              {isTopObject && (
                <ContextMenuOption onClick={onDuplicateClick}>
                  <Icon name="duplicate" /> {t("menu-duplicate")}
                </ContextMenuOption>
              )}
              <ContextMenuOption onClick={onRenameClick}>
                <Icon name="pencil" /> {t("menu-rename")}
              </ContextMenuOption>
              {canUngroup && (
                <ContextMenuOption onClick={onUngroupClick}>
                  <Icon name="ungroup" /> {t("menu-ungroup")}
                </ContextMenuOption>
              )}
              {canConverToGroup && (
                <ContextMenuOption onClick={onConvertToGroupClick}>
                  <Icon name="group" /> {t("menu-convert-to-group")}
                </ContextMenuOption>
              )}
              {canUndo && isTopObject && (
                <ContextMenuOption onClick={onUndoClick}>
                  <Icon name="undo" /> {undoLabel && t(undoLabel)}
                </ContextMenuOption>
              )}
              {isTopObject && (
                <ContextMenuOption danger={true} onClick={onDeleteClick}>
                  <Icon name="trash" /> {t("menu-delete")}
                </ContextMenuOption>
              )}
            </ContextMenu>
          </DropDown>
        </Header>
        <ObjectProperties>
          <ParametersPanel>
            {parameters.map(parameter => (
              <div style={{ position: "relative" }} key={parameter.name}>
                <ObjectPropertyInput
                  object={object as IPrimitiveObjectJSON}
                  parameter={parameter}
                  onObjectParameterChange={onObjectParameterChange}
                />
              </div>
            ))}
          </ParametersPanel>
          {advancedMode && (
            <ObjectButtons>
              {config.objectOperations.map(operation => (
                <Tooltip key={operation.name} content={t(operation.label)}>
                  {tooltipProps => (
                    <OperationButton
                      {...tooltipProps}
                      color={operation.color}
                      onClick={() => onAddOperation(operation)}
                    >
                      {operation.icon}
                    </OperationButton>
                  )}
                </Tooltip>
              ))}
            </ObjectButtons>
          )}
        </ObjectProperties>
        <OperationsList
          operations={object.operations}
          advancedMode={advancedMode}
          onOperationChange={onOperationChange}
          onParameterFocus={onOperationParameterFocus}
          onParameterBlur={onOperationParameterBlur}
          onRemoveOperation={onRemoveOperation}
        />
      </DragDropContext>
    </Container>
  );
};

export default PropertiesPanel;

interface IObjectPropertyInputProps {
  object: IObjectsCommonJSON;
  parameter: IObjectParameter;
  onObjectParameterChange: (parameter: IObjectParameter, value: any) => any;
}

const ObjectPropertyInput: FC<IObjectPropertyInputProps> = ({
  object,
  parameter,
  onObjectParameterChange
}) => {
  const onChange = useCallback(
    newValue => {
      onObjectParameterChange(parameter, newValue);
    },
    [parameter, onObjectParameterChange]
  );

  let value: any;
  if (parameter.name === "baseObject") {
    value = (object as ICompoundObjectJSON).children[0];
  } else {
    const baseObject = parameter.isViewOption
      ? object.viewOptions
      : (object as IPrimitiveObjectJSON).parameters;
    value = baseObject[parameter.name];
  }

  return (
    <PropertyInput parameter={parameter} value={value} onChange={onChange} />
  );
};

/* styled components */

const Wrap = styled.div`
  display: flex;
  width: 310px;
`;

const Container = styled.div`
  width: 310px;
  min-width: 310px;
  overflow: hidden;
  border-left: 1px solid #cfcfcf;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 50px;
  padding: 0px 20px;
  background-color: white;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  align-items: center;
  font-size: 1.1em;

  img {
    cursor: pointer;
  }
`;

const HeaderIcon = styled.div`
  margin-right: 10px;
  color: #4dc3ff;

  svg {
    width: 30px;
    height: auto;
  }
`;

const ObjectName = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-weigth: bold;
  font-style: italic;
  font-size: 13px;
  cursor: pointer;

  p {
    max-width: 175px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1px;
    white-space: nowrap;
  }

  svg {
    display: none;
    margin-left: 10px;
    width: 14px;
    height: auto;
  }

  &:hover {
    svg {
      display: block;
    }
  }
`;

const ObjectProperties = styled.div`
  border-bottom: 1px solid #cfcfcf;
  position: relative;
  font-size: 13px;
`;

const ParametersPanel = styled.div`
  padding: 20px;
`;

const ParametersForm = styled.div`
  flex: 1;
`;

const ObjectButtons = styled.div`
  display: flex;
  padding: 0px 4px 10px 4px;
`;

const OperationButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 3px;
  background-color: #ebebeb;
  flex: 1;
  margin: 0px 2px;
  border-bottom: 5px solid ${props => props.color};

  svg {
    width: 24px;
    height: auto;
  }
`;

const NameInput = styled(Input)`
  height: 30px;
  padding: 6px 8px;
`;

const ContextButton = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;

  ${props =>
    props.isOpen &&
    css`
      border: solid 1px #dddddd;
      background-color: #e8e8e8;
    `} svg {
    transform: rotate(90deg);
  }
`;

const ContextMenu = styled.div`
  background-color: white;
  margin-top: 6px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  border: solid 1px #cfcfcf;
`;

const ContextMenuOption = styled.div<{ danger?: boolean }>`
  width: 220px;
  display: flex;
  align-items: center;
  height: 34px;
  border-bottom: 1px solid #ebebeb;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin: 0px 14px;
    width: 13px;
    height: auto;
  }

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }

  ${props =>
    props.danger &&
    css`
      color: #d82b32;
    `};
`;
