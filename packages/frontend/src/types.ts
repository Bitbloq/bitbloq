import { IHeaderButton } from "@bitbloq/ui";

export interface EditorProps {
  content: any;
  onContentChange: (content: any) => any;
  tabIndex: number;
  onTabChange: (index: number) => any;
  getTabs: (mainTabs: any) => any;
  title: string;
  onEditTitle?: () => any;
  onSaveDocument?: () => any;
  brandColor: string;
  headerButtons?: IHeaderButton[];
  onHeaderButtonClick?: (id: string) => any;
  isPlayground?: boolean;
  headerRightContent?: React.ReactChild;
  preMenuContent?: React.ReactChild;
  changeAdvancedMode?: (mode: boolean) => any;
  documentAdvancedMode?: boolean;
  backCallback?: () => any;
  t?: (id: string) => string;
}

export interface Document {
  title: string;
  description: string;
  image: any;
}
