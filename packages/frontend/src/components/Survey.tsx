import * as React from "react";
import styled from "@emotion/styled";
import { Option, Checkbox, Input, TextArea } from "@bitbloq/ui";

export enum QuestionType {
  SingleOption = "singleOption",
  MultipleOption = "multipleOption",
  Text = "text"
}

type SingleValue = any;

interface MultipleValue {
  selected: SingleValue[];
  hasOther?: boolean;
  otherValue?: SingleValue;
}

type Value = SingleValue | MultipleValue;

export interface QuestionOption {
  label: string;
  value: any;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options?: QuestionOption[];
  allowOther?: boolean;
  otherLabel?: string;
  otherPlaceholder?: string;
  placeholder?: string;
}

type OnChangeCallback = (values: any) => void;

interface Values {
  [key: string]: Value;
}

export interface SurveyProps {
  questions: Question[];
  values: Values;
  onChange: OnChangeCallback;
}

class Survey extends React.Component<SurveyProps> {
  renderSingleOption(question) {
    const { values, onChange } = this.props;
    const { id, title, options = [] } = question;

    const value = values[id] as SingleValue;

    return (
      <Question key={id}>
        <Title>{question.title}</Title>
        {options.map(option => (
          <OptionWrap
            key={option.value}
            onClick={() => onChange({ ...values, [id]: option.value })}
          >
            <Option checked={option.value === value} />
            <span>{option.label}</span>
          </OptionWrap>
        ))}
      </Question>
    );
  }

  renderMultipleOption(question) {
    const { values, onChange } = this.props;
    const {
      id,
      title,
      options = [],
      allowOther,
      otherLabel = "",
      otherPlaceholder = ""
    } = question;

    const value = (values[id] || {}) as MultipleValue;
    const { selected = [], hasOther, otherValue = "" } = value;

    return (
      <Question key={id}>
        <Title>{question.title}</Title>
        {options.map(option => {
          const isSelected = selected.indexOf(option.value) > -1;

          return (
            <OptionWrap
              key={option.value}
              onClick={() => {
                if (isSelected) {
                  onChange({
                    ...values,
                    [id]: {
                      ...value,
                      selected: selected.filter(v => v !== option.value)
                    }
                  });
                } else {
                  onChange({
                    ...values,
                    [id]: { ...value, selected: [...selected, option.value] }
                  });
                }
              }}
            >
              <Checkbox checked={isSelected} />
              <span>{option.label}</span>
            </OptionWrap>
          );
        })}
        {allowOther && (
          <>
            <OptionWrap
              onClick={() =>
                onChange({
                  ...values,
                  [id]: { ...value, hasOther: !hasOther, otherValue: "" }
                })
              }
            >
              <Checkbox checked={hasOther} />
              <span>{otherLabel}</span>
            </OptionWrap>
            <Input
              placeholder={otherPlaceholder}
              value={otherValue}
              onChange={e =>
                onChange({
                  ...values,
                  [id]: { ...value, otherValue: e.target.value }
                })
              }
              disabled={!hasOther}
            />
          </>
        )}
      </Question>
    );
  }

  renderText(question) {
    const { values, onChange } = this.props;
    const { id, title, placeholder } = question;

    const value = values[id] as SingleValue;

    return (
      <Question key={id}>
        <Title>{question.title}</Title>
        <TextArea
          value={value}
          onChange={e => onChange({ ...values, [id]: e.target.value })}
          rows={3}
          placeholder={placeholder}
        />
      </Question>
    );
  }

  render() {
    const { questions } = this.props;

    return questions.map(question => {
      switch (question.type) {
        case QuestionType.SingleOption:
          return this.renderSingleOption(question);
        case QuestionType.MultipleOption:
          return this.renderMultipleOption(question);
        case QuestionType.Text:
          return this.renderText(question);
      }
    });
  }
}

export default Survey;

/* styled components */

const Question = styled.div`
  margin-bottom: 28px;
`;

const Title = styled.div`
  margin-bottom: 14px;
`;

const OptionWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
`;
