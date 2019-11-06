import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import {
  Document,
  Icon,
  Switch,
  useTranslate,
  TranslateFn,
  IHeaderButton,
  MainMenuOption
} from "@bitbloq/ui";
import {
  Object3D,
  Operation,
  isTranslateOperation,
  isRotationOperation,
  isScaleOperation,
  isMirrorOperation,
  Scene,
  IObjectsCommonJSON,
  IViewOptions,
  IHelperDescription,
  Renderer
} from "@bitbloq/lib3d";

import ObjectTree from "./ObjectTree";
import ThreeDViewer from "./ThreeDViewer";
import Toolbar from "./Toolbar";
import PropertiesPanel from "./PropertiesPanel";
import config from "../config";
import { getRandomColor, createObjectName, findObject } from "../util";
import { IShapeGroup } from "../types";

export interface IThreeDRef {
  createObject: (type: string, paramaterers: object, name: string) => void;
  exportToSTL: (name: string, separate: boolean) => void;
}

export interface IThreeDProps {
  initialContent?: any;
  onMenuOptionClick: (option: any) => any;
  title: string;
  onEditTitle: () => any;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  headerButtons?: IHeaderButton[];
  headerRightContent?: React.ReactChild;
  onHeaderButtonClick?: (id: string) => any;
  addShapeGroups: (base: IShapeGroup[]) => IShapeGroup[];
  menuOptions: (base: MainMenuOption[]) => MainMenuOption[];
  preMenuContent?: React.ReactChild;
  postMenuContent?: React.ReactChild;
  backCallback: () => any;
  documentAdvancedMode: boolean;
  changeAdvancedMode: (advancedMode: boolean) => any;
  onContentChange: (content: IObjectsCommonJSON[]) => any;
  threeDRef?: { current: IThreeDRef | null };
  brandColor: string;
  children: any;
}

const ThreeD: React.FC<IThreeDProps> = ({
  initialContent,
  onMenuOptionClick,
  title,
  onEditTitle,
  tabIndex,
  onTabChange,
  headerButtons,
  headerRightContent,
  onHeaderButtonClick,
  children,
  addShapeGroups,
  menuOptions,
  preMenuContent,
  postMenuContent,
  backCallback,
  documentAdvancedMode,
  changeAdvancedMode,
  onContentChange,
  threeDRef,
  brandColor
}) => {
  const sceneRef = useRef<Scene | null>(null);
  const initialObjectsRef = useRef<IObjectsCommonJSON[]>([]);

  const [objects, setObjects] = useState<IObjectsCommonJSON[]>([]);

  useEffect(() => {
    const initialScene = Scene.newFromJSON(initialContent);
    const initialObjects = initialScene.toJSON();
    sceneRef.current = initialScene;
    setObjects(initialObjects);
    initialObjectsRef.current = initialObjects;
  }, []);

  useEffect(
    () => {
      if (objects !== initialObjectsRef.current) {
        onContentChange(objects);
      }
    },
    [objects]
  );

  const scene = sceneRef.current || new Scene();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedObjects = useMemo(
    () =>
      selectedIds
        .map(id => findObject(objects, object => object.id === id)!)
        .filter(o => o),
    [objects, selectedIds]
  );

  const [
    activeOperation,
    setActiveOperation
  ] = useState<IHelperDescription | null>(null);

  const onCreateObject = useCallback(
    (object: IObjectsCommonJSON) => {
      const newObjects = scene.addNewObjectFromJSON(
        update(object, {
          viewOptions: {
            color: { $set: getRandomColor() },
            name: {
              $set: createObjectName(
                object.viewOptions.name || object.type,
                objects
              )
            }
          }
        })
      );
      setObjects(newObjects);
      setSelectedIds([newObjects[newObjects.length - 1].id]);
    },
    [scene]
  );

  const onDeleteObject = (object: IObjectsCommonJSON) => {
    setObjects(scene.removeObject(object));
  };

  const onUndoObject = (object: IObjectsCommonJSON) => {
    setObjects(scene.undoObject(object));
  };

  const onConvertToGroup = (object: IObjectsCommonJSON) => {
    setObjects(scene.convertToGroup(object));
  };

  const onDuplicateObject = (object: IObjectsCommonJSON) => {
    setObjects(
      scene.cloneOject(
        update(object, {
          viewOptions: {
            name: {
              $set: createObjectName(
                object.viewOptions.name || object.type,
                objects
              )
            }
          }
        })
      )
    );
  };

  const onSetActiveOperation = (helper: IHelperDescription) => {
    setActiveOperation(helper);
  };

  const onUnsetActiveOperation = () => {
    setActiveOperation(null);
  };

  const [advancedMode, setAdvancedMode] = useState(documentAdvancedMode);
  const previousAdvancedMode = useRef<boolean>(advancedMode);

  useEffect(
    () => {
      if (advancedMode && !previousAdvancedMode.current) {
        // Convert operations to advance mode
        objects.forEach(object => () => {
          const operations: Operation[] = [];
          object.operations.forEach(operation => {
            if (isTranslateOperation(operation)) {
              if (operation.x !== 0 || operation.y !== 0 || operation.z !== 0) {
                operations.push(operation);
              }
            }
            if (isRotationOperation(operation)) {
              if (operation.x !== 0) {
                operations.push(
                  Object3D.createRotateOperation(operation.x, 0, 0)
                );
              }
              if (operation.y !== 0) {
                operations.push(
                  Object3D.createRotateOperation(0, operation.y, 0)
                );
              }
              if (operation.z !== 0) {
                operations.push(
                  Object3D.createRotateOperation(0, 0, operation.z)
                );
              }
            }
            if (isScaleOperation(operation)) {
              if (operation.x !== 1 || operation.y !== 1 || operation.z !== 1) {
                operations.push(operation);
              }
            }
          });
          setObjects(scene.updateObject({ ...object, operations }));
        });
      }

      if (!advancedMode && previousAdvancedMode.current) {
        // Convert operations to basic mode
        objects.forEach(object => () => {
          const { position, angle, scale } = scene.getLocalPosition(object);
          setObjects(
            scene.updateObject({
              ...object,
              operations: [
                Object3D.createTranslateOperation(
                  position.x,
                  position.y,
                  position.z
                ),
                Object3D.createRotateOperation(angle.x, angle.y, angle.z),
                Object3D.createScaleOperation(scale.x, scale.y, scale.z)
              ]
            })
          );
        });
      }
    },
    [advancedMode]
  );

  // Keyboard handling
  const [controlPressed, setControlPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  const onUndo = useCallback(
    () => {
      setObjects(scene.undo());
    },
    [scene]
  );

  const onRedo = useCallback(
    () => {
      setObjects(scene.redo());
    },
    [scene]
  );

  useEffect(
    () => {
      let control = false;
      let shift = false;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Control") {
          control = true;
          setControlPressed(true);
        }
        if (e.key === "Shift") {
          shift = true;
          setShiftPressed(true);
        }
        if (e.key === "z" && control) {
          if (scene.canUndo()) {
            setObjects(scene.undo());
          }
        }
        if (e.key === "Z" && control) {
          if (scene.canRedo()) {
            setObjects(scene.redo());
          }
        }
      };

      const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Control") {
          setControlPressed(false);
        }
        if (e.key === "Shift") {
          setShiftPressed(false);
        }
      };

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    },
    [scene]
  );

  const onSelectObject = (object: IObjectsCommonJSON) => {
    if (controlPressed || shiftPressed) {
      setSelectedIds([...selectedIds, object.id]);
    } else {
      setSelectedIds([]);
    }
  };

  const onObjectClick = (object: IObjectsCommonJSON) => {
    const isTop = objects.includes(object);
    const isSelectedTop = objects.some(o => selectedIds.includes(o.id));
    const isSelected = selectedIds.includes(object.id);

    if (isTop && isSelectedTop && (controlPressed || shiftPressed)) {
      if (isSelected) {
        setSelectedIds(selectedIds.filter(id => id !== object.id));
      } else {
        setSelectedIds([...selectedIds, object.id]);
      }
    } else {
      if (isSelected && selectedIds.length === 1) {
        setSelectedIds(selectedIds.filter(id => id !== object.id));
      } else {
        setSelectedIds([object.id]);
      }
    }
  };

  const onUpdateObject = useCallback(
    (object: IObjectsCommonJSON) => {
      setObjects(scene.updateObject(object));
    },
    [scene]
  );

  const onBackgroundClick = () => {
    setSelectedIds([]);
  };

  useEffect(
    () => {
      if (threeDRef) {
        threeDRef.current = {
          createObject: (type, parameters, name) => {
            const object = {
              type,
              parameters,
              operations: config.defaultOperations(advancedMode),
              viewOptions: {
                name,
                color:
                  config.colors[
                    Math.floor(Math.random() * config.colors.length)
                  ]
              }
            };
          },
          exportToSTL: (name, separate) => {
            const nameToPass = name === "" ? "scene" : name;
            scene.exportToSTLAsync(nameToPass, separate);
          }
        };
      }
    },
    [threeDRef]
  );

  const t = useTranslate();

  const baseMenuOptions = getBaseMenuOptions(advancedMode, t);

  const menuOptionClick = (option: MainMenuOption) => {
    switch (option.id) {
      case "basic-mode":
        setAdvancedMode(false);
        return;

      case "advanced-mode":
        setAdvancedMode(true);
        return;

      default:
        if (onMenuOptionClick) {
          onMenuOptionClick(option);
        }
        return;
    }
  };

  const menuRightContent = (
    <AdvanceModeWrap>
      <span>{t("menu-basic-mode")}</span>
      <Switch
        value={advancedMode}
        onChange={value => {
          setAdvancedMode(value);
          if (changeAdvancedMode) {
            changeAdvancedMode(value);
          }
        }}
        leftRight={true}
      />
      <span>{t("menu-advanced-mode")}</span>
    </AdvanceModeWrap>
  );

  const baseShapeGroups = config.addShapeGroups;
  const shapeGroups = useMemo(
    () => (addShapeGroups ? addShapeGroups(baseShapeGroups) : baseShapeGroups),
    [addShapeGroups]
  );

  const mainTabs = [
    <Document.Tab key="3d" icon={<Icon name="threed" />} label={t("tab-3d")}>
      <Container>
        <ObjectTree
          objects={objects}
          selectedObjects={selectedObjects}
          advancedMode={advancedMode}
          shapeGroups={shapeGroups}
          onCreateObject={onCreateObject}
          onUpdateObject={onUpdateObject}
          onDeleteObject={onDeleteObject}
          onObjectClick={onObjectClick}
        />
        <MainArea>
          <Toolbar
            objects={objects}
            selectedObjects={selectedObjects}
            advancedMode={advancedMode}
            onCreateObject={onCreateObject}
            canUndo={scene.canUndo()}
            canRedo={scene.canRedo()}
            onUndo={onUndo}
            onRedo={onRedo}
          />
          <ThreeDViewer
            activeOperation={activeOperation}
            sceneObjects={objects}
            scene={scene}
            selectedObjects={selectedObjects}
            onObjectClick={onObjectClick}
            onBackgroundClick={onBackgroundClick}
          />
        </MainArea>
        {selectedObjects[0] && (
          <PropertiesPanel
            advancedMode={advancedMode}
            object={selectedObjects[0]}
            isTopObject={
              selectedObjects[0] && objects.includes(selectedObjects[0])
            }
            onUpdateObject={onUpdateObject}
            onDeleteObject={onDeleteObject}
            onUndoObject={onUndoObject}
            onConvertToGroup={onConvertToGroup}
            onDuplicateObject={onDuplicateObject}
            onSetActiveOperation={onSetActiveOperation}
            onUnsetActiveOperation={onUnsetActiveOperation}
          />
        )}
      </Container>
    </Document.Tab>
  ];

  return (
    <Document
      brandColor={brandColor}
      title={title || t("untitled-project")}
      icon={<Icon name="logo-3d" />}
      tabIndex={tabIndex}
      onTabChange={onTabChange}
      onEditTitle={onEditTitle}
      headerButtons={headerButtons}
      onHeaderButtonClick={onHeaderButtonClick}
      headerRightContent={headerRightContent}
      menuOptions={menuOptions ? menuOptions(baseMenuOptions) : baseMenuOptions}
      onMenuOptionClick={menuOptionClick}
      menuRightContent={menuRightContent}
      preMenuContent={preMenuContent}
      postMenuContent={postMenuContent}
      backCallback={backCallback}
    >
      {typeof children === "function" ? children(mainTabs) : mainTabs}
    </Document>
  );
};

export default React.memo(ThreeD);

const getBaseMenuOptions = (advancedMode: boolean, t: TranslateFn) => [
  {
    id: "view",
    label: t("menu-view"),
    children: [
      {
        id: "mode",
        label: t("menu-mode"),
        icon: <Icon name="difficulty" />,
        children: [
          {
            id: "basic-mode",
            label: t("menu-basic"),
            checked: !advancedMode
          },
          {
            id: "advanced-mode",
            label: t("menu-advanced"),
            checked: advancedMode
          }
        ]
      },
      {
        id: "change-theme",
        label: t("menu-change-theme"),
        icon: <Icon name="brush" />,
        children: [
          {
            id: "color-theme",
            label: t("menu-color")
          },
          {
            id: "gray-theme",
            label: t("menu-gray")
          }
        ]
      }
    ]
  }
];

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AdvanceModeWrap = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  span {
    font-size: 14px;
    margin: 0px 10px;
  }
`;
