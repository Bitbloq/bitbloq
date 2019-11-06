import React, { FC, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Scene,
  IHelperDescription,
  IObjectPosition,
  IObjectsCommonJSON,
  Renderer
} from "@bitbloq/lib3d";
import { Icon, Tooltip, useTranslate } from "@bitbloq/ui";

const SLOW_TIMEOUT_MS = 3000;

export interface IThreeDViewerProps {
  scene: Scene;
  sceneObjects: IObjectsCommonJSON[];
  selectedObjects: IObjectsCommonJSON[];
  activeOperation: IHelperDescription | null;
  onObjectClick: (object: IObjectsCommonJSON) => void;
  onBackgroundClick: () => void;
}

const ThreeDViewer: FC<IThreeDViewerProps> = ({
  scene,
  sceneObjects,
  selectedObjects,
  activeOperation,
  onObjectClick,
  onBackgroundClick
}) => {
  const t = useTranslate();

  const [
    selectedPosition,
    setSelectedPosition
  ] = useState<IObjectPosition | null>(null);
  const [isOrthographic, setIsOrthographic] = useState(false);
  const [showSlowProgress, setShowSlowProgress] = useState(false);
  const [slowProgressPercentage, setSlowProgressPercentage] = useState(0);

  const rendererRef = useRef<Renderer | null>(null);
  const slowIntervalRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateScene = async () => {
    if (slowIntervalRef.current) {
      clearInterval(slowIntervalRef.current);
      slowIntervalRef.current = 0;
      setSlowProgressPercentage(0);
    }

    let percentage = 10;
    slowIntervalRef.current = window.setInterval(() => {
      setShowSlowProgress(true);
      setSlowProgressPercentage(percentage);
      if (document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }
      percentage += (100 - percentage) / 10;
    }, SLOW_TIMEOUT_MS);

    try {
      if (rendererRef.current) {
        await rendererRef.current.updateScene();
      }
    } catch (e) {
      console.log(e);
    }

    clearInterval(slowIntervalRef.current);
    setShowSlowProgress(false);
  };

  const updateStatusBar = async () => {
    setSelectedPosition(null);
    if (selectedObjects && selectedObjects.length === 1) {
      setSelectedPosition(await scene.getPositionAsync(selectedObjects[0]));
    }
  };

  const onCenter = () => {
    if (rendererRef.current) {
      rendererRef.current.center();
    }
  };

  const onZoomIn = () => {
    if (rendererRef.current) {
      rendererRef.current.zoomIn();
    }
  };

  const onZoomOut = () => {
    if (rendererRef.current) {
      rendererRef.current.zoomOut();
    }
  };

  const onToggleOrthographic = () => {
    setIsOrthographic(!isOrthographic);
    if (rendererRef.current) {
      rendererRef.current.setOrtographicCamera(!isOrthographic);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      rendererRef.current = new Renderer(scene, containerRef.current, {
        navigationBoxLabels: {
          top: t("navigation-top"),
          bottom: t("navigation-bottom"),
          left: t("navigation-left"),
          right: t("navigation-right"),
          front: t("navigation-front"),
          back: t("navigation-back")
        }
      });
      updateScene();

      rendererRef.current.onObjectClick(onObjectClick);
      rendererRef.current.onBackgroundClick(onBackgroundClick);
    }

    return () => {
      clearInterval(slowIntervalRef.current);
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
    };
  }, []);

  useEffect(
    () => {
      if (rendererRef.current) {
        rendererRef.current.setScene(scene);
      }
    },
    [scene]
  );

  useEffect(
    () => {
      updateScene();
    },
    [sceneObjects]
  );

  useEffect(
    () => {
      updateStatusBar();
      if (scene) {
        scene.selectedObjects(selectedObjects);
        updateScene();
      }
    },
    [selectedObjects]
  );

  useEffect(
    () => {
      if (rendererRef.current) {
        rendererRef.current.setActiveHelper(activeOperation);
      }
    },
    [activeOperation]
  );

  return (
    <Container ref={containerRef}>
      <CameraButtons>
        <Tooltip position="right" content={t("tooltip-center-view")}>
          {tooltipProps => (
            <CameraButton {...tooltipProps} onClick={onCenter}>
              <Icon name="center" />
            </CameraButton>
          )}
        </Tooltip>
        <Tooltip position="right" content={t("tooltip-zoom-plus")}>
          {tooltipProps => (
            <CameraButton {...tooltipProps} onClick={onZoomIn}>
              <Icon name="plus" />
            </CameraButton>
          )}
        </Tooltip>
        <Tooltip position="right" content={t("tooltip-zoom-minus")}>
          {tooltipProps => (
            <CameraButton {...tooltipProps} onClick={onZoomOut}>
              <Icon name="minus" />
            </CameraButton>
          )}
        </Tooltip>
        <Tooltip
          position="right"
          content={
            isOrthographic
              ? t("tooltip-perspective-view")
              : t("tooltip-orthogonal-view")
          }
        >
          {tooltipProps => (
            <CameraButton
              {...tooltipProps}
              onClick={onToggleOrthographic}
              wideIcon={true}
            >
              {isOrthographic && <Icon name="perspective" />}
              {!isOrthographic && <Icon name="orthographic" />}
            </CameraButton>
          )}
        </Tooltip>
      </CameraButtons>
      <StatusBar>
        {selectedPosition && (
          <>
            <StatusBarGroup>
              <b>{t("status-position")}</b>
              <span>X={selectedPosition.position.x.toFixed(2)}</span>
              <span>Y={selectedPosition.position.y.toFixed(2)}</span>
              <span>Z={selectedPosition.position.z.toFixed(2)}</span>
            </StatusBarGroup>
            <StatusBarGroup>
              <b>{t("status-rotation")}</b>
              <span>X={selectedPosition.angle.x.toFixed(2)}</span>
              <span>Y={selectedPosition.angle.y.toFixed(2)}</span>
              <span>Z={selectedPosition.angle.z.toFixed(2)}</span>
            </StatusBarGroup>
          </>
        )}
      </StatusBar>
      {showSlowProgress && (
        <SlowProgressContainer>
          <SlowProgressPanel>
            <SlowProgressBarContainer>
              <SlowProgressBar
                style={{ width: `${slowProgressPercentage}%` }}
              />
            </SlowProgressBarContainer>
            <p>{Math.round(slowProgressPercentage)}%</p>
          </SlowProgressPanel>
        </SlowProgressContainer>
      )}
    </Container>
  );
};

export default ThreeDViewer;

/* Styled components */

const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
`;

const StatusBar = styled.div`
  position: absolute;
  height: 24px;
  background-color: #5d6069;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  z-index: 10;
  color: white;
  font-size: 12px;
`;

const StatusBarGroup = styled.div`
  display: flex;
  margin-right: 40px;

  b, span {
    margin-right: 20px;
  }
  span:last-child {
    margin-right; 0px;
  }
`;

const CameraButtons = styled.div`
  position: absolute;
  top: 150px;
  left: 20px;
  z-index: 10;
`;

interface ICameraButtonProps {
  wideIcon?: boolean;
}
const CameraButton = styled.div<ICameraButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #cfcfcf;

  svg {
    width: ${props => (props.wideIcon ? "18px" : "12px")};
  }
`;

const SlowProgressContainer = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlowProgressPanel = styled.div`
  width: 200px;
  box-sizing: content-box;
  border-radius: 4px;
  background-color: #373b44;
  padding: 15px 20px;

  p {
    color: white;
    text-align: center;
    font-size: 12px;
  }
`;

const SlowProgressBarContainer = styled.div`
  background-color: #f1f1f1;
  border-radius: 4px;
  height: 8px;
  margin-bottom: 6px;
`;

const SlowProgressBar = styled.div`
  background-color: #59b52e;
  border-radius: 4px;
  height: 8px;
`;
