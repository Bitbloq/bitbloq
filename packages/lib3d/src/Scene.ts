/*
 * File: Scene.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from 'three';
import { isArray } from 'util';
import BaseGrid from './BaseGrid';
import Union from './Union';
import Difference from './Difference';
import Intersection from './Intersection';
import CompoundObject from './CompoundObject';
import ObjectsCommon from './ObjectsCommon';

import ObjectsGroup from './ObjectsGroup';
import RepetitionObject from './RepetitionObject';

import { isEqual } from 'lodash';

import ObjectFactory from './ObjectFactory';
import PositionCalculator from './PositionCalculator';
import meshArray2STLAsync from './STLExporter';
import OperationHelper from './OperationHelper';

import {
  IGeometry,
  ICompoundObjectJSON,
  IObjectsCommonJSON,
  IRepetitionObjectJSON,
  IObjectsGroupJSON,
  OperationsArray,
} from './Interfaces';
import { setMeshMaterial, MeshOperations } from './Bitbloq';

enum HelperType {
  Rotation = 'rotation',
  Translation = 'translation',
}
enum HelperAxis {
  X = 'x',
  Y = 'y',
  Z = 'z',
}
export interface IHelperDescription {
  type: HelperType;
  object: IObjectsCommonJSON;
  axis: HelperAxis;
  relative: boolean;
  id: string;
}

export interface IObjectPosition {
  position: {
    x: number;
    y: number;
    z: number;
  };
  angle: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

interface ISceneSetup {
  base: THREE.Group;
  ambientLight: THREE.AmbientLight;
  spotLight: THREE.SpotLight;
  spotLight2: THREE.SpotLight;
}

export type ISceneJSON = IObjectsCommonJSON[];

export default class Scene {
  public static newFromJSON(json: ISceneJSON, geometries?: IGeometry[]): Scene {
    const scene = new Scene();

    if (geometries) {
      scene.setGeometries(geometries);
    }

    try {
      json.forEach(obj => {
        scene.addNewObjectFromJSON(obj, true);
      });
    } catch (e) {
      throw new Error(`Error creating Scene. ${e}`);
    }

    // set clear history
    scene.history = [json];
    scene.historyIndex = 0;

    return scene;
  }

  private geometries: IGeometry[];
  private sceneSetup: ISceneSetup;
  private objectCollector: ObjectsCommon[]; /// all objects designed by user - including children
  private objectsInScene: ObjectsCommon[]; /// all parent objects designed by user -> to be 3D-drawn.
  private helpers: THREE.Group[];
  private history: ISceneJSON[]; /// history of actions
  private lastUpdateTS: number; /// last update. Used to know if action should be added to history

  private objectsGroup: THREE.Group;
  private historyIndex: number;
  private sceneUpdated: boolean;

  private objectsInTransition: ObjectsCommon[];

  private anySelectedObjects: boolean;
  private selectedMaterial: object;
  private secondaryMaterial: object;
  private normalMaterial: object;
  private transitionMaterial: object;

  constructor() {
    this.anySelectedObjects = false;
    this.objectCollector = [];
    this.objectsInScene = [];
    this.objectsInTransition = [];
    this.setupScene();
    this.objectsGroup = new THREE.Group();
    this.historyIndex = -1;
    this.history = [];
    this.setMaterials();
    this.lastUpdateTS = 0;
    this.geometries = [];
  }

  public setGeometries(geometries: IGeometry[]): void {
    this.geometries = geometries;
  }

  /**
   * Returns array geometry data (vertices and normals) of Compound Objets
   * If array has changed (including objects order) it returns a new reference
   * If array is unchanged it reamins same reference
   */
  public getGeometries(): IGeometry[] {
    const aux: IGeometry[] = [];
    this.objectCollector.forEach(object => {
      if (object instanceof CompoundObject) {
        aux.push(object.getGeometryData());
      }
    });

    if (aux.length !== this.geometries.length) {
      this.geometries = aux;
    }

    for (let i = 0; i < aux.length; i += 1) {
      if (aux[i] !== this.geometries[i]) {
        this.geometries = aux;
        break;
      }
    }

    return this.geometries;
  }

  public canUndo(): boolean {
    return this.historyIndex >= 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  public async exportToSTLAsync(
    name: string = 'scene',
    separateSTL: boolean = true
  ): Promise<void> {
    // update secene objectsGroup if required
    if (this.sceneUpdated) {
      this.objectsGroup = new THREE.Group();

      const objects3D: THREE.Object3D[] = await Promise.all(
        this.objectsInScene.map(async object => {
          const mesh = await object.getMeshAsync();
          return mesh;
        })
      );

      objects3D.forEach(mesh => {
        this.objectsGroup.add(mesh);
      });
    }

    // all meshes into a single STL
    if (!separateSTL) {
      const objects: ObjectsCommon[] = this.objectsInScene.map(object =>
        object.clone()
      );
      const union = new Union(objects);
      const mesh: THREE.Mesh = (await union.getMeshAsync()) as THREE.Mesh;
      mesh.userData = {
        ...mesh.userData,
        viewOptions: { name },
      };
      meshArray2STLAsync([mesh], name);
    } else {
      // each mesh will be a single stl
      // create array of meshes
      let meshArray: THREE.Mesh[] = [];
      this.objectsGroup.children.forEach(child => {
        meshArray = [...meshArray, ...this.toMeshArray(child)];
      });
      meshArray2STLAsync(meshArray, name);
    }

    return;
  }

  // Deshace la última operación y devuelve la escena después de deshacer
  public undo(): ISceneJSON {
    if (this.canUndo()) {
      this.historyIndex -= 1;
      // there was only one operation, so, clear de scene
      if (this.historyIndex < 0) {
        this.objectsInScene = [];

        return this.toJSON();
      }

      const sceneJSON = this.history[this.historyIndex];
      this.setHistorySceneFromJSON(sceneJSON);

      return sceneJSON;
    }

    throw new Error('Cannot undo');
  }

  // Rehace la última operación y devuelve la escena después de rehacer
  public redo(): ISceneJSON {
    if (this.canRedo()) {
      this.historyIndex += 1;
      const sceneJSON = this.history[this.historyIndex];
      this.setHistorySceneFromJSON(sceneJSON);

      return sceneJSON;
    }
    throw new Error('Cannot redo');
  }

  /**
   * Returns the Scene JSON descriptor: Array of Objects.
   * It only contains designed by user objects.
   * It does not contain helpers, plane, etc.
   */
  public toJSON(): ISceneJSON {
    // return this.objectsInScene.map(object => cloneDeep(object.toJSON()));
    return this.objectsInScene.map(object => object.toJSON());
  }

  /**
   * Scene lights and basegrid
   */
  public getSceneSetup(): THREE.Group {
    const group: THREE.Group = new THREE.Group();

    group.add(this.sceneSetup.ambientLight);
    group.add(this.sceneSetup.spotLight);
    group.add(this.sceneSetup.spotLight2);
    group.add(this.sceneSetup.base);

    return group;
  }

  /**
   * returns a THREE.Group object containing designed 3D objects .
   */
  public async getObjectsAsync(): Promise<THREE.Group> {
    if (!this.sceneUpdated) {
      return this.objectsGroup;
    }

    this.testPoint();

    this.objectsGroup = new THREE.Group();

    const meshes: THREE.Object3D[] = await Promise.all(
      this.objectsInScene.map(async object => {
        const mesh = await object.getMeshAsync();

        if (this.anySelectedObjects) {
          // if object is selected highlight
          if (object.getViewOptions().selected) {
            if (mesh instanceof THREE.Mesh) {
              if (mesh.material instanceof THREE.MeshLambertMaterial) {
                mesh.material.setValues(this.selectedMaterial);
              }
            }
          } else {
            if (mesh instanceof THREE.Mesh) {
              if (mesh.material instanceof THREE.MeshLambertMaterial) {
                mesh.material.setValues(this.secondaryMaterial);
              }
            }
          }
        } else {
          if (mesh instanceof THREE.Mesh) {
            if (mesh.material instanceof THREE.MeshLambertMaterial) {
              mesh.material.setValues(this.normalMaterial);
            }
          }
        }

        mesh.userData = {
          ...mesh.userData,
          ...object.toJSON(),
        };
        return mesh;
      })
    );

    meshes.forEach(mesh => {
      this.objectsGroup.add(mesh);
    });

    this.sceneUpdated = false;
    return this.objectsGroup;
  }

  public async getObjectInTransitionAsync(): Promise<THREE.Group | undefined> {
    if (this.objectsInTransition.length > 0) {
      const group: THREE.Group = new THREE.Group();
      this.objectsInTransition.forEach(async object => {
        const parent = object.getParent();
        object.setMaterial(this.secondaryMaterial);
        if (
          parent instanceof CompoundObject &&
          parent.getChildren()[0].getID() !== object.getID()
        ) {
          const mesh:
            | THREE.Mesh
            | THREE.Group = (await object.getMeshAsync()).clone();

          setMeshMaterial(mesh, this.secondaryMaterial);

          const pos = await this.getPositionAsync(object.toJSON());
          if (mesh instanceof THREE.Mesh) {
            mesh.position.set(pos.position.x, pos.position.y, pos.position.z);
            mesh.setRotationFromEuler(
              new THREE.Euler(
                (pos.angle.x * Math.PI) / 180,
                (pos.angle.y * Math.PI) / 180,
                (pos.angle.z * Math.PI) / 180
              )
            );
            mesh.scale.set(
              pos.scale.x * 1.01,
              pos.scale.y * 1.01,
              pos.scale.z * 1.01
            );
            group.add(mesh);
          }
        } else if (
          parent instanceof CompoundObject &&
          parent.getChildren()[0].getID() === object.getID()
        ) {
          const childMesh: THREE.Mesh = (object as any).mesh.clone();
          childMesh.position.set(0, 0, 0);
          childMesh.rotation.set(0, 0, 0);
          childMesh.scale.set(1, 1, 1);
          let aux: ObjectsCommon | undefined = object;

          // go to the bottom of the objects tree
          while (aux instanceof CompoundObject) {
            aux = aux.getChildren()[0];
          }
          let operations: OperationsArray = [];
          // rebuild operations from the bottom to the top
          while (aux) {
            operations = [...aux.getOperations(), ...operations];
            aux = aux.getParent();
          }
          // apply operations to mesh
          MeshOperations.applyOperations(childMesh, operations);

          setMeshMaterial(childMesh, this.secondaryMaterial);
          group.add(childMesh);
        }
      });

      return group;
    }
    return undefined;
  }

  /**
   * Adds object to Scene and ObjectCollector. It creates a new object and assings a new id
   * @param json object descriptor (it ignores id)
   * @param createNew  . If true, children of objects are created. If false, children must be already in scene
   * UPDATES HISTORY
   */
  public addNewObjectFromJSON(
    json: IObjectsCommonJSON,
    createNew: boolean = false
  ): ISceneJSON {
    // if createNew children of objects do not exist on scene
    if (createNew) {
      try {
        if (
          [
            Union.typeName,
            Difference.typeName,
            Intersection.typeName,
            RepetitionObject.typeName,
            ObjectsGroup.typeName,
          ].includes(json.type)
        ) {
          // Add the children
          (json as
            | ICompoundObjectJSON
            | IObjectsGroupJSON
            | IRepetitionObjectJSON).children.forEach(
            childJSON => this.addNewObjectFromJSON(childJSON, true) // children are new
          );

          // Add de Compound | Group | Repetition parent

          // if compound object check if we already have the geometry computed
          if (
            [
              Union.typeName,
              Difference.typeName,
              Intersection.typeName,
            ].includes(json.type)
          ) {
            for (const geom of this.geometries) {
              if (geom.id === json.id) {
                json.geometry = {
                  id: geom.id,
                  vertices: geom.vertices,
                  normals: geom.normals,
                };
                break;
              }
            }
          }

          this.addNewObjectFromJSON(json, false); // children already in Scene
        } else {
          const object: ObjectsCommon = ObjectFactory.newFromJSON(json, this);
          this.addExistingObject(object);
        }
      } catch (e) {
        throw new Error(`Cannot add new Object from JSON ${e}`);
      }

      return this.toJSON();
    }
    // children should be already in scene
    else {
      try {
        const object: ObjectsCommon = ObjectFactory.newFromJSON(json, this);
        this.addExistingObject(object);
        this.updateHistory();

        return this.toJSON();
      } catch (e) {
        throw new Error(`Cannot add new Object from JSON ${e}`);
      }
    }
  }

  /**
   *
   * @param jsonArray Objects to mark as selected
   */
  public selectedObjects(jsonArray: IObjectsCommonJSON[]): ISceneJSON {
    // Deselect all objects
    this.anySelectedObjects = false;
    this.objectCollector.forEach(obj => {
      obj.setViewOptions({ selected: false });
    });

    // Select chosen array of objects
    jsonArray.forEach(json => {
      if (!this.objectInObjectCollector(json)) {
        throw new Error(`Object not present in ObjectCollector ${json.id}`);
      }
      const obj = this.getObject(json);
      let parent: ObjectsCommon | undefined = obj.getParent();
      if (parent) {
        // mark as selected the parents
        while (parent) {
          parent.setViewOptions({
            selected: true,
          });
          parent = parent.getParent();
        }
      } else {
        obj.setViewOptions({ selected: true });
      }
      this.anySelectedObjects = true;
    });

    // this.updateHistory();
    this.sceneUpdated = true;
    return this.toJSON();
  }

  /**
   * Clones an object and adds it to the scene (and objectCollector).
   * If object is not in Scene throws Erro
   * @param json object to be cloned
   * UPDATES HISTORY
   */
  public cloneOject(json: IObjectsCommonJSON): ISceneJSON {
    if (this.objectInScene(json)) {
      const obj = this.getObject(json);
      const newobj = obj.clone();
      newobj.setViewOptions(json.viewOptions);
      this.addExistingObject(newobj);
      this.updateHistory();

      return this.toJSON();
    }
    throw new Error('Cannot clone unknown object');
  }

  /**
   * Removes Object from both Scene and ObjectCollector.
   * If object is not present is does NOT anything.
   * @param json json object descriptor (only id is important)
   * UPDATES HISTORY
   */
  public removeObject(obj: IObjectsCommonJSON): ISceneJSON {
    try {
      this.removeFromScene(obj);
      // this.removeFromObjectCollector(obj);
    } catch (e) {
      throw new Error(`Cannot Remove Object from Scene: ${e}`);
    }

    this.updateHistory();
    return this.toJSON();
  }

  /**
   * Returns a reference to the specified Object
   * @param obj Object descriptor to retreive
   */
  public getObject(obj: IObjectsCommonJSON): ObjectsCommon {
    const id = obj.id;
    const foundObj = this.objectCollector.find(object => object.getID() === id);
    if (!foundObj) {
      throw new Error(`Scene.getObject(). Object ${id} not found`);
    }

    return foundObj;
  }

  /**
   * Updates object if its present on the objects collector.
   * If not it triggers an error exception.
   * @param json json describing object
   * UPDATES HISTORY
   */
  public updateObject(
    objJSON: IObjectsCommonJSON,
    updateHistory: boolean = true
  ): ISceneJSON {
    try {
      const object = this.getObject(objJSON);

      if (isEqual(objJSON, object.toJSON())) {
        return this.toJSON();
      }

      object.updateFromJSON(objJSON);

      // Objects in Transition
      this.objectsInTransition = [];
      const parent = object.getParent();
      if (parent instanceof CompoundObject) {
        let aux: ObjectsCommon | undefined = parent;

        // We are going to check if all the tree up is CompoundObject.
        // If any parent on the tree-up is not Compound, we do not make Ghost
        while (aux instanceof CompoundObject) {
          aux = aux.getParent();
        }

        // this means we are on the top of the tree and its CompoundObject
        if (!aux) {
          if (parent.getChildren()[0].getID() === object.getID()) {
            this.objectsInTransition.push(object);
          } else {
            this.objectsInTransition.push(object);
          }
        }
      }

      if (updateHistory) {
        this.updateHistory();
      }
      return this.toJSON();
    } catch (e) {
      throw new Error(`Cannot update Object ${e}`);
    }
  }

  /**
   *
   * @param json object descriptor
   */
  public async getPositionAsync(
    json: IObjectsCommonJSON
  ): Promise<IObjectPosition> {
    try {
      const obj = this.getObject(json);
      return new PositionCalculator(obj).getPositionAsync();
    } catch (e) {
      throw new Error(`Cannot find object: ${e}`);
    }
  }

  public getLocalPosition(json: IObjectsCommonJSON): IObjectPosition {
    try {
      const obj = this.getObject(json);
      const position = new PositionCalculator(obj);
      return position.getLocalPosition();
    } catch (e) {
      throw new Error(`Cannot find object: ${e}`);
    }
  }

  /**
   * Undoes Repetion, Composition and Groups
   * @param json Object descriptor
   * UPDATES HISTORY
   */
  public undoObject(json: IObjectsCommonJSON): ISceneJSON {
    switch (json.type) {
      case RepetitionObject.typeName:
        this.undoRepetition(json as IRepetitionObjectJSON);
        break;
      case ObjectsGroup.typeName:
        this.unGroup(json as IObjectsGroupJSON);
        break;
      case Union.typeName:
      case Difference.typeName:
      case Intersection.typeName:
        this.undoCompound(json as ICompoundObjectJSON);
        break;
      default:
        throw new Error(`Cannot undo object type ${json.type}`);
    }

    this.updateHistory();
    return this.toJSON();
  }

  public convertToGroup(json: IObjectsCommonJSON): ISceneJSON {
    if (json.type === RepetitionObject.typeName) {
      this.repetitionToGroup(json as IRepetitionObjectJSON);
      this.updateHistory();
      return this.toJSON();
    }
    throw new Error(`Cannot Convert ${json.type} to Group`);
  }

  // Establece el helper que debe mostrarse en la vista 3d
  // Si no se le pasa ningún parámetro entonces no mostrar ninguno
  public async setActiveHelperAsync(
    helperDescription?: IHelperDescription
  ): Promise<THREE.Group[]> {
    this.helpers = [];
    if (!helperDescription) {
      return this.helpers;
    }

    const { type, object, axis, relative, id } = helperDescription;
    try {
      const obj = this.getObject(object);
      const helper = new OperationHelper(obj, type, axis, relative, id);
      const helperMesh = await helper.getHelperMeshAsync();
      this.helpers.push(helperMesh);
      return this.helpers;
    } catch (e) {
      throw new Error(`Unable to make helper: ${e}`);
    }
  }

  public testPoint(): void {
    const a = 2;
  }

  private addExistingObject(object: ObjectsCommon): ISceneJSON {
    if (this.objectInObjectCollector(object.toJSON())) {
      throw Error('Object already in Scene');
    } else {
      // In case the object has children, they must be removed from BitbloqScene (remain in ObjectCollector)
      if (object instanceof CompoundObject) {
        this.addExistingCompound(object);
      } else if (object instanceof ObjectsGroup) {
        this.addExistingGroup(object);
      } else if (object instanceof RepetitionObject) {
        this.addExistingRepetition(object);
      }

      // finally, add object to scene and collector
      this.objectsInScene.push(object);
      this.objectCollector.push(object);
    }
    return this.toJSON();
  }

  private setHistorySceneFromJSON(json: ISceneJSON): void {
    this.objectsInScene = [];
    try {
      json.forEach(jsonObj => {
        const obj = this.getObject(jsonObj);
        obj.updateFromJSON(jsonObj);
        this.objectsInScene.push(obj);
      });
    } catch (e) {
      throw new Error(`Cannot set history scene ${e}`);
    }
  }

  /**
   * Remove a repetition object and places the original object (unchanged) in the Scene
   * @param json object descriptor
   */
  private undoRepetition(json: IRepetitionObjectJSON): ISceneJSON {
    try {
      if (json.type !== RepetitionObject.typeName) {
        throw new Error(`Not Repetition Object: ${json.type}`);
      }

      if (!this.objectInScene(json)) {
        throw new Error(`Object ${json.id} not present in Scene`);
      }

      // Add original to Scene
      const original = (this.getObject(json) as RepetitionObject).getOriginal();

      if (this.objectInObjectCollector(original.toJSON())) {
        this.objectsInScene.push(original);
        original.removeParent();
      } else {
        throw new Error(
          `Unexepected Error. Object ${original.getID()} not in Object Collector`
        );
      }

      // Remove from Scene Repetiton Object
      // this.removeFromObjectCollector(json);
      this.removeFromScene(json);

      return this.toJSON();
    } catch (e) {
      throw new Error(`Repetion Cannot be Undone ${e}`);
    }
  }
  /**
   * It removes the CompoundObject from Scene and ObjectCollector.
   * It adds the children to the Scene
   * @param json CompoundObject Descriptor. It only pays attention to id.
   */
  private undoCompound(json: ICompoundObjectJSON): ISceneJSON {
    try {
      if (
        ![Union.typeName, Difference.typeName, Intersection.typeName].includes(
          json.type
        )
      ) {
        throw new Error(`Not a Compound object. ${json.type}`);
      }

      if (!this.objectInScene(json)) {
        throw new Error(`Object ${json.id} not present in Scene`);
      }

      // this.removeFromObjectCollector(json);
      this.removeFromScene(json);

      json.children.forEach(childJSON => {
        if (this.objectInObjectCollector(childJSON)) {
          const obj = this.getObject(childJSON);
          obj.removeParent();
          this.objectsInScene.push(obj);
        } else {
          throw new Error(
            `Unexepected Error. Object ${childJSON.id} not in Object Collector`
          );
        }
      });
    } catch (e) {
      throw new Error(`undoCompoundError ${e}`);
    }
    return this.toJSON();
  }

  /**
   * It removes the ObjectsGroup from Scene and ObjectCollector.
   * It adds the members of the group to de Scene.
   * @param json group object descriptor (it only pays attention to id)
   */
  private unGroup(json: IObjectsGroupJSON): ISceneJSON {
    try {
      const group = this.getObject(json);
      if (!(group instanceof ObjectsGroup)) {
        throw new Error(`Object is not a group`);
      }
      const objects: ObjectsCommon[] = (group as ObjectsGroup).unGroup();
      // add the members of the group to the Scene
      objects.forEach(object => {
        this.objectsInScene.push(object);
        object.removeParent();
      });

      // remove ObjectsGroups from Scene and ObjectCollector
      return this.removeFromScene(json);
    } catch (e) {
      throw new Error(`Cannog ungroup. Unknown group ${e}`);
    }
  }

  /**
   * It removes RepetitionObject from Scene and ObjectCollector.
   * It transform the RepetitionObject to a ObjectsGroup and add it to the Scene and ObjectCollector.
   * @param json RepetitionObject descriptor. It only pays attention to id
   */
  private repetitionToGroup(json: IRepetitionObjectJSON): ISceneJSON {
    try {
      const rep = this.getObject(json);
      if (!(rep instanceof RepetitionObject)) {
        throw new Error(`Object is not a RepetitionObject`);
      }

      const objects: ObjectsCommon[] = (rep as RepetitionObject)
        .getGroup()
        .unGroup();

      const group: ObjectsGroup = new ObjectsGroup(objects);

      // add new group to scene
      this.addExistingObject(group);

      // remove original object in repetion from ObjectCollector
      const original = rep.getOriginal();
      this.removeFromObjectCollector(original.toJSON());

      // remove ObjectsGroups from Scene and ObjectCollector
      this.removeFromObjectCollector(json);
      this.removeFromScene(json);
    } catch (e) {
      throw new Error(`Cannot ungroup. Unknown Object ${e}`);
    }

    return this.toJSON();
  }

  private updateHistory(): void {
    this.sceneUpdated = true;
    const currentTime: number = new Date().getTime() / 1000;
    if (currentTime - this.lastUpdateTS < 1) {
      return;
    }
    this.lastUpdateTS = currentTime;
    const sceneJSON = this.toJSON();
    // Add to history
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(sceneJSON);
    this.historyIndex = this.history.length - 1;
  }

  private setMaterials(): void {
    this.selectedMaterial = {
      opacity: 1,
      transparent: false,
    };

    this.secondaryMaterial = {
      opacity: 0.5,
      transparent: true,
    };

    this.normalMaterial = {
      opacity: 1,
      transparent: false,
    };

    this.transitionMaterial = {
      opacity: 0.8,
      transparent: true,
    };
  }
  /**
   * Adds floor and lights.
   */
  private setupScene(): void {
    // @David , esto debería ir en algún sitio de opciones de configuracion
    const gridConfig = {
      size: 200,
      smallGrid: {
        enabled: true,
        step: 2,
        color: 0xededed,
        lineWidth: 1,
      },
      bigGrid: {
        enabled: true,
        step: 10,
        color: 0xcdcdcd,
        lineWidth: 2,
      },
      centerGrid: {
        enabled: true,
        color: 0x9a9a9a,
        lineWidth: 2,
      },
      plane: {
        enabled: false,
        color: 0x98f5ff,
      },
    };

    this.sceneSetup = {
      base: new BaseGrid(gridConfig).getMesh(),
      ambientLight: new THREE.AmbientLight(0x666666),
      spotLight: new THREE.SpotLight(0xdddddd),
      spotLight2: new THREE.SpotLight(0xbbbbbb),
    };

    this.sceneSetup.spotLight.position.set(80, -100, 60);
    this.sceneSetup.spotLight2.position.set(-160, 200, -120);
  }

  /**
   * Checks if object is present in ObectCollector Array
   * @param json object descriptor
   */
  private objectInObjectCollector(json: IObjectsCommonJSON): boolean {
    const obj = this.objectCollector.find(elem => elem.getID() === json.id);
    if (obj) {
      return true;
    }

    return false;
  }

  /**
   * Checks if object is present in Scene array
   * @param json object descriptor
   */
  private objectInScene(json: IObjectsCommonJSON): boolean {
    const obj = this.objectsInScene.find(elem => elem.getID() === json.id);
    if (obj) {
      return true;
    }
    return false;
  }

  /**
   * Removes Object or Array of Objects from objectCollector array
   * @param json Object or Array of objects
   */
  private removeFromObjectCollector(
    json: ISceneJSON | IObjectsCommonJSON
  ): ISceneJSON {
    if (isArray(json)) {
      json.forEach(obj => this.removeFromObjectCollector(obj));
    } else {
      if (!this.objectInObjectCollector(json)) {
        throw new Error(`Object id ${json.id} not present in Scene`);
      }
      this.objectCollector = this.objectCollector.filter(
        obj => obj.getID() !== json.id
      );
    }

    return this.toJSON();
  }

  /**
   * Removes Object or Array of Objects from BitbloqScene array
   * @param json Object or Array of objects
   */
  private removeFromScene(json: ISceneJSON | IObjectsCommonJSON): ISceneJSON {
    if (isArray(json)) {
      json.forEach(obj => this.removeFromScene(obj));
    } else {
      if (!this.objectInScene(json)) {
        throw new Error(`Object id ${json.id} not present in Scene`);
      }
      this.objectsInScene = this.objectsInScene.filter(
        obj => obj.getID() !== json.id
      );
    }

    return this.toJSON();
  }

  private addExistingCompound(object: CompoundObject): void {
    const children = object.getChildren();
    children.forEach(child => {
      const obj = child.toJSON();
      if (this.objectInScene(obj)) {
        this.removeFromScene(obj);
      }

      // relaxed condition. Children should be in objectCollector,
      // but just in case they are not we add them
      if (!this.objectInObjectCollector(obj)) {
        this.addExistingObject(child);
        this.removeFromScene(obj);
      }
    });
  }

  private addExistingGroup(object: ObjectsGroup): void {
    const children = object.getChildren();
    children.forEach(child => {
      const obj = child.toJSON();
      if (this.objectInScene(obj)) {
        this.removeFromScene(obj);
      }

      // relaxed condition. Children should be in objectCollector,
      // but just in case they are not we add them
      if (!this.objectInObjectCollector(obj)) {
        this.addExistingObject(child);
        this.removeFromScene(obj);
      }
    });
  }

  private addExistingRepetition(object: RepetitionObject): void {
    const original = object.getOriginal();
    const obj = original.toJSON();
    if (this.objectInScene(obj)) {
      this.removeFromScene(obj);
    }

    // relaxed condition. Children should be in objectCollector,
    // but just in case they are not we add them
    if (!this.objectInObjectCollector(obj)) {
      this.addExistingObject(original);
      this.removeFromScene(obj);
    }
  }

  private toMeshArray(object: THREE.Object3D): THREE.Mesh[] {
    if (object instanceof THREE.Mesh) {
      return [object];
    }

    if (object instanceof THREE.Group) {
      let result: THREE.Mesh[] = [];
      object.children.forEach(child => {
        result = [...result, ...this.toMeshArray(child)];
      });
      return result;
    }

    throw new Error(`Unknown object type`);
  }
}
