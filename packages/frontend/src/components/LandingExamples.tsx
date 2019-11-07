import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Icon } from "@bitbloq/ui";
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { useSpring, animated } from "react-spring";
import { EXAMPLES_QUERY } from "../apollo/queries";
import DocumentCard from "./DocumentCard";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const LandingExamples: FC = () => {
  const { data } = useQuery(EXAMPLES_QUERY);
  const [first, setFirst] = useState(0);

  const numExamples = (data && data.examples && data.examples.length) || 0;

  const examplesStyle = useSpring({
    transform: `translateX(-${first * 25}%)`,
    config: { tension: 1000, friction: 80 }
  });

  const onExampleClick = (document: any) => {
    window.open(`/app/public-document/${document.type}/${document.id}`);
  };

  if (numExamples === 0) {
    return null;
  }

  return (
    <Container>
      <h2>
        <Icon name="view-document" />
        Descubre todo lo que puedes crear
      </h2>
      <Wrap>
        <ExamplesWrap>
          <Examples style={examplesStyle}>
            {data.examples.map((example: any) => (
              <Example key={example.id} onClick={() => onExampleClick(example)}>
                <DndProvider backend={HTML5Backend}>
                  <DocumentCard draggable={false} document={example} />
                </DndProvider>
              </Example>
            ))}
          </Examples>
        </ExamplesWrap>
        {first > 0 && (
          <LeftButton onClick={() => setFirst(first - 1)}>
            <Icon name="angle" />
          </LeftButton>
        )}
        {first < numExamples - 4 && (
          <RightButton onClick={() => setFirst(first + 1)}>
            <Icon name="angle" />
          </RightButton>
        )}
      </Wrap>
      <Dots>
        {numExamples > 4 &&
          Array.from(Array(numExamples - 3)).map((_, i) => (
            <Dot key={i} active={first === i} onClick={() => setFirst(i)} />
          ))}
      </Dots>
    </Container>
  );
};

export default LandingExamples;

const Container = styled.div`
  padding: 80px 0;

  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 40px;

    svg {
      height: 36px;
      margin-right: 10px;
    }
  }
`;

const Wrap = styled.div`
  position: relative;
  margin-bottom: 30px;
`;

const NavButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  border: solid 1px #cfcfcf;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const LeftButton = styled(NavButton)`
  left: -10px;
  svg {
    transform: rotate(90deg);
  }
`;

const RightButton = styled(NavButton)`
  right: -10px;
  svg {
    transform: rotate(-90deg);
  }
`;

const ExamplesWrap = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Examples = styled(animated.div)`
  display: flex;
  margin: 0px -10px;
`;

const Example = styled.div`
  min-width: 25%;
  position: relative;

  &::before {
    content: "";
    display: block;
    padding-bottom: 85.7%;
  }

  & > div:first-of-type {
    position: absolute;
    top: 0px;
    left: 10px;
    bottom: 0px;
    right: 10px;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
`;

interface DotProps {
  active?: boolean;
}
const Dot = styled.div<DotProps>`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  cursor: pointer;
  margin: 0px 5px;
  background-color: ${props => (props.active ? "#373b44" : "#ebebeb")};
`;
