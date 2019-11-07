/*
 * File: index.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import HorizontalBloqEditor from "./horizontal/HorizontalBloqEditor";
import HardwareDesigner from "./hardware/HardwareDesigner";
import bloqs2code from "./bloqs2code/bloqs2code";
import { getBoardDefinition } from "./bloqs2code/board2code";
import { getComponentDefinition } from "./bloqs2code/componentBuilder";
import Web2Board from "./web2board";
import { BloqCategory, BloqParameterType } from "./enums";

export {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  getComponentDefinition,
  BloqCategory,
  BloqParameterType,
  Web2Board
};

export interface IBloqBaseParameter {
  name: string;
  label: string;
  type: BloqParameterType;
  value?: string;
  defaultValue?: string | number | boolean;
}

export interface IBloqParameterOption {
  value: string | number | boolean;
  label: string;
}

export interface IBloqSelectParameter extends IBloqBaseParameter {
  options: IBloqParameterOption[];
}

export interface IBloqSelectComponentParameter extends IBloqBaseParameter {
  componentType: string;
}

export type IBloqParameter =
  | IBloqBaseParameter
  | IBloqSelectParameter
  | IBloqSelectComponentParameter;

export function isBloqSelectParameter(
  parameter: IBloqParameter
): parameter is IBloqSelectParameter {
  return parameter.type === BloqParameterType.Select;
}

export function isBloqSelectComponentParameter(
  parameter: IBloqParameter
): parameter is IBloqSelectComponentParameter {
  return parameter.type === BloqParameterType.SelectComponent;
}

export interface IIconSwitch {
  [key: string]: string;
}

export interface IBloqType {
  category: BloqCategory;
  name: string;
  label?: string;
  icon?: string;
  iconSwitch?: IIconSwitch;
  iconComponent?: string;
  code: IArduinoCode;
  parameters?: IBloqParameter[];
  components?: string[];
  configurationComponent?: string;
  actions: IBloqAction[];
}

export interface IBloq {
  type: string;
  parameters: { [name: string]: string | number };
}

export interface IBloqTypeGroup {
  types: string[];
  category?: BloqCategory;
  icon?: string;
}

export interface IShapeProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export type ConnectorType = string;

export interface IArduinoCode {
  includes?: string[];
  globals?: string[];
  setup?: string[];
  loop?: string[];
  endloop?: string[];
  definitions?: string[];
}

export interface IPortPin {
  name: string;
  value: string;
}

export interface IConnectorPosition {
  x: number;
  y: number;
}

export enum IPortDirection {
  North = "north",
  South = "south",
  East = "east",
  West = "west"
}

export interface IPort {
  name: string;
  position: IConnectorPosition;
  connectorTypes: string[];
  pins: IPortPin[];
  placeholderPosition: IConnectorPosition;
  direction: IPortDirection;
  schematicPosition: IConnectorPosition;
  schematicPlaceholderPosition: IConnectorPosition;
}

export interface IComponentImage {
  url: string;
  width: number;
  height: number;
}

export interface IIntegratedComponent {
  component: string;
  name: string;
  pins: { [name: string]: string };
}

export interface IBoard {
  name: string;
  integrated: IIntegratedComponent[];
  code: IArduinoCode;
  image: IComponentImage;
  ports: IPort[];
  schematicCenter: IConnectorPosition;
}

export enum ConnectorPinMode {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  I2C = "I2C"
}

export interface IConnectorPin {
  name: string;
  mode: ConnectorPinMode;
  portPin?: string;
}

export interface IConnector {
  name: string;
  type: string;
  position: IConnectorPosition;
  pins: IConnectorPin[];
}

export interface IComponentAction {
  name: string;
  parameters: string[];
  code: string;
  return?: string;
}

export interface IBloqAction {
  name: string;
  parameters: { [name: string]: string };
}

export interface IComponent {
  name: string;
  label?: string;
  instanceName: string;
  extends: string;
  code: IArduinoCode;
  actions: IComponentAction[];
  connectors: IConnector[];
  image: IComponentImage;
  // onValue?: string;
  // offValue?: string;
  values: { [name: string]: string };
}

export interface IComponentInstance {
  component: string;
  name: string;
  port?: string;
  integrated?: boolean;
}

export interface IHardware {
  board: string;
  components: IComponentInstance[];
}
