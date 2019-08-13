/**
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2019-01-18 19:13:38
 * Last modified  : 2019-01-18 20:00:14
 */

import * as THREE from 'three';
import ThreeBSP from './threeCSG';

export default Worker;

// Be sure we are not withing a node execution
if (!(typeof module !== 'undefined' && module.exports)) {
  const ctx: Worker = self as any;

  const getUnionFromGeometries = (
    geometries: THREE.Geometry[]
  ): THREE.Geometry => {
    let geomBSP: any = new ThreeBSP(geometries[0]);
    // Union with the rest
    for (let i = 1; i < geometries.length; i += 1) {
      const bspGeom = new ThreeBSP(geometries[i]);
      geomBSP = geomBSP.union(bspGeom);
    }
    const geom = geomBSP.toGeometry();
    return geom;
  };

  const getDifferenceFromGeometries = (
    geometries: THREE.Geometry[]
  ): THREE.Geometry => {
    let geomBSP: any = new ThreeBSP(geometries[0]);
    // Union with the rest
    for (let i = 1; i < geometries.length; i += 1) {
      const bspGeom = new ThreeBSP(geometries[i]);
      geomBSP = geomBSP.subtract(bspGeom);
    }
    const geom = geomBSP.toGeometry();
    return geom;
  };

  const getIntersectionFromGeometries = (
    geometries: THREE.Geometry[]
  ): THREE.Geometry => {
    let geomBSP: any = new ThreeBSP(geometries[0]);
    // Union with the rest
    for (let i = 1; i < geometries.length; i += 1) {
      const bspGeom = new ThreeBSP(geometries[i]);
      geomBSP = geomBSP.intersect(bspGeom);
    }
    const geom = geomBSP.toGeometry();
    return geom;
  };

  ctx.addEventListener(
    'message',
    e => {
      const geometries: THREE.Geometry[] = [];

      const bufferArray = e.data.bufferArray;

      if (!bufferArray) return;

      let firstGeomMatrix: THREE.Matrix4 | undefined;
      let firstSubGeomMatrix: THREE.Matrix4 | undefined;
      debugger;
      // add all children to geometries array
      for (let i = 0, first = true; i < bufferArray.length; ) {
        // recompute object form vertices and normals
        const numMeshesBuffer: ArrayBuffer = e.data.bufferArray[i];
        i += 1;

        const _numMeshes: number = new Float32Array(
          numMeshesBuffer,
          0,
          numMeshesBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
        )[0];

        const subGeometries: THREE.Geometry[] = [];

        for (let j = 0; j < _numMeshes; j += 1) {
          const verticesBuffer: ArrayBuffer = e.data.bufferArray[i];
          i += 1;
          const normalsBuffer: ArrayBuffer = e.data.bufferArray[i];
          i += 1;
          const positionBuffer: ArrayBuffer = e.data.bufferArray[i];
          i += 1;
          const localPositionBuffer: ArrayBuffer = e.data.bufferArray[i];
          i += 1;

          const _vertices: ArrayLike<number> = new Float32Array(
            verticesBuffer,
            0,
            verticesBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          );
          const _normals: ArrayLike<number> = new Float32Array(
            normalsBuffer,
            0,
            normalsBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          );
          const _positions: ArrayLike<number> = new Float32Array(
            positionBuffer,
            0,
            positionBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          );

          const _localPositions: ArrayLike<number> = new Float32Array(
            localPositionBuffer,
            0,
            localPositionBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          );

          const matrixWorld: THREE.Matrix4 = new THREE.Matrix4();
          matrixWorld.elements = new Float32Array(_positions);

          const matrix: THREE.Matrix4 = new THREE.Matrix4();
          matrix.elements = new Float32Array(_localPositions);

          if (first) {
            firstGeomMatrix = matrixWorld.clone();
            first = false;
            // firstGeomMatrix = matrix.clone();
          }

          if (j === 0) {
            firstSubGeomMatrix = matrixWorld.clone();
            // firstGeomMatrix = matrix.clone();
          }

          const buffGeometry = new THREE.BufferGeometry();
          buffGeometry.addAttribute(
            'position',
            new THREE.BufferAttribute(_vertices, 3)
          );
          buffGeometry.addAttribute(
            'normal',
            new THREE.BufferAttribute(_normals, 3)
          );
          const objectGeometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(
            buffGeometry
          );
          objectGeometry.applyMatrix(matrixWorld);
          subGeometries.push(objectGeometry);
        }

        if (subGeometries.length === 1) {
          geometries.push(subGeometries[0]);
        } else {
          /// Make Union of Subgeometries
          let subGeometry: THREE.Geometry = new THREE.Geometry();
          subGeometry = getUnionFromGeometries(subGeometries);
          geometries.push(subGeometry);
        }
      }

      // compute action
      let geometry: THREE.Geometry = new THREE.Geometry();
      if (e.data.type === 'Union') {
        geometry = getUnionFromGeometries(geometries);
      } else if (e.data.type === 'Difference') {
        geometry = getDifferenceFromGeometries(geometries);
      } else if (e.data.type === 'Intersection') {
        geometry = getIntersectionFromGeometries(geometries);
      } else {
        const postMessage = {
          status: 'error',
        };
        ctx.postMessage(postMessage);
      }

      // move resulting geometry to origin of coordinates (center on first child on origin)
      const invMatrix: THREE.Matrix4 = new THREE.Matrix4();
      if (firstGeomMatrix) {
        invMatrix.getInverse(firstGeomMatrix);
      }
      geometry.applyMatrix(invMatrix);

      // get buffer data
      const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(
        geometry
      );
      const vertices = new Float32Array(
        bufferGeom.getAttribute('position').array
      );
      const normals = new Float32Array(bufferGeom.getAttribute('normal').array);

      const message = {
        vertices,
        normals,
        status: 'ok',
      };

      ctx.postMessage(message, [
        message.vertices.buffer,
        message.normals.buffer,
      ]);
    },

    false
  );
}
