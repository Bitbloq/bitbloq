import React, { FC, useState, useEffect } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";
import Configuration from "./Configuration";
import { Icon, JuniorSwitch, JuniorButton } from "@bitbloq/ui";
import PinSelector from "./PinSelector";
import SelectComponent from "./SelectComponent";

import { BloqCategory } from "../enums";
import {
  IBloq,
  IBloqTypeGroup,
  IBloqType,
  IBoard,
  IComponent,
  IComponentInstance,
  isBloqSelectComponentParameter
} from "../index";

interface IBloqConfigPanelProps {
  isOpen: boolean;
  bloqTypes: IBloqType[];
  availableBloqs: IBloqType[];
  onSelectBloqType: (bloqType: IBloqType) => any;
  selectedPlaceholder: number;
  selectedBloq: IBloq;
  selectedBloqIndex: number;
  getBloqPort: (bloq: IBloq) => string | undefined;
  onUpdateBloq: (newBloq: IBloq) => any;
  onDeleteBloq: () => any;
  onClose: () => any;
  getComponents: (types: string[]) => IComponentInstance[];
  board: IBoard;
  components: IComponent[];
  linesScrollLeft: number;
}

const BloqConfigPanel: FC<IBloqConfigPanelProps> = ({
  isOpen,
  bloqTypes,
  availableBloqs,
  onSelectBloqType,
  selectedPlaceholder,
  selectedBloq,
  selectedBloqIndex,
  getBloqPort,
  onUpdateBloq,
  onDeleteBloq,
  onClose,
  getComponents,
  board,
  components,
  linesScrollLeft
}) => {
  const [selectedTab, setSelectedTab] = useState(BloqCategory.Action);

  useEffect(
    () => {
      setSelectedTab(BloqCategory.Action);
    },
    [isOpen, selectedPlaceholder]
  );

  const addEvent = selectedPlaceholder === 0;
  const addAction = selectedPlaceholder > 0;

  let content = null;

  if (addEvent) {
    const filteredTypes = availableBloqs.filter(
      t => t.category === BloqCategory.Event
    );

    content = (
      <>
        <BloqPlaceholderWrap
          bloqPosition={selectedPlaceholder}
          linesScrollLeft={linesScrollLeft}
        >
          <BloqPlaceholder
            category={addEvent ? BloqCategory.Event : BloqCategory.Action}
          />
        </BloqPlaceholderWrap>
        <BloqList>
          {filteredTypes.map(type => (
            <StyledBloq
              key={type.name}
              type={type}
              onClick={() => onSelectBloqType(type)}
            />
          ))}
        </BloqList>
      </>
    );
  }

  if (addAction) {
    const filteredTypes = availableBloqs.filter(
      t => t.category === selectedTab
    );

    content = (
      <>
        <BloqPlaceholderWrap
          bloqPosition={selectedPlaceholder}
          linesScrollLeft={linesScrollLeft}
        >
          <BloqPlaceholder
            category={addEvent ? BloqCategory.Event : BloqCategory.Action}
          />
        </BloqPlaceholderWrap>
        <BloqTabs>
          <BloqTabsHeader>
            <BloqTab
              selected={selectedTab === BloqCategory.Action}
              onClick={() => setSelectedTab(BloqCategory.Action)}
            >
              <Icon name="programming" />
            </BloqTab>
            <BloqTab
              selected={selectedTab === BloqCategory.Wait}
              onClick={() => setSelectedTab(BloqCategory.Wait)}
            >
              <Icon name="programming3" />
            </BloqTab>
          </BloqTabsHeader>
          <BloqList>
            {filteredTypes.map(type => (
              <StyledBloq
                key={type.name}
                type={type}
                onClick={() => onSelectBloqType(type)}
              />
            ))}
          </BloqList>
        </BloqTabs>
      </>
    );
  }

  if (selectedBloq) {
    const bloqType = bloqTypes.find(t => t.name === selectedBloq.type)!;

    const parameters = bloqType.parameters || [];
    const componentParam = parameters.find(isBloqSelectComponentParameter);

    content = (
      <>
        <BloqPlaceholderWrap
          bloqPosition={selectedBloqIndex}
          linesScrollLeft={linesScrollLeft}
        >
          <HorizontalBloq
            type={bloqType}
            bloq={selectedBloq}
            port={getBloqPort(selectedBloq)}
          />
        </BloqPlaceholderWrap>
        <ConfigContainer>
          <Configuration
            bloqType={bloqType}
            bloq={selectedBloq}
            onChange={onUpdateBloq}
          />
        </ConfigContainer>
        <ConfigRight>
          <ConfigPinsContainer>
            {componentParam && (
              <PinSelector
                value={selectedBloq.parameters[componentParam.name] as string}
                componentInstances={getComponents(bloqType.components || [])}
                fallbackComponent={(bloqType.components || [])[0]}
                onChange={(value: any) =>
                  onUpdateBloq(
                    update(selectedBloq, {
                      parameters: { [componentParam.name]: { $set: value } }
                    })
                  )
                }
                board={board}
                components={components}
              />
            )}
          </ConfigPinsContainer>
          <DeleteButton red onClick={onDeleteBloq}>
            <Icon name="trash" />
            Eliminar bloque
          </DeleteButton>
        </ConfigRight>
      </>
    );
  }

  return (
    <Container isOpen={isOpen}>
      {isOpen && (
        <CloseButton onClick={onClose}>
          <Icon name="close" />
        </CloseButton>
      )}
      {content}
    </Container>
  );
};

export default BloqConfigPanel;

/* Styled components */

interface IContainerProps {
  isOpen: boolean;
}
const Container = styled.div<IContainerProps>`
  position: absolute;
  top: 80px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  transition: transform 0.3 ease-out;
  background-color: white;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  flex: 1;
  display: flex;
  transform: translate(0, ${props => (props.isOpen ? "0" : "100%")});
`;

const CloseButton = styled.div`
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  position: absolute;
  top: -30px;
  right: 0px;

  svg {
    height: 24px;
    width: 24px;
  }
`;

interface IBloqPlaceholderWrapProps {
  bloqPosition: number;
  linesScrollLeft: number;
}
const BloqPlaceholderWrap = styled.div<IBloqPlaceholderWrapProps>`
  position: absolute;
  top: -72px;
  left: ${props =>
    (props.bloqPosition > 0 ? 65 : 60) +
    props.bloqPosition * 65 -
    props.linesScrollLeft}px;
  background-color: white;
  height: 70px;
  padding: 10px 10px 0px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const BloqTabs = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BloqTabsHeader = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #979797;
  margin-top: 20px;
`;

interface IBloqTabProps {
  selected?: boolean;
}
const BloqTab = styled.div<IBloqTabProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: ${props => (props.selected ? "white" : "#ebebeb")};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-style: ${props => (props.selected ? "solid" : "none")};
  border-width: 1px;
  border-color: ${props =>
    props.selected ? "#979797 #979797 white #979797" : "none"};
  margin-bottom: -1px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const BloqList = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin: 7px;
`;

const ConfigContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ConfigRight = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 192px;
  margin-top: 20px;
`;

const ConfigPinsContainer = styled.div`
  flex: 1;
`;

const DeleteButton = styled(JuniorButton)`
  padding: 0px 12px;
  svg {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;
