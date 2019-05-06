import * as THREE from 'three';

const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;
const WIDTH = 150;
const HEIGHT = 150;

// text literals

// TO IMPROVE

const language = navigator.language;
const langCode = language.split('-')[0] || language;
let messages: any;

if (langCode === 'es') {
  messages = {
    TOP: 'SUPERIOR',
    BOTTOM: 'INFERIOR',
    RIGHT: 'DERECHA',
    LEFT: 'IZQUIERDA',
    FRONT: 'FRONTAL',
    BACK: 'POSTERIOR',
  };
} else {
  messages = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    FRONT: 'FRONT',
    BACK: 'BACK',
  };
}

interface IClickBox {
  position: [number, number, number];
  size: [number, number, number];
  cameraAngle: [number, number];
}

const clickBoxes: IClickBox[] = [
  // TOP
  {
    position: [0, 0, 1],
    size: [1.5, 1.5, 0.001],
    cameraAngle: [-HALF_PI, 0],
  },
  // BOTTOM
  {
    position: [0, 0, -1],
    size: [1.5, 1.5, 0.001],
    cameraAngle: [-HALF_PI, Math.PI],
  },
  // FRONT
  {
    position: [0, -1, 0],
    size: [1.5, 0.001, 1.5],
    cameraAngle: [-HALF_PI, HALF_PI],
  },
  // BACK
  {
    position: [0, 1, 0],
    size: [1.5, 0.001, 1.5],
    cameraAngle: [HALF_PI, HALF_PI],
  },
  // RIGHT
  {
    position: [1, 0, 0],
    size: [0.001, 1.5, 1.5],
    cameraAngle: [0, HALF_PI],
  },
  // LEFT
  {
    position: [-1, 0, 0],
    size: [0.001, 1.5, 1.5],
    cameraAngle: [-Math.PI, HALF_PI],
  },
  // TOP-FRONT
  {
    position: [0, -0.876, 0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [-HALF_PI, QUARTER_PI],
  },
  // TOP-LEFT
  {
    position: [-0.876, 0, 0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [-Math.PI, QUARTER_PI],
  },
  // TOP-BACK
  {
    position: [0, 0.876, 0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [HALF_PI, QUARTER_PI],
  },
  // TOP-RIGHT
  {
    position: [0.876, 0, 0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [0, QUARTER_PI],
  },
  // BOTTOM-FRONT
  {
    position: [0, -0.876, -0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [-HALF_PI, 3 * QUARTER_PI],
  },
  // BOTTOM-LEFT
  {
    position: [-0.876, 0, -0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [-Math.PI, 3 * QUARTER_PI],
  },
  // BOTTOM-BACK
  {
    position: [0, 0.876, -0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [HALF_PI, 3 * QUARTER_PI],
  },
  // BOTTOM-RIGHT
  {
    position: [0.876, 0, -0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [0, 3 * QUARTER_PI],
  },
  // FRONT-LEFT
  {
    position: [-0.876, -0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [-3 * QUARTER_PI, HALF_PI],
  },
  // FRONT-RIGHT
  {
    position: [0.876, -0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [-QUARTER_PI, HALF_PI],
  },
  // BACK-LEFT
  {
    position: [-0.876, 0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [3 * QUARTER_PI, HALF_PI],
  },
  // BACK-RIGHT
  {
    position: [0.876, 0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [QUARTER_PI, HALF_PI],
  },
  // TOP-FRONT-LEFT
  {
    position: [-0.876, -0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-3 * QUARTER_PI, QUARTER_PI],
  },
  // TOP-FRONT-RIGHT
  {
    position: [0.876, -0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-QUARTER_PI, QUARTER_PI],
  },
  // TOP-BACK-LEFT
  {
    position: [-0.876, 0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [3 * QUARTER_PI, QUARTER_PI],
  },
  // TOP-BACK-RIGHT
  {
    position: [0.876, 0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [QUARTER_PI, QUARTER_PI],
  },
  // BOTTOM-FRONT-LEFT
  {
    position: [-0.876, -0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-3 * QUARTER_PI, 3 * QUARTER_PI],
  },
  // BOTTOM-FRONT-RIGHT
  {
    position: [0.876, -0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-QUARTER_PI, 3 * QUARTER_PI],
  },
  // BOTTOM-BACK-LEFT
  {
    position: [-0.876, 0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [3 * QUARTER_PI, 3 * QUARTER_PI],
  },
  // BOTTOM-BACK-RIGHT
  {
    position: [0.876, 0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [QUARTER_PI, 3 * QUARTER_PI],
  },
];

type ChangeCameraAngleHandler = (theta: number, phi: number) => void;

export interface IBoxLabels {
  front: string;
  back: string;
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export interface INavigationBoxOptions {
  onChangeCameraAngle?: ChangeCameraAngleHandler;
  boxLabels: IBoxLabels;
}

export default class NavigationBox {
  public static defaultOptions: INavigationBoxOptions = {
    boxLabels: {
      front: (messages && messages.FRONT) || 'FRONT',
      back: (messages && messages.BACK) || 'BACK',
      top: (messages && messages.TOP) || 'TOP',
      bottom: (messages && messages.BOTTOM) || 'BOTTOM',
      left: (messages && messages.LEFT) || 'LEFT',
      right: (messages && messages.RIGHT) || 'RIGHT',
    },
  };

  private container: HTMLElement;
  private options: INavigationBoxOptions;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private boxes: THREE.Group;
  private containerRect: ClientRect;
  private hoverBox: THREE.Mesh;

  constructor(
    container: HTMLElement,
    options: Partial<INavigationBoxOptions> = {}
  ) {
    this.container = container;
    this.options = {
      ...NavigationBox.defaultOptions,
      ...options,
    };

    this.setup();
  }

  public setOrtographicCamera(isOrtographic: boolean): void {
    if (isOrtographic) {
      this.camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -10, 10);
    } else {
      this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      this.camera.aspect = WIDTH / HEIGHT;
    }
    this.camera.up.set(0, 0, 1);
    this.camera.updateProjectionMatrix();
  }

  public updateCamera(x: number, y: number, z: number) {
    this.camera.position.set(x * 5, y * 5, z * 5);
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  private async setup() {
    const rendererParams = {
      alpha: true,
      antialias: true,
    };

    const renderer = new THREE.WebGLRenderer(rendererParams);
    renderer.setSize(WIDTH, HEIGHT);
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('click', this.onClick);
    this.containerRect = this.container.getBoundingClientRect();

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x888888));
    const spotLight = new THREE.SpotLight(0xeeeeee);
    spotLight.position.set(2, -4, 3);
    this.scene.add(spotLight);
    const spotLight2 = new THREE.SpotLight(0xdddddd);
    spotLight2.position.set(-8, 8, -6);
    this.scene.add(spotLight2);

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const { boxLabels } = this.options;
    const cubeMaterials = [
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText(boxLabels.right, HALF_PI),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText(boxLabels.left, -HALF_PI),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText(boxLabels.back, Math.PI),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText(boxLabels.front),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText(boxLabels.top),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText(boxLabels.bottom, Math.PI),
      }),
    ];
    const cube = new THREE.Mesh(boxGeometry, cubeMaterials);
    this.scene.add(cube);

    this.boxes = new THREE.Group();
    clickBoxes.forEach(clickBox => {
      const geometry = new THREE.BoxGeometry(...clickBox.size);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4dc3ff,
        transparent: true,
        opacity: 0,
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(...clickBox.position);
      box.userData = clickBox;
      this.boxes.add(box);
    });
    this.scene.add(this.boxes);

    this.setOrtographicCamera(false);

    this.renderer.render(this.scene, this.camera);
  }

  private getBoxFromPosition = (
    x: number,
    y: number
  ): THREE.Mesh | undefined => {
    const { left, top, width, height } = this.container.getBoundingClientRect();
    const mousePosition = new THREE.Vector2();
    mousePosition.x = ((x - left) / width) * 2 - 1;
    mousePosition.y = -((y - top) / height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, this.camera);
    const intersects = raycaster.intersectObjects(this.boxes.children, true);
    if (intersects.length > 0) {
      return intersects[0].object as THREE.Mesh;
    }

    return undefined;
  };

  private onMouseMove = (e: MouseEvent) => {
    const box = this.getBoxFromPosition(e.clientX, e.clientY);
    let needsRender = false;

    if (this.hoverBox) {
      const material = this.hoverBox.material as THREE.MeshBasicMaterial;
      material.opacity = 0;
      needsRender = true;
    }

    if (box) {
      const material = box.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6;
      this.hoverBox = box;
      needsRender = true;
    }

    if (needsRender) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private onClick = (e: MouseEvent) => {
    const { onChangeCameraAngle } = this.options;

    if (!onChangeCameraAngle) {
      return;
    }

    const box = this.getBoxFromPosition(e.clientX, e.clientY);
    if (box) {
      const clickBox = box.userData as IClickBox;
      onChangeCameraAngle(...clickBox.cameraAngle);
    }
  };

  private getTextureForText(text: string, rotation: number = 0): THREE.Texture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 128;
    canvas.height = 128;

    if (ctx) {
      ctx.font = '20px Roboto,Arial';
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        (text || '').toUpperCase(),
        canvas.width / 2,
        canvas.height / 2
      );
    }

    const texture = new THREE.Texture(canvas);
    texture.center = new THREE.Vector2(0.5, 0.5);
    texture.rotation = rotation;
    texture.needsUpdate = true;
    return texture;
  }
}
