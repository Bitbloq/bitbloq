import { IHardware, IComponentInstance } from "@bitbloq/bloqs";

export enum BloqCategory {
  Component = "component",
  Functions = "functions",
  Variables = "variables",
  Code = "code",
  Math = "math",
  Text = "text",
  Control = "control",
  Logic = "logic"
}

export enum BloqSubCategory {
  Junior = "junior",
  Basic = "basic",
  Advanced = "advanced"
}

export enum InstructionType {
  Block = "block",
  Parameter = "parameter",
  Statement = "statement"
}

export interface IBloqUILabel {
  type: "label";
  text: string;
}

export interface IBloqUISelectOption {
  value: string | number;
  label: string;
}

export interface IBloqUISelect {
  type: "select";
  parameterName: string;
  options: IBloqUISelectOption[];
}

export interface IBloqUISelectComponent {
  type: "select-component";
  parameterName: string;
  componentTypes: string[];
}

export interface IBloqUIParameter {
  type: "parameter";
  parameterName: string;
}

export interface IBloqUITextInput {
  type: "text-input";
  parameterName: string;
  inputType?: string;
}

type IBloqUIElement =
  | IBloqUILabel
  | IBloqUISelect
  | IBloqUISelectComponent
  | IBloqUIParameter
  | IBloqUITextInput;

export interface IBloqCode {
  main?: string;
}

export interface IBloqDiagramOptions {
  symbolText?: string;
}

export interface IBloqType {
  name: string;
  instructionType: InstructionType;
  category: BloqCategory;
  subCategory: BloqSubCategory;
  uiElements: IBloqUIElement[];
  forComponents?: string[];
  code?: IBloqCode;
  diagram?: IBloqDiagramOptions;
}

export interface IBloq {
  type: string;
  children?: IBloq[];
  parameters?: Record<
    string,
    string | number | IBloq | IComponentInstance | undefined
  >;
}

export enum BloqSection {
  Global = "globals",
  Setup = "setup",
  Loop = "loop"
}

export type BloqState = Record<BloqSection, IBloq[]>;

export interface IRoboticsContent {
  hardware: Partial<IHardware>;
  bloqs: BloqState;
}

export interface IDiagramSymbol {
  type: "symbol";
  bloq: IBloq;
}

export interface IDiagramCondition {
  type: "condition";
  bloq: IBloq;
  leftItems: IDiagramItem[];
  rightItems: IDiagramItem[];
  feedback?: boolean;
}

export interface IDiagramSwitchCase {
  bloq: IBloq;
  items: IDiagramItem[];
}

export interface IDiagramSwitch {
  type: "switch";
  cases: IDiagramSwitchCase[];
  default: IDiagramSwitchCase;
}

export type IDiagramItem = IDiagramSymbol | IDiagramCondition | IDiagramSwitch;
