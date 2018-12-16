import Prism, { IPrismParams, IPrismJSON } from "../Prism";
import ObjectsCommon, { OperationsArray, IViewOptions } from "../ObjectsCommon";
import * as THREE from "three";

const sides = 10;
const length = 20;
const height = 30;

let objParams: IPrismParams = {
  sides,
  length,
  height
};
let operations: OperationsArray = [];
let viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

/// CONSTRUCTOR TESTS

test("Prism - Constructor", () => {
  const obj = new Prism(objParams, operations, viewOptions);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.CylinderGeometry);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test("Prism - Constructor - Default Params - ViewOptions", () => {
  const obj = new Prism(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.CylinderGeometry);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test("Prism - Constructor - Default Params - Operations - ViewOptions", () => {
  const obj = new Prism(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.CylinderGeometry);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test("Prism - Constructor - Set Operations - Translation", () => {
  const x = 10;
  const y = 20;
  const z = 30;
  const operations = [ObjectsCommon.createTranslateOperation(x, y, z)];
  const obj = new Prism(objParams, operations);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.position).toEqual({ x, y, z });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test("Prism - Constructor - Set Operations - Rotation", () => {
  const xangle = 45;
  const yangle = 35;
  const zangle = 15;
  const operations = [
    ObjectsCommon.createRotateOperation(xangle, yangle, zangle)
  ];
  const obj = new Prism(objParams, operations);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo((Math.PI * xangle) / 80);
    expect(mesh.rotation.y).toBeCloseTo((Math.PI * yangle) / 180);
    expect(mesh.rotation.z).toBeCloseTo((Math.PI * zangle) / 180);
  });
});

test("Prism - Constructor - set Mesh", async () => {
  const objAux = new Prism(objParams);
  const meshAux = await objAux.getMeshAsync();
  const obj = new Prism(
    objParams,
    operations,
    viewOptions,
    meshAux as THREE.Mesh
  );
  return obj.getMeshAsync().then(mesh => {
    expect(mesh).toBe(meshAux);
  });
});

/// END TESTING CONSTRUCTOR

/// TESTING CUBE.CLONE

test("Prism - Clone - Parameters - Operations - viewOptions", async () => {
  const obj = new Prism(objParams, operations, viewOptions);
  const spy = jest.spyOn((obj as any).mesh, "clone");
  const obj2 = obj.clone();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
  // mesh clone should be called on this instance because obj has NOT been changed
  expect(spy).toBeCalledTimes(1);

  (obj as any).operations = [ObjectsCommon.createTranslateOperation(0, 0, 0)];
  const obj3 = obj.clone();
  // mesh clone should not be called on this instance because obj has been changed
  expect(spy).toBeCalledTimes(1);
});

/// TEST NEW FROM JSON
test("Prism - newFromJSON", async () => {
  const obj = new Prism(objParams, operations, viewOptions);
  const json: IPrismJSON = obj.toJSON() as IPrismJSON;
  const obj2 = Prism.newFromJSON(json);
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
});
