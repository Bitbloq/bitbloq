import React, { FC, useRef, useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  Checkbox,
  ColorPicker,
  NumberInput,
  Input,
  Select,
  Translate,
  Tooltip,
  useTranslate
} from "@bitbloq/ui";
import { STLLoader } from "@bitbloq/lib3d";
import { IObjectParameter, IOperationParameter, ISelectOption } from "../types";

import warningIcon from "../assets/images/warning.svg";
import errorSound from "../assets/sounds/error.mp3";

export interface IPropertyInputProps {
  parameter: IObjectParameter | IOperationParameter;
  value: any;
  onChange: (value: any) => any;
  onFocus?: () => any;
  onBlur?: () => any;
}

const PropertyInput: FC<IPropertyInputProps> = ({
  parameter,
  value,
  onChange,
  onFocus,
  onBlur
}) => {
  const t = useTranslate();
  const [errorValue, setErrorValue] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const timeout = useRef<number | null>(null);

  const onInputChange = useCallback(
    (newValue: any, textValue: any) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }

      if (parameter.type === "integer") {
        if (parameter.minValue && newValue < parameter.minValue) {
          setError(true);
          setErrorValue(textValue || newValue);
          setErrorMessage(
            t("tooltip-error-min-value", [
              `${parameter.minValue || ""}`,
              parameter.unit ? t(parameter.unit) : ""
            ])
          );
          timeout.current = window.setTimeout(() => {
            setError(false);
          }, 3000);
        } else {
          setError(false);
          onChange(newValue);
        }
      } else {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const onInputBlur = useCallback(
    () => {
      setError(false);
      if (onBlur) {
        onBlur();
      }
    },
    [onBlur]
  );

  const commonProps = {
    value: error ? errorValue : value,
    label: parameter.label,
    onChange: onInputChange,
    onBlur: onInputBlur,
    onFocus
  };

  const inputComponent = inputComponents[parameter.type!];
  if (!inputComponent) {
    return null;
  }
  const input = inputComponent(commonProps, parameter);

  return (
    <Tooltip
      isVisible={error}
      position="left"
      content={
        <TooltipText>
          <audio src={errorSound} autoPlay={true} />
          <img src={warningIcon} /> {errorMessage}
        </TooltipText>
      }
    >
      {tooltipProps => <div {...tooltipProps}>{input}</div>}
    </Tooltip>
  );
};

export default PropertyInput;

interface ICommonProps {
  value?: any;
  label?: string;
  onChange: (newValue: any, textValue?: string) => any;
  onBlur?: () => any;
  onFocus?: () => any;
}

interface IIntegerPropertyProps extends ICommonProps {
  unit?: string;
  fineStep?: number;
  minValue?: number;
  maxValue?: number;
}

const IntegerProperty: FC<IIntegerPropertyProps> = ({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  unit,
  fineStep,
  minValue,
  maxValue
}) => (
  <FormGroup>
    <Translate>{t => label && <label>{t(label)}</label>}</Translate>
    <NumberInput
      value={value}
      unit={unit}
      onChange={(newValue: string, text: string) => onChange(newValue, text)}
      onFocus={onFocus}
      onBlur={onBlur}
      fineStep={fineStep}
      minValue={minValue}
      maxValue={maxValue}
    />
  </FormGroup>
);

const StringProperty: FC<ICommonProps> = ({ label, value, onChange }) => (
  <FormGroup>
    <Translate>{t => label && <label>{t(label)}</label>}</Translate>
    <Input value={value} onChange={e => onChange(e.target.value)} />
  </FormGroup>
);

interface ISelectPropertyProps extends ICommonProps {
  options?: ISelectOption[];
}
const SelectProperty: FC<ISelectPropertyProps> = ({
  label,
  options = [],
  value,
  onChange,
  onFocus,
  onBlur
}) => (
  <Translate>
    {t => (
      <FormGroup>
        {label && <label>{t(label)}</label>}
        <StyledSelect
          value={value}
          options={options.map(o => ({
            ...o,
            label: o.labelId ? t(o.labelId) : o.label
          }))}
          selectConfig={{ isSearchable: false }}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </FormGroup>
    )}
  </Translate>
);

const BooleanProperty: FC<ICommonProps> = ({ label, value, onChange }) => (
  <FormGroup>
    <Translate>{t => label && <label>{t(label)}</label>}</Translate>
    <Checkbox checked={value} onChange={onChange} />
  </FormGroup>
);

const ColorProperty: FC<ICommonProps> = React.memo(
  ({ label, value, onChange }) => (
    <FormGroup>
      <Translate>{t => label && <label>{t(label)}</label>}</Translate>
      <ColorPickerWrap>
        <ColorPicker color={value} onChange={onChange} position="top-right" />
      </ColorPickerWrap>
    </FormGroup>
  )
);

interface IInputComponents {
  [key: string]: (
    commonProps: ICommonProps,
    parameter: IOperationParameter | IObjectParameter
  ) => JSX.Element;
}

const inputComponents: IInputComponents = {
  integer: (commonProps, { fineStep, minValue, maxValue }) => (
    <IntegerProperty
      {...commonProps}
      fineStep={fineStep}
      minValue={minValue}
      maxValue={maxValue}
    />
  ),
  string: commonProps => <StringProperty {...commonProps} />,
  select: (commonProps, { options }) => (
    <SelectProperty {...commonProps} options={options} />
  ),
  boolean: commonProps => <BooleanProperty {...commonProps} />,
  color: commonProps => <ColorProperty {...commonProps} />
};

/* styled components */

const FormGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  label {
    display: block;
    width: 120px;
  }

  input {
    flex: 1;
  }
`;

const ColorPickerWrap = styled.div`
  flex: 1;
`;

const StyledSelect = styled(Select)`
  flex: 1;
`;

const TooltipText = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  padding: 0;

  img {
    margin-right: 5px;
  }
`;
