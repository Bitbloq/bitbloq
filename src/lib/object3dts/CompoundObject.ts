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
 * Created at     : 2018-11-09 09:31:03 
 * Last modified  : 2018-11-14 09:15:51
 */

import Object3D, {ChildrenArray} from './Object3D';
import ObjectsCommon, {OperationsArray, IViewOptions, IObjectsCommonJSON} from './ObjectsCommon';

import isEqual from'lodash.isequal';
import * as THREE from 'three';

import Worker from './compound.worker';
import { ICubeJSON } from './Cube';
import { IPrismJSON } from './Prism';

export interface ICompountObjectJSON extends IObjectsCommonJSON{
  children: ChildrenArray;
}

export default class CompoundObject extends Object3D {

  protected worker:Worker;


  constructor(
    children: ChildrenArray = [], 
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    ){
    super(viewOptions,operations);
    this.children = children;
    this._updateRequired = true;
    this.setOperations();
    
    const t0 = performance.now();
    if (typeof(Worker) !== "undefined"){
      //this.worker = new Worker();
      this.worker = new Worker();
    }else{
      throw Error('Bitbloq 3D requires a Web Eorker enabled browser')
    }
    const t1 = performance.now();
    console.log(`WebWorker creation time ${t1 - t0} millis`);
  }


  public getTypeName():string{
    throw new Error("Implemented in child");
    return "";
  }

  public getMeshAsync(): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      if(this.meshUpdateRequired){
        console.log('Update Compound Object Mesh');
        
        //check if WebWorkers are enabled
        if (typeof(Worker) !== "undefined"){
          //WEB WORKER //listen to events from web worker
          this.worker.onmessage = (event:any) => {
            const t0 = performance.now();
            if(event.data.status !== 'ok'){
              reject("Compound Object Error");
              return;
            }
            const message = event.data;

            //recompute object form vertices and normals
            this.fromBufferData(message.vertices, message.normals).then(mesh => {
              this.mesh = mesh;
              const t1 = performance.now();
              console.log(`WebWorker deserialize Execuetion time ${t1 - t0} millis`);
              
              if(this.mesh instanceof THREE.Mesh){
                  this.applyOperationsAsync().then( () => {
                    this._updateRequired = false;
                    this.mesh.material = this.getMaterial();
                    resolve(this.mesh);
                  });
              }else{
                const reason = new Error('Mesh not computed correctly');
                reject(reason);
              }
            });
          };
          // END OF EVENT HANDLER

          //Lets create an array of vertices and normals for each child
          const t0 = performance.now();
          this.toBufferArrayAsync().then(bufferArray => {
            const message = {
              type: this.getTypeName(),
              numChildren: this.children.length,
              bufferArray,
            }
            this.worker.postMessage(message, bufferArray);
            const t1 = performance.now();
            console.log(`WebWorker serialize Execuetion time ${t1 - t0} millis`);
          });
        } else {
          const reason = new Error('Bitbloq 3D requires a Web Worker Enabled Browser');
          reject(reason);
        }
      }else{
        if (this.pendingOperation){
          this.applyOperationsAsync().then( () => {
            this.mesh.material = this.getMaterial();
            resolve(this.mesh);
          });
        }
        this.mesh.material = this.getMaterial();
        resolve(this.mesh)
      }
    });
  }

  protected fromBufferData(vertices: any, normals: any): Promise<THREE.Mesh>{
    return new Promise( (resolve,reject) => {
      const buffGeometry = new THREE.BufferGeometry();
      buffGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      buffGeometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
      const material = this.getMaterial();
      const mesh: THREE.Mesh = new THREE.Mesh(buffGeometry, material);
      resolve(mesh);
    });  
  }

  protected toBufferArrayAsync():Promise <Array<ArrayBuffer>>{
    return new Promise( (resolve,reject) => {
      const promises:any[] = [];
      const bufferArray:Array<ArrayBuffer> = [];
      this.children.forEach(child => {
        const promise:Promise<THREE.Mesh> = child.getMeshAsync();
        promises.push(promise);
      });

      Promise.all(promises).then(meshes => {
        meshes.forEach(mesh => {
          const geom: THREE.BufferGeometry | THREE.Geometry = mesh.geometry;
          let bufferGeom: THREE.BufferGeometry;
          if(geom instanceof THREE.BufferGeometry){
            bufferGeom = geom as THREE.BufferGeometry;
          }else{
            bufferGeom = new THREE.BufferGeometry().fromGeometry(geom as THREE.Geometry);
          }
          const verticesBuffer: ArrayBuffer = new Float32Array(bufferGeom.getAttribute('position').array).buffer;
          const normalsBuffer: ArrayBuffer = new Float32Array(bufferGeom.getAttribute('normal').array).buffer;
          const positionBuffer: ArrayBuffer = Float32Array.from(mesh.matrixWorld.elements).buffer;          
          bufferArray.push(verticesBuffer);
          bufferArray.push(normalsBuffer);
          bufferArray.push(positionBuffer);
        });
        resolve(bufferArray);
      });
    });
  }

  public addChildren(child: Object3D): void {
    this.children.push(child);
    this._updateRequired = true;
  }

  public setChildren(children: ChildrenArray): void {
    if(!isEqual(children,this.children)){
      this.children = children.slice();
      this._updateRequired = true;
    }
  }

  public toJSON(): string{
    const object = {
      id: this.id,
      type: this.type,
      viewOptions: this.viewOptions,
      operations: this.operations,
      children: this.children,
    }
    return JSON.stringify(object);
  }


}
