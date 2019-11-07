import React from "react";
import { Junior } from "@bitbloq/junior";
import { bloqTypes, boards, components } from "../config";
import { EditorProps } from "../types";

const JuniorEditor: React.FunctionComponent<EditorProps> = ({
  content,
  onContentChange,
  brandColor,
  tabIndex,
  onTabChange,
  getTabs,
  title,
  onEditTitle,
  headerRightContent,
  backCallback,
  headerButtons,
  onHeaderButtonClick
}) => {
  return (
    <Junior
      brandColor={brandColor}
      tabIndex={tabIndex}
      onTabChange={onTabChange}
      title={title}
      onEditTitle={onEditTitle}
      bloqTypes={bloqTypes}
      initialContent={content || {}}
      onContentChange={onContentChange}
      boards={boards}
      components={components}
      backCallback={backCallback}
      headerRightContent={headerRightContent}
      headerButtons={headerButtons}
      onHeaderButtonClick={onHeaderButtonClick}
    >
      {getTabs}
    </Junior>
  );
};

export default JuniorEditor;
