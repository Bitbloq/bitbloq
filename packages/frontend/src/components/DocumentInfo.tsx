import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors, Button } from "@bitbloq/ui";

import { Document } from "../types";

interface DocumentInfoProps {
  document: Document;
  onGotoDocument: () => any;
}

const DocumentInfo: FC<DocumentInfoProps> = ({ document, onGotoDocument }) => {
  const { title, description, image } = document;

  return (
    <Container>
      <Left>
        <LeftContent>
          <h2>{title}</h2>
          <Image src={image.image ? image.image : (image as string)} />
        </LeftContent>
      </Left>
      <Right>
        <Description>
          <p>{description}</p>
        </Description>
        <GotoDocument>
          <Button onClick={onGotoDocument}>Ir al ejemplo</Button>
        </GotoDocument>
      </Right>
    </Container>
  );
};

export default DocumentInfo;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Left = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  justify-content: center;
`;

const LeftContent = styled.div`
  max-width: 730px;
  flex: 1;
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

interface ImageProps {
  src: string;
}
const Image = styled.div<ImageProps>`
  background-color: ${colors.gray2};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-right: 30px;
  width: 100%;
  flex: 1;
  border-radius: 4px;

  &::after {
    content: "";
    display: block;
    padding-bottom: 60%;
  }
`;

const Right = styled.div`
  width: 400px;
  border-left: 1px solid ${colors.gray3};
  display: flex;
  flex-direction: column;
`;

const Description = styled.div`
  padding: 30px;
  flex: 1;
  p {
    line-height: 1.57;
  }
`;

const GotoDocument = styled.div`
  padding: 40px 30px;
  border-top: 1px solid ${colors.gray3};
  ${Button} {
    width: 100%;
  }
`;
