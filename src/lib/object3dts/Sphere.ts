/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-16 12:59:30 
 * Last modified  : 2018-11-15 20:23:16
 */



import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions, IObjectsCommonJSON} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from 'lodash.isequal';

interface ISphereParams {
  radius:number
}

export interface ISphereJSON extends IObjectsCommonJSON{
  parameters: ISphereParams;
}

export default class Sphere extends Object3D{

  public static typeName:string = 'Sphere';

  constructor(
    parameters: ISphereParams,
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    ){
    super(viewOptions,operations);
    this.type = Sphere.typeName;
    this.parameters = {...parameters};
    this._updateRequired = true;    
  }

  public static newFromJSON(json: string):Sphere {
    const object: ISphereJSON = JSON.parse(json);
    if(object.type != Sphere.typeName) throw new Error('Not Sphere Object');
    return new Sphere(object.parameters, object.operations, object.viewOptions);
}

  protected getGeometry(): THREE.Geometry {
    let {radius} = this.parameters as ISphereParams;
    radius = Math.max(1,radius);
    this._updateRequired = false;
    return new THREE.SphereGeometry(
      Number(radius),
      Math.max(16,Math.min(Number(radius)*24/5 , 32)), 
      Math.max(16,Math.min(Number(radius)*24/5, 32))
      );
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let {radius} = this.parameters as ISphereParams;
    radius = Math.max(1,radius);
    this._updateRequired = false;
    return new THREE.SphereBufferGeometry(
      Number(radius),
      Math.max(16,Math.min(Number(radius)*24/5 , 32)), 
      Math.max(16,Math.min(Number(radius)*24/5, 32)));
  }

  public clone():Sphere{
    return Sphere.newFromJSON(this.toJSON());
  }
}
