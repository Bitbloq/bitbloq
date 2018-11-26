import React from 'react';
import styled, {css} from 'react-emotion';
import chroma from 'chroma-js';
import {TwitterPicker} from 'react-color';
import DropDown from './DropDown';

const Container = styled.div`
  display: inline-block;
`;

const SquareWrap = styled.div`
  padding: 6px;
  border: 1px solid #cfcfcf;
  border-radius: 2px;

  ${props => props.isOpen && css`
    border: 1px solid #5d6069;
  `};
`;

const Square = styled.div`
  width: 21px;
  height: 21px;
  border-radius: 2px;
  cursor: pointer;
  background-color: ${props => props.color};
`;

const PickerWrap = styled.div`
  margin-top: 7px;
  & > div {
    margin-left: 4px;
  }
`;

export default class ColorPicker extends React.Component {
  static defaultProps = {
    format: 'hex',
    color: '#fff',
  };

  onColorChange = color => {
    const {onChange, format} = this.props;
    if (onChange) {
      if (format === 'number') {
        onChange(chroma(color.hex).num());
      } else {
        onChange(color.hex);
      }
    }
  };

  render() {
    const {color, className, position} = this.props;
    const colorHex = chroma(color).hex();

    return (
      <Container className={className}>
        <DropDown closeOnClick={false}>
          {isOpen =>
            <SquareWrap isOpen={isOpen}>
              <Square color={colorHex} />
            </SquareWrap>
          }
          <PickerWrap>
            <TwitterPicker
              triangle={position}
              color={colorHex}
              onChangeComplete={this.onColorChange}
            />
          </PickerWrap>
        </DropDown>
      </Container>
    );
  }
}
