import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import * as THREE from 'three';
import ObjectFactory from './ObjectFactory';
import { isArray } from 'util';
import ObjectsGroup, { IObjectsGroupJSON } from './ObjectsGroup';
import RepetitionObject, { IRepetitionObjectJSON } from './RepetitionObject';
import { ICompoundObjectJSON } from './CompoundObject';
import BaseGrid from './BaseGrid';
import PrimitiveObject from './PrimitiveObject';
import CompoundObject from './CompoundObject';

import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import Union from './Union';
import Intersection from './Intersection';
import Difference from './Difference';
import TranslationHelper from './TranslationHelper';
import RotationHelper from './RotationHelper';
import { type } from 'os';
import Object3D from './Object3D';
import { matchPath } from 'react-router';

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
}

export type ISceneJSON = Array<IObjectsCommonJSON>;

export default class Scene {
  // TODO. Need to create children before of creating objects!!
  public static newFromJSON(json: ISceneJSON): Scene {
    const scene = new Scene();
    try {
      scene.updateSceneFromJSON(json);
    } catch (e) {
      throw new Error(`Error creating Scene. ${e}`);
    }

    return scene;
  }

  private sceneSetup: ISceneSetup;
  private objectCollector: Array<ObjectsCommon>; /// all objects designed by user - including children
  private objectsInScene: Array<ObjectsCommon>; /// all parent objects designed by user -> to be 3D-drawn.
  private helpers: Array<THREE.Group>;
  private history: Array<ISceneJSON>; /// history of actions

  private lastJSON: object;
  private objectsGroup: THREE.Group;
  private historyIndex: number;

  constructor() {
    this.objectCollector = [];
    this.objectsInScene = [];
    this.setupScene();
    this.objectsGroup = new THREE.Group();
    this.lastJSON = this.toJSON();
    this.historyIndex = 0;
    this.history = [];
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex > this.history.length - 1;
  }

  /**
   * Returns the Scene JSON descriptor: Array of Objects.
   * It only contains designed by user objects.
   * It does not contain helpers, plane, etc.
   */
  public toJSON(): ISceneJSON {
    return this.objectsInScene.map(object => cloneDeep(object.toJSON()));
  }

  /**
   * Updates all the objects in a Scene, if object is not present. It adds it.
   * @param json json describin all the objects of the Scene
   */
  public updateSceneFromJSON(json: ISceneJSON): ISceneJSON {
    if (isEqual(json, this.toJSON())) return json;

    json.forEach(obj => {
      if (this.objectInScene(obj)) this.getObject(obj).updateFromJSON(obj);
      else throw new Error(`Object id ${obj.id} not present in Scene`);
    });
    return this.toJSON();
  }

  /**
   * Scene lights and basegrid
   */
  public getSceneSetup(): THREE.Group {
    const group: THREE.Group = new THREE.Group();

    group.add(this.sceneSetup.ambientLight);
    group.add(this.sceneSetup.spotLight);
    group.add(this.sceneSetup.base);

    return group;
  }

  public getHelpers(): THREE.Group {
    const group: THREE.Group = new THREE.Group();

    //TODO

    return group;
  }

  /**
   * returns a THREE.Group object containing designed 3D objects .
   */
  public async getObjectsAsync(): Promise<THREE.Group> {
    debugger;
    if (isEqual(this.lastJSON, this.toJSON())) return this.objectsGroup;

    this.objectsGroup = new THREE.Group();

    const meshes: Array<THREE.Object3D> = await Promise.all(
      this.objectsInScene.map(async object => {
        const mesh = await object.getMeshAsync();
        mesh.userData = object.toJSON();
        return mesh;
      }),
    );

    meshes.forEach(mesh => {
      this.objectsGroup.add(mesh);
    });

    this.lastJSON = this.toJSON();
    return this.objectsGroup;
  }

  /**
   * Adds floor and lights.
   */
  private setupScene(): void {
    //@David , esto debería ir en algún sitio de opciones de configuracion
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
      ambientLight: new THREE.AmbientLight(0x555555),
      spotLight: new THREE.SpotLight(0xeeeeee),
    };

    this.sceneSetup.spotLight.position.set(80, -100, 60);
  }

  /**
   * Adds object to Scene and ObjectCollector. It creates a new object and assings a new id
   * @param json object descriptor (it ignores id)
   */
  public addNewObjectFromJSON(json: IObjectsCommonJSON): ISceneJSON {
    try {
      const object: ObjectsCommon = ObjectFactory.newFromJSON(json, this);
      return this.addExistingObject(object);
    } catch (e) {
      throw new Error(`Cannot add new Object from JSON ${e}`);
    }
  }

  /**
   * Checks if object is present in ObectCollector Array
   * @param json object descriptor
   */
  private objectInObjectCollector(json: IObjectsCommonJSON): boolean {
    const obj = this.objectCollector.find(elem => elem.getID() === json.id);
    if (obj) return true;
    else return false;
  }

  /**
   * Checks if object is present in Scene array
   * @param json object descriptor
   */
  private objectInScene(json: IObjectsCommonJSON): boolean {
    const obj = this.objectsInScene.find(elem => elem.getID() === json.id);
    if (obj) return true;
    else return false;
  }

  /**
   * Removes Object or Array of Objects from objectCollector array
   * @param json Object or Array of objects
   */
  private removeFromObjectCollector(
    json: ISceneJSON | IObjectsCommonJSON,
  ): ISceneJSON {
    if (isArray(json)) {
      json.forEach(obj => this.removeFromObjectCollector(obj));
    } else {
      if (!this.objectInObjectCollector(json))
        throw new Error(`Object id ${json.id} not present in Scene`);
      this.objectCollector = this.objectCollector.filter(
        obj => obj.getID() !== json.id,
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
      if (!this.objectInObjectCollector(json))
        throw new Error(`Object id ${json.id} not present in Scene`);
      this.objectsInScene = this.objectsInScene.filter(
        obj => obj.getID() !== json.id,
      );
    }

    return this.toJSON();
  }

  /**
   * Clones an object and adds it to the scene (and objectCollector).
   * If object is not in Scene throws Erro
   * @param json object to be cloned
   */
  public cloneOject(json: IObjectsCommonJSON): ISceneJSON {
    if (this.objectInScene(json)) {
      const obj = this.getObject(json);
      const newobj = obj.clone();
      newobj.setViewOptions(json.viewOptions);
      this.addExistingObject(newobj);
      return this.toJSON();
    } else {
      throw new Error('Cannot clone unknown object');
    }
  }

  private addExistingObject(object: ObjectsCommon): ISceneJSON {
    if (this.objectInObjectCollector(object.toJSON())) {
      throw Error('Object already in Scene');
    } else {
      //In case the object has children, they must be removed from BitbloqScene (remain in ObjectCollector)
      if (object instanceof CompoundObject) {
        const children = object.getChildren();
        children.forEach(child => {
          const obj = child.toJSON();
          if (this.objectInScene(obj)) {
            this.removeFromScene(obj);
          } else if (!this.objectInObjectCollector(obj)) {
            this.addExistingObject(child);
            this.removeFromScene(obj);
          }
        });
      } else if (object instanceof ObjectsGroup) {
        const children = object.getChildren();
        children.forEach(child => {
          const obj = child.toJSON();
          if (this.objectInScene(obj)) {
            this.removeFromScene(obj);
          } else if (!this.objectInObjectCollector(obj)) {
            this.addExistingObject(child);
            this.removeFromScene(obj);
          }
        });
      } else if (object instanceof RepetitionObject) {
        const original = object.getOriginal();
        const obj = original.toJSON();
        if (this.objectInScene(obj)) {
          this.removeFromScene(obj);
        } else if (!this.objectInObjectCollector(obj)) {
          this.addExistingObject(original);
          this.removeFromScene(obj);
        }
      }

      // finally, add object to scene and collector
      this.objectsInScene.push(object);
      this.objectCollector.push(object);
    }

    const sceneJSON = this.toJSON();
    //Add to history
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(sceneJSON);
    this.historyIndex = this.history.length - 1;

    return sceneJSON;
  }

  /**
   * Removes Object from both Scene and ObjectCollector.
   * If object is not present is does NOT anything.
   * @param json json object descriptor (only id is important)
   */
  public removeObject(obj: IObjectsCommonJSON): ISceneJSON {
    try {
      this.removeFromScene(obj);
      this.removeFromObjectCollector(obj);
    } catch (e) {
      throw new Error(`Cannot Remove Object from Scene: ${e}`);
    }

    const sceneJSON = this.toJSON();
    //Add to history if someting has changed

    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(sceneJSON);
    this.historyIndex = this.history.length - 1;

    return sceneJSON;
  }

  /**
   * Returns a reference to the specified Object
   * @param obj Object descriptor to retreive
   */
  public getObject(obj: IObjectsCommonJSON): ObjectsCommon {
    const id = obj.id;
    const foundObj = this.objectCollector.find(object => object.getID() === id);
    if (!foundObj) throw new Error(`Scene.getObject(). Object ${id} not found`);

    return foundObj;
  }

  /**
   * Updates object if its present on the objects collector.
   * If not it triggers an error exception.
   * @param json json describing object
   */
  public updateObject(obj: IObjectsCommonJSON): ISceneJSON {
    const id = obj.id;
    const object = this.objectCollector.find(obj => id === obj.getID());
    if (object) object.updateFromJSON(obj);
    else throw new Error(`Object id ${id} not found`);

    const sceneJSON = this.toJSON();
    //Add to history

    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(sceneJSON);
    this.historyIndex = this.history.length - 1;

    return sceneJSON;
  }

  /**
   *
   * @param json object descriptor
   */
  public async getPositionAsync(
    json: IObjectsCommonJSON,
  ): Promise<IObjectPosition> {
    try {
      const obj = this.getObject(json);

      if (obj instanceof Object3D || obj instanceof RepetitionObject) {
        const mesh = await obj.getMeshAsync();
        if (mesh) {
          const pos: IObjectPosition = {
            position: {
              x: mesh.position.x,
              y: mesh.position.y,
              z: mesh.position.z,
            },
            angle: {
              x: mesh.rotation.x * 180 / Math.PI,
              y: mesh.rotation.y * 180 / Math.PI,
              z: mesh.rotation.z * 180 / Math.PI,
            },
            scale: {
              x: mesh.scale.x,
              y: mesh.scale.y,
              z: mesh.scale.z,
            },
          };
          return pos;
        } else {
          const pos: IObjectPosition = {
            position: { x: 0, y: 0, z: 0 },
            angle: { x: 0, y: 0, z: 0 },
            scale: { x: 0, y: 0, z: 0 },
          };
          return pos;
        }
      } else {
        const pos: IObjectPosition = {
          position: { x: 0, y: 0, z: 0 },
          angle: { x: 0, y: 0, z: 0 },
          scale: { x: 0, y: 0, z: 0 },
        };
        return pos;
      }
    } catch (e) {
      throw new Error(`Cannot find object: ${e}`);
    }
  }

  /**
   * It removes the ObjectsGroup from Scene and ObjectCollector.
   * It adds the members of the group to de Scene.
   * @param json group object descriptor (it only pays attention to id)
   */
  public unGroup(json: IObjectsGroupJSON): ISceneJSON {
    try {
      const group = this.getObject(json);
      if (!(group instanceof ObjectsGroup))
        throw new Error(`Object is not a group`);
      const objects: Array<ObjectsCommon> = (group as ObjectsGroup).unGroup();
      // add the members of the group to the Scene
      objects.forEach(object => {
        this.objectsInScene.push(object);
      });

      //remove ObjectsGroups from Scene and ObjectCollector
      return this.removeObject(json);
    } catch (e) {
      throw new Error(`Cannog ungroup. Unknown group ${e}`);
    }
  }

  /**
   * It removes the CompoundObject from Scene and ObjectCollector.
   * It adds the children to the Scene
   * @param json CompoundObject Descriptor. It only pays attention to id.
   */
  public undoCompound(json: ICompoundObjectJSON): ISceneJSON {
    return this.toJSON();
  }

  /**
   * It removes RepetitionObject from Scene and ObjectCollector.
   * It transform the RepetitionObject to a ObjectsGroup and add it to the Scene and ObjectCollector.
   * @param json RepetitionObject descriptor. It only pays attention to id
   */
  public repetitionToGroup(json: IRepetitionObjectJSON): ISceneJSON {
    try {
      const rep = this.getObject(json);
      if (!(rep instanceof RepetitionObject))
        throw new Error(`Object is not a RepetitionObject`);

      const objects: Array<
        ObjectsCommon
      > = (rep as RepetitionObject).getGroup().unGroup();

      //add objects to ObjectCollector
      objects.forEach(object => {
        this.objectCollector.push(object);
      });

      const group: ObjectsGroup = new ObjectsGroup(objects);

      // add new group to scene
      this.objectCollector.push(group);
      this.objectsInScene.push(group);

      //remove original object in repetion from ObjectCollector
      const original = rep.getOriginal();
      this.removeFromObjectCollector(original.toJSON());

      //remove ObjectsGroups from Scene and ObjectCollector
      this.removeFromObjectCollector(json);
      this.removeFromScene(json);
    } catch (e) {
      throw new Error(`Cannog ungroup. Unknown group ${e}`);
    }

    return this.toJSON();
  }

  // Establece el helper que debe mostrarse en la vista 3d
  // Si no se le pasa ningún parámetro entonces no mostrar ninguno
  public async setActiveHelperAsync(
    helperDescription?: IHelperDescription,
  ): Promise<Array<THREE.Group>> {
    this.helpers = [];
    if (!helperDescription) {
      return this.helpers;
    } else {
      const { type, object, axis, relative } = helperDescription;
      try {
        const obj = this.getObject(object);
        const mesh = await obj.getMeshAsync();
        if (type === 'rotation') {
          const helper = new RotationHelper(mesh, axis, relative);
          this.helpers.push(helper.mesh);
          return this.helpers;
        } else if (type === 'translation') {
          const helper = new TranslationHelper(mesh, axis, relative);
          this.helpers.push(helper.mesh);
          return this.helpers;
        } else {
          throw new Error(`Unknown helper type: ${type}`);
        }
      } catch (e) {
        throw new Error(`Unable to make helper: ${e}`);
      }
    }
  }

  // Deshace la última operación y devuelve la escena después de deshacer
  public undo(): any {}

  // Rehace la última operación y devuelve la escena después de rehacer
  public redo(): any {}
}
