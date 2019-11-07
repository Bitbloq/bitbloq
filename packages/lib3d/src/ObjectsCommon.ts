import { isEqual } from "lodash";

import {
  IObjectsCommonJSON,
  ITranslateOperation,
  IRotateOperation,
  IScaleOperation,
  IMirrorOperation,
  OperationsArray,
  IViewOptions
} from "./Interfaces";

import { v1 } from "uuid";
const uuid = v1;

import * as THREE from "three";
import { setMeshMaterial } from "./Bitbloq";

export default class ObjectsCommon {
  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }

  get meshUpdateRequired(): boolean {
    return this._meshUpdateRequired;
  }

  set pendingOperation(a: boolean) {
    this._pendingOperation = a;
  }

  get pendingOperation(): boolean {
    return this._pendingOperation;
  }

  get computedMesh(): THREE.Group | THREE.Mesh | undefined {
    return this.mesh;
  }

  get viewOptionsUpdateRequired(): boolean {
    return this._viewOptionsUpdateRequired;
  }

  set viewOptionsUpdateRequired(a: boolean) {
    this._viewOptionsUpdateRequired = a;
  }

  public static meshToBufferArray(mesh: THREE.Mesh): ArrayBuffer[] {
    const bufferArray: ArrayBuffer[] = [];

    const geom: THREE.BufferGeometry | THREE.Geometry = mesh.geometry;
    let bufferGeom: THREE.BufferGeometry;

    if (geom instanceof THREE.BufferGeometry) {
      bufferGeom = geom as THREE.BufferGeometry;
    } else {
      bufferGeom = new THREE.BufferGeometry().fromGeometry(
        geom as THREE.Geometry
      );
    }
    const verticesBuffer: ArrayBuffer = new Float32Array(
      bufferGeom.getAttribute("position").array
    ).buffer;
    const normalsBuffer: ArrayBuffer = new Float32Array(
      bufferGeom.getAttribute("normal").array
    ).buffer;
    mesh.updateMatrix();

    const positionBuffer: ArrayBuffer = Float32Array.from(
      mesh.matrixWorld.elements
    ).buffer;

    const localPositionBuffer: ArrayBuffer = Float32Array.from(
      mesh.matrix.elements
    ).buffer;

    bufferArray.push(verticesBuffer);
    bufferArray.push(normalsBuffer);
    bufferArray.push(positionBuffer);
    bufferArray.push(localPositionBuffer);

    return bufferArray;
  }

  public static geometryFromVerticesNormals(
    vertices: number[],
    normals: number[]
  ): THREE.Geometry {
    const _vertices: ArrayLike<number> = new Float32Array(vertices);
    const _normals: ArrayLike<number> = new Float32Array(normals);

    const buffGeometry = new THREE.BufferGeometry();
    buffGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(_vertices, 3)
    );

    buffGeometry.addAttribute("normal", new THREE.BufferAttribute(_normals, 3));

    const objectGeometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(
      buffGeometry
    );

    return objectGeometry;
  }

  public static groupToBufferArray(
    group: THREE.Group,
    numMeshes: { num: number }
  ): ArrayBuffer[] {
    const bufferArray: ArrayBuffer[] = [];

    group.updateWorldMatrix(false, true);

    group.children.forEach(child => {
      const clone: THREE.Object3D = child.clone();
      clone.matrix = child.matrix.clone();
      clone.matrixWorld = child.matrixWorld.clone();

      if (child instanceof THREE.Mesh) {
        numMeshes.num += 1;

        if (child.userData.repetitionObject) {
          clone.matrix.multiply(
            new THREE.Matrix4().getInverse(
              child.userData.originalObject.mesh.matrix
            )
          );

          clone.matrix.decompose(clone.position, clone.quaternion, clone.scale);
        }

        bufferArray.push(
          ...ObjectsCommon.meshToBufferArray(clone as THREE.Mesh)
        );
      } else if (child instanceof THREE.Group) {
        bufferArray.push(...ObjectsCommon.groupToBufferArray(child, numMeshes));
      }
    });

    return bufferArray;
  }

  public static createViewOptions(
    color: string = "#ffffff",
    visible: boolean = true,
    selected: boolean = false,
    name: string = "",
    opacity: number = 100
  ): IViewOptions {
    return {
      color,
      visible,
      selected,
      name,
      opacity
    };
  }

  public static createTranslateOperation(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    relative: boolean = true
  ): ITranslateOperation {
    return {
      x,
      y,
      z,
      relative,
      type: "translation",
      id: uuid()
    };
  }

  public static createMirrorOperation(
    plane: string = "yz" // xy, yz, zx
  ): IMirrorOperation {
    return {
      plane,
      type: "mirror",
      id: uuid()
    };
  }

  public static createRotateOperation(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    relative: boolean = true
  ): IRotateOperation {
    return {
      x,
      y,
      z,
      relative,
      type: "rotation",
      id: uuid()
    };
  }

  public static createScaleOperation(
    x: number = 1,
    y: number = 1,
    z: number = 1
  ): IScaleOperation {
    return {
      x,
      y,
      z,
      type: "scale",
      id: uuid()
    };
  }
  public meshPromise: Promise<THREE.Mesh | THREE.Group> | null;
  public userData: { [key: string]: any };

  protected operations: OperationsArray;
  protected _pendingOperation: boolean;
  protected _meshUpdateRequired: boolean;
  protected viewOptions: IViewOptions;
  protected id: string;
  protected type: string;
  protected _viewOptionsUpdateRequired: boolean;
  protected parent: ObjectsCommon | undefined;
  protected mesh: THREE.Mesh | THREE.Group;

  constructor(
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    operations: OperationsArray = []
  ) {
    this._pendingOperation = false;
    this._meshUpdateRequired = false;
    this.setOperations(operations);
    this.setViewOptions(viewOptions);
    // each new object must have a new ID
    if (this.id !== "") {
      this.id = uuid();
    }
    this.parent = undefined;
  }

  public setMaterial(material: object) {
    setMeshMaterial(this.mesh, material);
  }

  public async getMeshAsync(): Promise<THREE.Mesh | THREE.Group> {
    if (this.meshPromise) {
      this.mesh = await this.meshPromise;
      this.meshPromise = null;
      return this.mesh;
    }

    return this.mesh;
  }

  public async computeMeshAsync(): Promise<THREE.Mesh | THREE.Group> {
    throw new Error("Object3D.computeMeshAsync() implemented on children");
  }

  public setParent(object: ObjectsCommon): void {
    this.parent = object;
  }

  public removeParent() {
    this.parent = undefined;
  }

  public getParent(): ObjectsCommon | undefined {
    return this.parent;
  }

  public getID() {
    return this.id;
  }

  public getOperations(): OperationsArray {
    return this.operations;
  }

  public addOperations(operations: OperationsArray = []): void {
    this.setOperations([...this.operations, ...operations]);
  }

  public scale(x: number, y: number, z: number): void {
    this.addOperations([ObjectsCommon.createScaleOperation(x, y, z)]);
  }

  public mirror(plane: string): void {
    this.addOperations([ObjectsCommon.createMirrorOperation(plane)]);
  }

  public setViewOptions(params: Partial<IViewOptions>) {
    if (!isEqual(params, this.viewOptions)) {
      this.viewOptions = {
        ...ObjectsCommon.createViewOptions(),
        ...this.viewOptions,
        ...params
      };
      this._viewOptionsUpdateRequired = true;
    }
  }

  public getViewOptions(): IViewOptions {
    return this.viewOptions;
  }

  public clone(): ObjectsCommon {
    throw new Error("ObjectsCommon.clone() Implemented in children");
  }

  public getTypeName(): string {
    return this.type;
  }

  public toJSON(): IObjectsCommonJSON {
    const json: IObjectsCommonJSON = {
      id: this.id,
      type: this.type,
      viewOptions: this.viewOptions,
      operations: this.operations
    };

    return json;
  }

  public updateFromJSON(
    object: IObjectsCommonJSON,
    fromParent: boolean = false,
    forceUpdate: boolean = false
  ): void {
    throw new Error("updateFromJSON() Implemented in children");
  }

  public setOperations(operations: OperationsArray = []): void {
    if (!this.operations || this.operations.length === 0) {
      this.operations = [...operations];
      if (operations.length > 0) {
        this.pendingOperation = true;
      }
      return;
    }

    if (!isEqual(this.operations, operations)) {
      this.operations = [...operations];
      this.pendingOperation = true;
    }

    this.pendingOperation =
      this.pendingOperation || !isEqual(this.operations, operations);
  }

  protected translate(
    x: number,
    y: number,
    z: number,
    relative: boolean = false
  ): void {
    this.addOperations([
      ObjectsCommon.createTranslateOperation(x, y, z, relative)
    ]);
  }

  protected rotateX(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation(angle, 0, 0, relative)
    ]);
  }

  protected rotateY(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation(0, angle, 0, relative)
    ]);
  }

  protected rotateZ(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation(0, 0, angle, relative)
    ]);
  }
}
