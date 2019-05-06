import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { selectObject, deselectAllObjects } from '../../actions/threed';
import {
  Scene,
  IHelperDescription,
  IObjectPosition,
  IObjectsCommonJSON,
  Renderer,
} from '@bitbloq/lib3d';
import { getSelectedObjects } from '../../reducers/threed/';
import { Icon, withTranslate } from '@bitbloq/ui';

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

interface CameraButtonProps {
  wideIcon?: boolean;
}
const CameraButton = styled.div<CameraButtonProps>`
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
    width: ${props => (props.wideIcon ? '18px' : '12px')};
  }
`;

export interface ThreeDViewerProps {
  scene: Scene;
  sceneObjects: IObjectsCommonJSON[];
  selectedObjects: IObjectsCommonJSON[];
  activeOperation: IHelperDescription;
  selectObject: (object: IObjectsCommonJSON, add: boolean) => void;
  deselectAllObjects: () => void;
  controlPressed: boolean;
  shiftPressed: boolean;
}

class ThreeDViewerState {
  readonly selectedPosition?: IObjectPosition | null = null;
  readonly isOrthographic: boolean = false;
}

class ThreeDViewer extends React.Component<
  ThreeDViewerProps,
  ThreeDViewerState
> {
  private scene: Scene;
  private renderer: Renderer;
  private rendererContainerRef: React.RefObject<
    HTMLElement
  > = React.createRef();

  readonly state = new ThreeDViewerState();

  componentDidUpdate(prevProps: ThreeDViewerProps) {
    const {
      scene,
      sceneObjects,
      selectedObjects,
      activeOperation,
    } = this.props;
    if (sceneObjects !== prevProps.sceneObjects) {
      this.renderer.updateScene();
    }
    if (selectedObjects !== prevProps.selectedObjects) {
      this.updateStatusBar();
      if (scene) {
        scene.selectedObjects(selectedObjects);
        this.renderer.updateScene();
      }
    }
    if (scene !== prevProps.scene) {
      this.renderer.setScene(scene);
    }

    this.renderer.setActiveHelper(activeOperation);
  }

  componentDidMount() {
    const { scene, selectObject, deselectAllObjects, t } = this.props;
    const container = this.rendererContainerRef.current;

    if (container) {
      this.renderer = new Renderer(scene, container, {
        navigationBoxLabels: {
          top: t('navigation-top'),
          bottom: t('navigation-bottom'),
          left: t('navigation-left'),
          right: t('navigation-right'),
          front: t('navigation-front'),
          back: t('navigation-back'),
        },
      });
      this.renderer.updateScene();
    }

    this.renderer.onObjectClick(object => {
      const { controlPressed, shiftPressed } = this.props;
      selectObject(object, controlPressed || shiftPressed);
    });
    this.renderer.onBackgroundClick(() => {
      if (this.props.selectedObjects.length > 0) {
        deselectAllObjects();
      }
    });
  }

  async updateStatusBar() {
    const { scene, selectedObjects } = this.props;
    this.setState({ selectedPosition: undefined });
    if (selectedObjects && selectedObjects.length === 1) {
      const selectedPosition = await scene.getPositionAsync(selectedObjects[0]);
      this.setState({ selectedPosition });
    }
  }

  onCenter = () => {
    this.renderer.center();
  };

  onZoomIn = () => {
    this.renderer.zoomIn();
  };

  onZoomOut = () => {
    this.renderer.zoomOut();
  };

  onToggleOrthographic = () => {
    const isOrthographic = !this.state.isOrthographic;
    this.renderer.setOrtographicCamera(isOrthographic);
    this.setState({ isOrthographic });
  };

  render() {
    const { selectedPosition, isOrthographic } = this.state;
    const { t } = this.props;

    return (
      <Container ref={this.rendererContainerRef}>
        <CameraButtons>
          <CameraButton onClick={this.onCenter}>
            <Icon name="center" />
          </CameraButton>
          <CameraButton onClick={this.onZoomIn}>
            <Icon name="plus" />
          </CameraButton>
          <CameraButton onClick={this.onZoomOut}>
            <Icon name="minus" />
          </CameraButton>
          <CameraButton onClick={this.onToggleOrthographic} wideIcon>
            {isOrthographic && <Icon name="perspective" />}
            {!isOrthographic && <Icon name="orthographic" />}
          </CameraButton>
        </CameraButtons>
        <StatusBar>
          {selectedPosition && (
            <StatusBarGroup>
              <b>{t('status-position')}</b>
              <span>X={selectedPosition.position.x.toFixed(2)}</span>
              <span>Y={selectedPosition.position.y.toFixed(2)}</span>
              <span>Z={selectedPosition.position.z.toFixed(2)}</span>
            </StatusBarGroup>
          )}
          {selectedPosition && (
            <StatusBarGroup>
              <b>{t('status-rotation')}</b>
              <span>X={selectedPosition.angle.x.toFixed(2)}</span>
              <span>Y={selectedPosition.angle.y.toFixed(2)}</span>
              <span>Z={selectedPosition.angle.z.toFixed(2)}</span>
            </StatusBarGroup>
          )}
        </StatusBar>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  scene: state.threed.scene.sceneInstance,
  sceneObjects: state.threed.scene.objects,
  activeOperation: state.threed.ui.activeOperation,
  selectedObjects: getSelectedObjects(state.threed),
  controlPressed: state.ui.controlPressed,
  shiftPressed: state.ui.shiftPressed,
});

const mapDispatchToProps = {
  selectObject,
  deselectAllObjects,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslate(ThreeDViewer));
