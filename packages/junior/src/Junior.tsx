import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Document, Icon, useTranslate, IHeaderButton } from "@bitbloq/ui";
import {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  Web2Board,
  IBloq,
  IBloqType,
  IBloqTypeGroup,
  IBoard,
  getComponentDefinition,
  IComponent,
  IHardware,
  BloqCategory,
  isBloqSelectComponentParameter
} from "@bitbloq/bloqs";
import UploadSpinner from "./UploadSpinner";

export interface JuniorProps {
  brandColor: string;
  title: string;
  onEditTitle: () => any;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  bloqTypes: IBloqType[];
  initialContent?: any;
  onContentChange: (content: any) => any;
  boards: IBoard[];
  components: IComponent[];
  backCallback: () => any;
  headerButtons?: IHeaderButton[];
  headerRightContent: React.ReactChildren;
  onHeaderButtonClick?: (id: string) => any;
}

const Junior: React.FunctionComponent<JuniorProps> = ({
  children,
  brandColor,
  title,
  onEditTitle,
  tabIndex,
  onTabChange,
  bloqTypes,
  initialContent,
  onContentChange,
  boards,
  components,
  backCallback,
  headerButtons,
  headerRightContent,
  onHeaderButtonClick
}) => {
  const t = useTranslate();

  const [content, setContent] = useState(initialContent);
  const program = content.program || [];
  const hardware: IHardware = content.hardware || {
    board: "zumjunior",
    components: []
  };

  useEffect(() => {
    if (content !== initialContent) {
      onContentChange(content);
    }
  }, [content]);

  const [uploadSpinnerVisible, setUploadSpinnerVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingSuccess, setUploadingSuccess] = useState(false);

  const hideTimeout = useRef(0);
  useEffect(() => {
    if (uploading) {
      setUploadSpinnerVisible(true);
    }

    if (!uploading) {
      hideTimeout.current = window.setTimeout(() => {
        setUploadSpinnerVisible(false);
      }, 5000);
    }
  }, [uploading]);

  useEffect(() => {
    if (!uploadSpinnerVisible && hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = 0;
    }
  }, [uploadSpinnerVisible]);

  const board: IBoard = getBoardDefinition(boards, hardware);
  if (hardware.components.length === 0) {
    // Add board integrated components to hardware list
    if (board && board.integrated) {
      board.integrated.forEach(integratedComponent =>
        hardware.components.push({ ...integratedComponent, integrated: true })
      );
    }
  }

  const web2BoardRef = useRef<Web2Board>();
  useEffect(() => {
    web2BoardRef.current = new Web2Board("wss://web2board.es:9867/bitbloq");
  }, []);

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

  const upload = async (timeout: number): Promise<void> => {
    setUploading(true);
    const web2Board = web2BoardRef.current;
    const code = bloqs2code(boards, components, bloqTypes, hardware, program);

    if (!web2Board) {
      return;
    }

    if (!web2Board.isConnected()) {
      try {
        await web2Board.waitUntilOpened();
      } catch (e) {
        console.warn(e);
        setUploading(false);
        setUploadingSuccess(false);
      }
    }

    if (web2Board.isConnected()) {
      // if not loaded in tiemout ms exit
      setTimeout(() => {
        if (uploading) {
          setUploading(false);
          setUploadingSuccess(false);
          console.error("Uploading Timeout");
        }
      }, timeout);

      try {
        const uploadGen = web2Board.upload(code, "zumjunior");

        while (true) {
          const { value: reply, done } = await uploadGen.next();
          const fn = reply.function;

          if (done) {
            setUploading(false);
            setUploadingSuccess(true);
            return;
          }
        }
      } catch (e) {
        setUploading(false);
        setUploadingSuccess(false);
        return;
      }
    } else {
      console.warn("Web2Board not connected");
    }
  };

  const mainTabs = [
    <Document.Tab
      key="hardware"
      icon={<Icon name="hardware" />}
      label={t("junior.hardware")}
    >
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        onHardwareChange={newHardware =>
          setContent({ hardware: newHardware, program })
        }
      />
    </Document.Tab>,
    <Document.Tab
      key="software"
      icon={<Icon name="programming" />}
      label={t("junior.software")}
    >
      <HorizontalBloqEditor
        bloqs={program}
        components={components}
        getComponents={getComponents}
        getBloqPort={getBloqPort}
        bloqTypes={bloqTypes}
        availableBloqs={availableBloqs}
        onBloqsChange={(newProgram: IBloq[][]) =>
          setContent({ program: newProgram, hardware })
        }
        onUpload={() => upload(10000)}
        board={board}
      />
    </Document.Tab>
  ];

  return (
    <>
      <Document
        icon={<Icon name="logo-junior" />}
        brandColor={brandColor}
        title={title || t("untitled-project")}
        onEditTitle={onEditTitle}
        tabIndex={tabIndex}
        onTabChange={onTabChange}
        backCallback={backCallback}
        headerRightContent={headerRightContent}
        headerButtons={headerButtons}
        onHeaderButtonClick={onHeaderButtonClick}
      >
        {typeof children === "function" ? children(mainTabs) : mainTabs}
      </Document>
      {uploadSpinnerVisible && (
        <UploadSpinner
          uploading={uploading}
          success={uploadingSuccess}
          onClick={() => !uploading && setUploadSpinnerVisible(false)}
        />
      )}
    </>
  );
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
