import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { DropDown, Icon, useTranslate } from "@bitbloq/ui";
import config from "../config";
import AddObjectDropdown from "./AddObjectDropdown";
import { IObjectsCommonJSON, ICompoundObjectJSON } from "@bitbloq/lib3d";
import { IObjectType, IShape, IShapeGroup } from "../types";

export interface IObjectTreeProps {
  advancedMode: boolean;
  objects: IObjectsCommonJSON[];
  selectedObjects: IObjectsCommonJSON[];
  onCreateObject: (object: IObjectsCommonJSON) => any;
  onDeleteObject: (object: IObjectsCommonJSON) => any;
  onUpdateObject: (object: IObjectsCommonJSON | ICompoundObjectJSON) => any;
  onObjectClick: (object: IObjectsCommonJSON) => any;
  shapeGroups: IShapeGroup[];
}

const ObjectTree: FC<IObjectTreeProps> = ({
  advancedMode,
  objects,
  selectedObjects,
  onCreateObject,
  onDeleteObject,
  onUpdateObject,
  onObjectClick,
  shapeGroups
}) => {
  const addDropdownRef = useRef<DropDown>(null);
  const [collapsedItems, setCollapsedItems] = useState<string[]>([]);
  const [objectsLoaded, setObjectsLoaded] = useState(false);

  useEffect(
    () => {
      if (objects && objects.length && !objectsLoaded) {
        setCollapsedItems(getChildrenIds(objects));
        setObjectsLoaded(true);
      }
    },
    [objects]
  );

  const t = useTranslate();

  const onCollapseClick = (e: React.MouseEvent, object: IObjectsCommonJSON) => {
    e.stopPropagation();
    setCollapsedItems(
      collapsedItems.includes(object.id)
        ? collapsedItems.filter(id => id !== object.id)
        : [...collapsedItems, object.id]
    );
  };

  const onAddObject = useCallback(
    (typeConfig: IShape) => {
      const object = {
        id: "",
        type: typeConfig.type,
        parameters: typeConfig.parameters,
        operations: config.defaultOperations(advancedMode),
        viewOptions: {
          name: t(typeConfig.label),
          color: config.colors[Math.floor(Math.random() * config.colors.length)]
        }
      };

      const addDropdown = addDropdownRef.current;
      if (addDropdown) {
        addDropdown.close();
      }

      onCreateObject(object);
    },
    [onCreateObject]
  );

  const onDeleteClick = (object: IObjectsCommonJSON) => {
    onDeleteObject(object);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || !destination.droppableId) {
      return;
    }

    const parent = objects.find(
      ({ id }) => id === destination.droppableId
    ) as ICompoundObjectJSON;
    if (!parent || !parent.children) {
      return;
    }

    const child = parent.children.find(({ id }) => id === draggableId);
    if (!child) {
      return;
    }

    const newChildren = [...parent.children];
    newChildren.splice(source.index, 1);
    newChildren.splice(destination.index, 0, child);
    onUpdateObject({
      ...parent,
      children: newChildren
    });
  };

  const renderObjectItem = (
    object: IObjectsCommonJSON,
    index: number,
    depth: number,
    parent: IObjectsCommonJSON | null = null
  ) => {
    const isSelected = selectedObjects.includes(object);
    const isTop = objects.includes(object);
    const { children = [], id } = object as ICompoundObjectJSON;
    const isCollapsed = collapsedItems.includes(id);

    let icon: JSX.Element | undefined;
    if (children.length) {
      const typeConfig = config.objectTypes.find(
        type => type.name === object.type
      );
      icon = typeConfig && typeConfig.icon;
    }

    return (
      <Draggable draggableId={id} index={index} key={id}>
        {(provided, snapshot) => (
          <ObjectItem
            {...provided.draggableProps}
            isSelected={isSelected}
            isParent={children.length > 0}
            ref={provided.innerRef}
          >
            <ObjectName
              isSelected={isSelected}
              isParent={children.length > 0}
              onClick={() => onObjectClick(object)}
            >
              <DragHandle {...provided.dragHandleProps}>
                <Icon name="drag" />
              </DragHandle>
              {depth > 0 && (
                <AngleIcon depth={depth}>
                  <Icon name="curve-angle" />
                </AngleIcon>
              )}
              {children.length > 0 && (
                <CollapseButton
                  collapsed={isCollapsed}
                  onClick={e => onCollapseClick(e, object)}
                >
                  <Icon name="angle" />
                </CollapseButton>
              )}
              <span className="object-name">
                {object.viewOptions.name || object.type}
              </span>
              {icon && <ObjectTypeIcon>{icon}</ObjectTypeIcon>}
              {isTop && (
                <DeleteObject onClick={() => onDeleteClick(object)}>
                  <Icon name="trash" />
                </DeleteObject>
              )}
            </ObjectName>
            {!isCollapsed && renderObjectList(children, depth + 1, object)}
          </ObjectItem>
        )}
      </Draggable>
    );
  };

  const renderObjectList = (
    objectsList: IObjectsCommonJSON[],
    depth = 0,
    parent: IObjectsCommonJSON | null = null
  ) => {
    if (objectsList && objectsList.length) {
      const parentId = parent ? parent.id : "root";
      return (
        <Droppable droppableId={parentId} type={parentId}>
          {provided => (
            <ObjectList ref={provided.innerRef} {...provided.droppableProps}>
              {objectsList.map((object, index) =>
                renderObjectItem(object, index, depth, parent)
              )}
              {provided.placeholder}
            </ObjectList>
          )}
        </Droppable>
      );
    }

    return null;
  };

  return (
    <DragDropContext onDragEnd={result => onDragEnd(result)}>
      <Container>
        <DropDown
          ref={addDropdownRef}
          attachmentPosition="top left"
          targetPosition="bottom left"
          closeOnClick={false}
        >
          {(isOpen: boolean) => (
            <AddButton isOpen={isOpen}>
              <div>+ {t("add-object")}</div>
            </AddButton>
          )}
          <AddObjectDropdown
            shapeGroups={shapeGroups}
            onAddObject={onAddObject}
          />
        </DropDown>
        <Tree>{renderObjectList(objects)}</Tree>
      </Container>
    </DragDropContext>
  );
};

const getChildrenIds = (objects: IObjectsCommonJSON[]): string[] =>
  objects
    ? objects.flatMap(object => [
        ...getChildrenIds((object as ICompoundObjectJSON).children),
        object.id
      ])
    : [];

export default ObjectTree;

/* styled components */
const Container = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cfcfcf;
`;

interface IAddButtonProps {
  isOpen: boolean;
}
const AddButton = styled.div<IAddButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #ebebeb;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #cfcfcf;
  z-index: 2;
  box-shadow: ${props =>
    props.isOpen ? "0 3px 7px 0 rgba(0, 0, 0, 0.5);" : "none"};
`;

const Tree = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  padding: 20px 0px;
`;

const ObjectList = styled.ul`
  width: 100%;
`;

interface IObjectItemProps {
  isSelected: boolean;
  isParent: boolean;
}
const ObjectItem = styled.li<IObjectItemProps>`
  width: 100%;
  box-sizing: border-box;
  ${props =>
    props.isSelected &&
    props.isParent &&
    css`
      border-width: 0px 2px 3px 2px;
      border-style: solid;
      border-color: #4dc3ff;
    `}
`;

const DragHandle = styled.div`
  margin-right: 4px;
  color: #cccccc;
  svg {
    width: 13px;
  }
`;

const ObjectTypeIcon = styled.div`
  svg {
    width: 12px;
  }
`;

const DeleteObject = styled.div`
  display: none;
`;

interface IObjectNameProps {
  isSelected: boolean;
  isParent: boolean;
}
const ObjectName = styled.div<IObjectNameProps>`
  padding: 0px 8px 0px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-color: #eee;
  border-style: solid;
  border-width: 1px 0px 1px 0px;
  background-color: white;
  font-size: 13px;
  height: 30px;
  margin-bottom: -1px;

  span.object-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    ${DeleteObject} {
      display: block;
    }
    ${ObjectTypeIcon} {
      display: none;
    }
  }

  ${props =>
    props.isParent &&
    css`
      background-color: #eeeeee;
    `};

  ${props =>
    props.isSelected &&
    css`
      color: white;
      background-color: #4dc3ff;
      border-color: inherit;

      ${DragHandle} {
        color: white;
      }
    `};

  span {
    flex: 1;
  }

  img {
    width: 24px;
  }
`;

interface IAngleIconProps {
  depth: number;
}
const AngleIcon = styled.div<IAngleIconProps>`
  margin-left: ${props => (props.depth - 1) * 16}px;
  svg {
    width: 10px;
    height: 10px;
    margin-right: 6px;
  }
`;

interface ICollapseButtonProps {
  collapsed: boolean;
}
const CollapseButton = styled.div<ICollapseButtonProps>`
  display: flex;

  svg {
    width: 10px;
    margin-right: 6px;
  }

  ${props =>
    props.collapsed &&
    css`
      svg {
        transform: rotate(-90deg);
      }
    `};
`;
