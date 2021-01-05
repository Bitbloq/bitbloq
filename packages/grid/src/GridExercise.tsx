import React, { FC, useState } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { IBloq, IBloqType, IBloqLine, BloqsLine } from "@bitbloq/bloqs";
import { breakpoints, colors } from "@bitbloq/ui";

import AddBloqPanel from "./AddBloqPanel";
import { bloqTypes } from "./config";
import { ActionType, IAction, IActions, ILoop } from "./types";
import RombiIcon from "./icons/rombi.svg";

export interface IGridExerciseProps {
  actions: IActions;
  onChange?: (actions: IActions) => any;
  availableBloqs?: { [bloq: string]: number };
  className?: string;
  activeAction?: number;
  activeSubAction?: number;
}

const getActionIndex = (bloqIndex: number, actions: IActions) => {
  let i = 0;
  let j = 1;

  while (i < actions.length) {
    const action = actions[i];
    if (action.type === ActionType.Loop) {
      if (
        bloqIndex >= j &&
        bloqIndex <= j + (action as ILoop).children.length + 1
      ) {
        return [i, bloqIndex - j];
      } else {
        j += (action as ILoop).children.length + 2;
      }
    } else {
      if (bloqIndex === j) {
        return [i, -1];
      }
      j++;
    }
    i++;
  }

  return [i, -1];
};

const getBloqIndex = (
  actions: IActions,
  actionIndex: number,
  subActionIndex?: number
) =>
  actions
    .slice(0, actionIndex)
    .reduce(
      (index, action) =>
        action.type === ActionType.Loop
          ? index + (action as ILoop).children.length + 2
          : index + 1,
      subActionIndex !== undefined ? subActionIndex + 2 : 1
    );

const GridExercise: FC<IGridExerciseProps> = ({
  actions,
  className,
  availableBloqs,
  onChange,
  activeAction,
  activeSubAction,
  children
}) => {
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(-1);
  const [selectedBloq, setSelectedBloq] = useState(-1);
  const [selectedLeft, setSelectedLeft] = useState(0);

  const [selectedActionIndex, loopPlaceholder] = getActionIndex(
    selectedPlaceholder >= 0 ? selectedPlaceholder : selectedBloq,
    actions
  );

  const addBloq = (bloqType: IBloqType) => {
    if (!onChange) {
      return;
    }

    if (bloqType.name === "loop") {
      const action: ILoop = { type: ActionType.Loop, children: [], repeat: 2 };
      onChange(
        update(actions, {
          $splice: [[selectedActionIndex, 0, action]]
        })
      );
    } else {
      if (loopPlaceholder > 0) {
        onChange(
          update(actions, {
            [selectedActionIndex]: {
              children: {
                $splice: [
                  [
                    loopPlaceholder - 1,
                    0,
                    { type: bloqType.name as ActionType }
                  ]
                ]
              }
            }
          })
        );
      } else {
        onChange(
          update(actions, {
            $splice: [
              [selectedActionIndex, 0, { type: bloqType.name as ActionType }]
            ]
          })
        );
      }
    }
    setSelectedPlaceholder(selectedPlaceholder + 1);
  };

  const deleteBloq = (bloq: number) => {
    if (!onChange) {
      return;
    }

    if (loopPlaceholder > 0) {
      onChange(
        update(actions, {
          [selectedActionIndex]: {
            children: {
              $splice: [[loopPlaceholder - 1, 1]]
            }
          }
        })
      );
    } else {
      onChange(
        update(actions, {
          $splice: [[selectedActionIndex, 1]]
        })
      );
    }
    setSelectedBloq(-1);
  };

  const updateBloq = (index: number, newBloq: IBloq) => {
    if (!onChange) {
      return;
    }
    if (newBloq.type === "loop") {
      const updatedAction: ILoop = {
        ...(actions[selectedActionIndex] as ILoop),
        repeat: newBloq.parameters.repeat as number
      };
      onChange(
        update(actions, {
          $splice: [[selectedActionIndex, 1, updatedAction]]
        })
      );
    }
  };

  const selectBloq = (bloq: number) => {
    setSelectedBloq(bloq);
    setSelectedPlaceholder(-1);
  };

  const selectPlaceholder = (placeholder: number) => {
    setSelectedPlaceholder(placeholder);
    setSelectedBloq(-1);
  };

  const shrinkLoop = () => {
    if (!onChange) {
      return;
    }
    const loopAction = actions[selectedActionIndex] as ILoop;
    const lastAction = loopAction.children[loopAction.children.length - 1];
    const updatedLoop = update(loopAction, {
      children: { $splice: [[loopAction.children.length - 1, 1]] }
    });

    onChange(
      update(actions, {
        $splice: [
          [selectedActionIndex, 1, updatedLoop],
          [selectedActionIndex + 1, 0, lastAction]
        ]
      })
    );
    setSelectedBloq(selectedBloq - 1);
  };

  const growLoop = () => {
    if (!onChange) {
      return;
    }
    const loopAction = actions[selectedActionIndex] as ILoop;
    const nextAction = actions[selectedActionIndex + 1];
    const updatedLoop = update(loopAction, {
      children: { $splice: [[loopAction.children.length, 0, nextAction]] }
    });

    onChange(
      update(actions, {
        $splice: [
          [selectedActionIndex, 1, updatedLoop],
          [selectedActionIndex + 1, 1]
        ]
      })
    );
    setSelectedBloq(selectedBloq + 1);
  };

  const bloqLine: IBloqLine = {
    id: "0",
    bloqs: [
      {
        type: "start"
      },
      ...actions
    ].flatMap(action => {
      if (action.type === ActionType.Loop) {
        const loopBloq: IBloq = {
          type: "loop",
          parameters: { repeat: (action as ILoop).repeat }
        };
        return [
          loopBloq,
          ...(action as ILoop).children.map(child => ({
            type: child.type,
            parameters: {}
          })),
          { type: "end-loop", parameters: {} }
        ];
      } else {
        return [
          {
            type: action.type,
            parameters: {}
          }
        ];
      }
    })
  };

  const activeBloq =
    activeAction !== undefined
      ? getBloqIndex(actions, activeAction, activeSubAction)
      : -1;

  const bloqsInUse: IAction[] = [...actions];
  actions
    .filter(action => action.type === "loop")
    .forEach((action: ILoop) => {
      if (action.children) {
        action.children.forEach((a: IAction) => bloqsInUse.push(a));
      }
    });

  const filteredAvailableBloqs =
    availableBloqs &&
    Object.keys(availableBloqs)
      .filter(type => !(loopPlaceholder >= 0 && type === "loop"))
      .reduce((filtered, type) => {
        const number =
          availableBloqs[type] - bloqsInUse.filter(a => a.type === type).length;
        return { ...filtered, [type]: number };
      }, {});
  const filteredListBloqs =
    availableBloqs &&
    Object.keys(availableBloqs).reduce((filtered, type) => {
      const number =
        availableBloqs[type] - bloqsInUse.filter(a => a.type === type).length;
      return { ...filtered, [type]: number };
    }, {});

  return (
    <Container className={className}>
      <Content>
        {children}
        {onChange && filteredListBloqs && (
          <AvailableBloqsWrap>
            <AvailableBloqs>
              {Object.keys(filteredListBloqs).map((typeName, index) => {
                const type = bloqTypes.find(t => t.name === typeName)!;
                const count = filteredListBloqs[typeName];
                return (
                  <AvailableBloq key={index}>
                    <img src={type.icon} />
                    <span>{count >= 0 ? count : <>&#8734;</>}</span>
                  </AvailableBloq>
                );
              })}
            </AvailableBloqs>
          </AvailableBloqsWrap>
        )}
        {onChange && filteredAvailableBloqs && (
          <AddBloqPanel
            availableBloqs={filteredAvailableBloqs}
            onSelectBloqType={addBloq}
            disabled={selectedPlaceholder < 0}
          />
        )}
      </Content>
      <StyledBloqsLine
        bloqTypes={bloqTypes}
        line={bloqLine}
        onBloqClick={onChange ? selectBloq : () => undefined}
        selectedBloq={onChange ? selectedBloq : -1}
        activeBloq={activeBloq}
        activeIndicator={
          <ActiveIndicator>
            <img src={RombiIcon} />
          </ActiveIndicator>
        }
        selectedPlaceholder={selectedPlaceholder}
        onSelectedPositionChange={setSelectedLeft}
        onPlaceholderClick={selectPlaceholder}
        getBloqPort={b => undefined}
        editInPlace={true}
        onDeleteBloq={deleteBloq}
        onUpdateBloq={updateBloq}
        onShrinkLoop={shrinkLoop}
        onGrowLoop={growLoop}
        readOnly={!onChange}
      />
    </Container>
  );
};

export default GridExercise;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  align-items: stretch;
  justify-content: flex-start;
  display: flex;
  padding: 10px 10px 0px 10px;
  @media screen and (min-width: ${breakpoints.tablet}px) {
    padding: 20px 20px 0px 20px;
  }
  flex: 1;

  > :not(:last-child) {
    margin-right: 10px;
  }
  @media screen and (min-width: ${breakpoints.tablet}px) {
    > :not(:last-child) {
      margin-right: 20px;
    }
  }
`;

const StyledBloqsLine = styled(BloqsLine)`
  flex: unset;
  margin: 0 10px;
  min-height: 100px;
  padding: 10px 0;

  @media screen and (min-width: ${breakpoints.tablet}px) {
    margin: 0 20px;
    padding: 20px 0;
  }
`;

const ActiveIndicator = styled.div`
  width: 24px;
  height: 20px;
  border-radius: 2px;
  position: absolute;
  top: -8px;
  right: 12px;
  background-color: ${colors.brandOrange};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 14px;
    height: 14px;
  }
`;

const AvailableBloqsWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AvailableBloqs = styled.div`
  border: 1px solid ${colors.gray7};
  width: 60px;

  @media screen and (min-width: ${breakpoints.tablet}px) {
    width: 72px;
  }
`;

const AvailableBloq = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid ${colors.gray7};

  img {
    width: 24px;
    margin: 0 6px;
  }

  span {
    width: 30px;
    display: block;
    text-align: center;
  }

  &:last-of-type {
    border-bottom: none;
  }

  @media screen and (min-width: ${breakpoints.tablet}px) {
    height: 38px;
    img {
      width: 30px;
    }
  }
`;
