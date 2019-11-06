import React, { useState, useRef, useEffect } from "react";
import update from "immutability-helper";
import { Icon, JuniorButton, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import BloqsLine from "./BloqsLine";
import BloqConfigPanel from "./BloqConfigPanel";
import AddBloqPanel from "./AddBloqPanel";
import BloqPropertiesPanel from "./BloqPropertiesPanel";

import { BloqCategory } from "../enums";
import {
  IBloq,
  IBloqType,
  IBloqTypeGroup,
  IBoard,
  IComponent,
  IComponentInstance,
  BloqParameterType,
  isBloqSelectParameter,
  isBloqSelectComponentParameter
} from "../index";

interface IHorizontalBloqEditorProps {
  bloqs: IBloq[][];
  bloqTypes: IBloqType[];
  availableBloqs: IBloqType[];
  onBloqsChange: (bloqs: IBloq[][]) => any;
  onUpload: () => any;
  getComponents: (types: string[]) => IComponentInstance[];
  getBloqPort: (bloq: IBloq) => string | undefined;
  board: IBoard;
  components: IComponent[];
}

const HorizontalBloqEditor: React.FunctionComponent<
  IHorizontalBloqEditorProps
> = ({
  bloqs,
  bloqTypes,
  availableBloqs,
  onBloqsChange,
  onUpload,
  getComponents,
  getBloqPort,
  board,
  components
}) => {
  const [selectedLineIndex, setSelectedLine] = useState(-1);
  const [selectedBloqIndex, setSelectedBloq] = useState(-1);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(-1);

  const [linesScrollLeft, setLinesScrollLeft] = useState(0);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (linesRef.current) {
        let bloqIndex = -1;
        if (selectedBloqIndex >= 0) {
          bloqIndex = selectedBloqIndex;
        }
        if (selectedPlaceholder >= 0) {
          bloqIndex = selectedPlaceholder;
        }

        if (bloqIndex >= 0) {
          const bloqPosition = 65 + bloqIndex * 65;
          const width = linesRef.current.clientWidth;
          if (bloqPosition - linesScrollLeft < 0) {
            linesRef.current.scrollLeft = bloqPosition;
          } else if (bloqPosition - linesScrollLeft > width - 160) {
            linesRef.current.scrollLeft = bloqPosition - width + 160;
          }
        }
      }
    },
    [linesScrollLeft, selectedBloqIndex, selectedPlaceholder]
  );

  const [undoPast, setUndoPast] = useState<IBloq[][][]>([]);
  const [undoFuture, setUndoFuture] = useState<IBloq[][][]>([]);

  const selectedLine = bloqs[selectedLineIndex] || [];
  const selectedBloq = selectedLine[selectedBloqIndex];

  const t = useTranslate();

  const deselectEverything = () => {
    setSelectedLine(-1);
    setSelectedBloq(-1);
    setSelectedPlaceholder(-1);
  };

  const onAddBloq = (bloqType: IBloqType) => {
    const newBloq: IBloq = {
      type: bloqType.name,
      parameters: (bloqType.parameters || []).reduce((obj, param) => {
        if (param.defaultValue) {
          obj[param.name] = param.defaultValue;
        } else {
          if (
            isBloqSelectParameter(param) &&
            param.options &&
            param.options.length > 0
          ) {
            obj[param.name] = param.options[0].value;
          }
          if (isBloqSelectComponentParameter(param)) {
            const compatibleComponents =
              getComponents(bloqType.components || []) || [];
            const { name = "" } =
              compatibleComponents.sort((a, b) => {
                const aPort = a.port || "";
                const bPort = b.port || "";
                const aIsNumber = !isNaN(parseInt(aPort, 10));
                const bIsNumber = !isNaN(parseInt(bPort, 10));

                if ((aIsNumber && bIsNumber) || (!aIsNumber && !bIsNumber)) {
                  return aPort < bPort ? -1 : 1;
                }
                if (aIsNumber) {
                  return -1;
                }
                return 1;
              })[0] || {};

            obj[param.name] = name;
          }
          if (param.type === BloqParameterType.Number) {
            obj[param.name] = 0;
          }
          if (param.type === BloqParameterType.Text) {
            obj[param.name] = "";
          }
          if (param.type === BloqParameterType.Boolean) {
            obj[param.name] = false;
          }
          if (param.type === BloqParameterType.Hidden) {
            obj[param.name] = param.value;
          }
        }
        return obj;
      }, {})
    };

    if (selectedLineIndex < bloqs.length) {
      onBloqsChange(
        update(bloqs, {
          [selectedLineIndex]: { $splice: [[selectedPlaceholder, 0, newBloq]] }
        })
      );
    } else {
      onBloqsChange(update(bloqs, { $push: [[newBloq]] }));
    }
    setUndoPast([...undoPast, bloqs]);
    setUndoFuture([]);
    setSelectedBloq(selectedPlaceholder);
    setSelectedPlaceholder(-1);
  };

  const onUpdateBloq = (newBloq: IBloq) => {
    onBloqsChange(
      update(bloqs, {
        [selectedLineIndex]: { [selectedBloqIndex]: { $set: newBloq } }
      })
    );
  };

  const onDeleteBloq = () => {
    onBloqsChange(
      update(bloqs, {
        [selectedLineIndex]: { $splice: [[selectedBloqIndex, 1]] }
      })
    );
    setUndoPast([...undoPast, bloqs]);
    setUndoFuture([]);
    deselectEverything();
  };

  const onUndo = () => {
    onBloqsChange(undoPast[undoPast.length - 1]);
    setUndoPast(undoPast.slice(0, undoPast.length - 1));
    setUndoFuture([bloqs, ...undoFuture]);
  };

  const onRedo = () => {
    onBloqsChange(undoFuture[0]);
    setUndoPast([...undoPast, bloqs]);
    setUndoFuture(undoFuture.slice(1));
  };

  const onLinesScroll = (e: React.UIEvent) => {
    if (linesRef.current) {
      setLinesScrollLeft(linesRef.current.scrollLeft);
    }
  };

  return (
    <Container>
      <Lines
        selectedLine={selectedLineIndex}
        onClick={deselectEverything}
        ref={linesRef}
        onScroll={onLinesScroll}
      >
        {[...bloqs, []].map((line, i) => (
          <Line key={i}>
            <Number>{i + 1}</Number>
            <BloqsLine
              bloqs={line}
              bloqTypes={bloqTypes}
              getBloqPort={getBloqPort}
              selectedBloq={selectedLineIndex === i ? selectedBloqIndex : -1}
              selectedPlaceholder={
                selectedLineIndex === i ? selectedPlaceholder : -1
              }
              onBloqClick={(j, e) => {
                e.stopPropagation();
                setSelectedLine(i);
                setSelectedBloq(j);
                setSelectedPlaceholder(-1);
              }}
              onPlaceholderClick={(j, e) => {
                e.stopPropagation();
                setSelectedLine(i);
                setSelectedBloq(-1);
                setSelectedPlaceholder(j);
              }}
            />
          </Line>
        ))}
      </Lines>
      <Toolbar>
        <ToolbarLeft>
          <JuniorButton
            secondary
            disabled={undoPast.length === 0}
            onClick={onUndo}
          >
            <Icon name="undo" />
          </JuniorButton>
          <JuniorButton
            secondary
            disabled={undoFuture.length === 0}
            onClick={onRedo}
          >
            <Icon name="redo" />
          </JuniorButton>
        </ToolbarLeft>
        <UploadButton onClick={onUpload}>
          <Icon name="brain" />
        </UploadButton>
      </Toolbar>
      <BloqConfigPanel
        isOpen={selectedPlaceholder >= 0 || selectedBloqIndex >= 0}
        bloqTypes={bloqTypes}
        availableBloqs={availableBloqs}
        onSelectBloqType={onAddBloq}
        selectedPlaceholder={selectedPlaceholder}
        selectedBloq={selectedBloq}
        selectedBloqIndex={selectedBloqIndex}
        getBloqPort={getBloqPort}
        onUpdateBloq={onUpdateBloq}
        onDeleteBloq={onDeleteBloq}
        onClose={() => deselectEverything()}
        getComponents={getComponents}
        board={board}
        components={components}
        linesScrollLeft={linesScrollLeft}
      />
    </Container>
  );
};

export default HorizontalBloqEditor;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 100%;
`;

interface ILinesProps {
  selectedLine: number;
}
const Lines = styled.div<ILinesProps>`
  overflow-x: auto;
  overflow-y: ${props => (props.selectedLine >= 0 ? "hidden" : "auto")};
  padding: 10px;
  box-sizing: border-box;
  flex: 1;
  transform: translate(
    0,
    ${props => (props.selectedLine > 0 ? props.selectedLine * -100 : 0)}px
  );
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Number = styled.div`
  min-width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3b3e45;
  font-weight: bold;
  font-size: 32px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const Toolbar = styled.div`
  height: 72px;
  border-top: 1px solid #cfcfcf;
  padding: 10px;
  display: flex;
  box-sizing: border-box;
`;

const ToolbarLeft = styled.div`
  flex: 1;
  display: flex;
  margin: 0px -5px;

  button {
    margin: 0px 5px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const UploadButton = styled(JuniorButton)`
  padding: 0px 34px;
  svg {
    width: 32px;
    height: 32px;
  }
`;
