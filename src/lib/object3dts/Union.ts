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
 * Created at     : 2018-10-16 13:00:09 
 * Last modified  : 2018-11-16 19:32:11
 */



import CompoundObject, { ICompountObjectJSON, ChildrenArray} from './CompoundObject';
import ObjectsCommon, {OperationsArray} from './ObjectsCommon'
import Object3D from './Object3D';
import ObjectFactory from './ObjectFactory';

export default class Union extends CompoundObject {
  static typeName:string = 'Union';


  public static newFromJSON(json: string): Union{
    const children:ChildrenArray = [];

    const object:ICompountObjectJSON = JSON.parse(json);
    
    if(object.type != Union.typeName) throw new Error('Not Union Object');
    
    object.children.forEach(element => {
      const json = JSON.stringify(element);
      const child = ObjectFactory.newFromJSON(json) as Object3D;
      children.push(child);
    });

    return new Union(children, object.operations);
  } 

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
    this.type = Union.typeName;
    console.log(this.toJSON());
  }

  public clone():Union{
    const childrenClone: Array<Object3D> = this.children.map( child => child.clone());
    const obj = new Union(childrenClone, this.operations);
    if (!this.meshUpdateRequired && !this.pendingOperation){
      obj.setMesh(this.mesh);
    }
    return obj;
  }
}
