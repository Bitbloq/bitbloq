import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import SendMessage from "./images/SendMessage";

interface ISendMessageConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const SendMessageConfiguration: FC<ISendMessageConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ImageWrap>
        <SendMessage letter={value.split("message")[1]} />
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <Letter>A</Letter>, id: "messageA" },
          { content: <Letter>B</Letter>, id: "messageB" },
          { content: <Letter>C</Letter>, id: "messageC" },
          { content: <Letter>D</Letter>, id: "messageD" },
          { content: <Letter>E</Letter>, id: "messageE" },
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default SendMessageConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ImageWrap = styled.div`
  margin-right: 20px;
  svg {
    width: 200px;
    height: 200px;
  }
`;

const Letter = styled.div`
  font-size: 36px;
  font-weight: bold;
`;