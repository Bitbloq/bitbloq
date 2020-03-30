import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useTranslate } from "@bitbloq/ui";
import {
  useCodeUpload,
  ICodeUploadOptions
} from "@bitbloq/code/src/useCodeUpload";
import { bloqTypes as partialBloqTypes } from "./bloqTypes";
import { boards as partialBoards } from "./boards";
import { components as partialComponents } from "./components";
import { juniorLibraries } from "./config";
import {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  IBloq,
  IBloqLine,
  IBloqType,
  IBoard,
  IComponent,
  IHardware,
  isBloqSelectComponentParameter
} from "@bitbloq/bloqs";

export interface IJuniorCallbackProps {
  hardware: JSX.Element;
  software: (isActive: boolean) => JSX.Element | null;
  upload: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface IJuniorProps {
  initialContent?: any;
  onContentChange: (content: any) => any;
  children: (props: IJuniorCallbackProps) => JSX.Element;
  uploadOptions: ICodeUploadOptions;
  externalUpload?: boolean;
}

const bloqTypes = partialBloqTypes as IBloqType[];
const boards = partialBoards as IBoard[];
const components = partialComponents as IComponent[];

const Junior: React.FunctionComponent<IJuniorProps> = ({
  children,
  initialContent,
  onContentChange,
  uploadOptions,
  externalUpload
}) => {
  const t = useTranslate();

  const [upload, _, uploadContent] = useCodeUpload(uploadOptions);

  const [content, setContent] = useState(initialContent);
  const program: IBloqLine[] = content.program || [];
  const hardware: IHardware = content.hardware || {
    board: "zumjunior",
    components: []
  };

  const [undoPast, setUndoPast] = useState<any[]>([]);
  const [undoFuture, setUndoFuture] = useState<any[]>([]);

  const updateContent = (newContent: any) => {
    setUndoPast([newContent, ...undoPast]);
    setUndoFuture([]);
    setContent(newContent);
  };

  const undo = () => {
    setUndoPast(undoPast.slice(1));
    setUndoFuture([content, ...undoFuture]);
    setContent(undoPast[0]);
  };

  const redo = () => {
    setUndoPast([content, ...undoPast]);
    setUndoFuture(undoFuture.slice(1));
    setContent(undoFuture[0]);
  };

  useEffect(() => {
    if (content !== initialContent) {
      onContentChange(content);
    }
  }, [content]);

  const board: IBoard = getBoardDefinition(boards, hardware);
  if (hardware.components.length === 0) {
    // Add board integrated components to hardware list
    if (board && board.integrated) {
      board.integrated.forEach(integratedComponent =>
        hardware.components.push({ ...integratedComponent, integrated: true })
      );
    }
  }

  if (!board.integrated) {
    board.integrated = [];
  }

  const componentMapRef = useRef<{ [key: string]: IComponent }>(
    [...components, ...board.integrated].reduce((map, c) => {
      map[c.name] = c;
      return map;
    }, {})
  );
  const componentMap = componentMapRef.current;

  const getComponents = (types: string[]) =>
    hardware.components.filter(c =>
      types.some(name =>
        isInstanceOf(componentMap[c.component], name, componentMap)
      )
    );

  const getBloqPort = (bloq: IBloq): string | undefined => {
    if (!bloq) {
      return;
    }

    const bloqType = bloqTypes.find(type => type.name === bloq.type);

    if (bloqType) {
      const componentParameter =
        bloqType.parameters &&
        bloqType.parameters.find(isBloqSelectComponentParameter);
      const componentName =
        componentParameter && bloq.parameters[componentParameter.name];

      if (!componentName) {
        return;
      }

      const component = hardware.components.find(c => c.name === componentName);

      return component ? component.port : "?";
    }

    return;
  };

  const availableBloqs = bloqTypes.filter(
    bloq =>
      !bloq.components ||
      bloq.components.some(bloqComponent =>
        hardware.components.some(c =>
          isInstanceOf(componentMap[c.component], bloqComponent, componentMap)
        )
      )
  );

  const onUpload = () => {
    const programBloqs = program
      .filter(line => !line.disabled)
      .map(line => line.bloqs);

    const code = bloqs2code(
      boards,
      components,
      bloqTypes,
      hardware,
      programBloqs
    );
    try {
      upload(
        [{ name: "main.ino", content: code }],
        juniorLibraries,
        "zumjunior"
      );
    } catch (e) {
      console.error(e.data);
    }
  };

  return children({
    hardware: (
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        onHardwareChange={newHardware =>
          updateContent({ hardware: newHardware, program })
        }
      />
    ),
    software: (isActive: boolean) =>
      isActive ? (
        <>
          <HorizontalBloqEditor
            lines={program}
            components={components}
            getComponents={getComponents}
            getBloqPort={getBloqPort}
            bloqTypes={bloqTypes}
            availableBloqs={availableBloqs}
            onLinesChange={(newProgram: IBloqLine[]) =>
              updateContent({ program: newProgram, hardware })
            }
            onUpload={onUpload}
            board={board}
            externalUpload={externalUpload}
          />
          {!externalUpload && uploadContent}
        </>
      ) : null,
    upload: onUpload,
    undo,
    redo,
    canUndo: undoPast.length > 0,
    canRedo: undoFuture.length > 0
  });
};

export const isInstanceOf = (
  component: IComponent,
  name: string,
  componentsMap: { [key: string]: IComponent }
): boolean => {
  if (component.name === name) {
    return true;
  }

  if (component.extends) {
    const parentComponent = componentsMap[component.extends];
    if (parentComponent) {
      return isInstanceOf(parentComponent, name, componentsMap);
    }
  }

  return false;
};

export default Junior;
