import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Button, colors } from "@bitbloq/ui";

enum TabType {
  Description,
  Score
}

interface Exercise {
  title: string;
  description: string;
  image: string;
}

interface ExerciseInfoProps {
  exercise: Exercise;
  onGotoExercise: () => any;
}

const ExerciseInfo: React.FunctionComponent<ExerciseInfoProps> = ({
  exercise: { title, description, image },
  onGotoExercise
}) => {
  const [currentTab, setCurrentTab] = useState(TabType.Description);

  return (
    <Container>
      <Left>
        <LeftContent>
          <h2>{title}</h2>
          <Image src={image} />
        </LeftContent>
      </Left>
      <Right>
        <Tabs>
          <Tab
            selected={currentTab === TabType.Description}
            onClick={() => setCurrentTab(TabType.Description)}
          >
            Descripción
          </Tab>
          <Tab
            selected={currentTab === TabType.Score}
            onClick={() => setCurrentTab(TabType.Score)}
          >
            Calificación
          </Tab>
        </Tabs>
        {currentTab === TabType.Description && (
          <TabContent>
            <p>{description}</p>
          </TabContent>
        )}
        {currentTab === TabType.Score && <TabContent></TabContent>}
        <GotoExercise>
          <Button onClick={onGotoExercise}>Ir al ejercicio</Button>
        </GotoExercise>
      </Right>
    </Container>
  );
};

export default ExerciseInfo;

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

const Tabs = styled.div`
  display: flex;
`;

interface TabProps {
  selected?: boolean;
}
const Tab = styled.div<TabProps>`
  height: 60px;
  border-right: 1px solid ${colors.gray3};
  border-bottom: 1px solid ${colors.gray3};
  background-color: ${colors.gray2};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex: 1;
  cursor: pointer;

  ${props =>
    props.selected &&
    css`
      background-color: white;
      border-bottom: none;
    `}

  &:last-of-type {
    border-right: none;
  }
`;

const TabContent = styled.div`
  padding: 30px;
  flex: 1;

  p {
    line-height: 22px;
  }
`;

const GotoExercise = styled.div`
  padding: 40px 30px;
  border-top: 1px solid ${colors.gray3};
  ${Button} {
    width: 100%;
  }
`;
