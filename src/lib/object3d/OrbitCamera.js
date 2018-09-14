import * as THREE from 'three';
import { SphericalCoordsXYZ} from './SphericalCoordinates';


const EPSILON = 0.001;
const STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_DOLLY: 4,
  TOUCH_PAN: 5,
};

export default class OrbitCamera {
  constructor(object, domElement) {
    this.object = object;
    this.enabled = true;

    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians
    this.minAzimuthAngle = -Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians
    this.dampingFactor = 0.05;
    this.draggingDampingFactor = 0.25;
    this.dollySpeed = 1.0;
    this.truckSpeed = 2.0;

    this.domElement = domElement;

    // the location of focus, where the object orbits around
    this.target = new THREE.Vector3();
    this._targetEnd = new THREE.Vector3();


    // rotation
    this._spherical = new SphericalCoordsXYZ();

    this._spherical.setFromVector3(this.object.position);
 
    this._sphericalEnd = new SphericalCoordsXYZ().copy(this._spherical);


    // reset
    this._target0 = this.target.clone();
    this._position0 = this.object.position.clone();

    this._needsUpdate = true;
    this.update();

    if (!this.domElement) {
      this.dispose = () => {};
    } else {
      const scope = this;
      const dragStart = new THREE.Vector2();
      const dollyStart = new THREE.Vector2();
      let state = STATE.NONE;
      let elementRect;
      let savedDampingFactor;

      this.domElement.addEventListener('mousedown', onMouseDown);
      this.domElement.addEventListener('touchstart', onTouchStart);
      this.domElement.addEventListener('wheel', onMouseWheel);
      this.domElement.addEventListener('contextmenu', onContextMenu);

      this.dispose = () => {
        scope.domElement.removeEventListener('mousedown', onMouseDown);
        scope.domElement.removeEventListener('touchstart', onTouchStart);
        scope.domElement.removeEventListener('wheel', onMouseWheel);
        scope.domElement.removeEventListener('contextmenu', onContextMenu);
        document.removeEventListener('mousemove', dragging);
        document.removeEventListener('touchmove', dragging);
        document.removeEventListener('mouseup', endDragging);
        document.removeEventListener('touchend', endDragging);
      };

      function onMouseDown(event) {
        if (!scope.enabled) return;

        event.preventDefault();

        const prevState = state;

        switch (event.button) {
          case THREE.MOUSE.LEFT:
            state = STATE.ROTATE;
            break;

          case THREE.MOUSE.MIDDLE:
            state = STATE.DOLLY;
            break;

          case THREE.MOUSE.RIGHT:
            state = STATE.PAN;
            break;
        }

        if (prevState === STATE.NONE) {
          startDragging(event);
        }
      }

      function onTouchStart(event) {
        if (!scope.enabled) return;

        event.preventDefault();

        const prevState = state;

        switch (event.touches.length) {
          case 1:	// one-fingered touch: rotate

            state = STATE.TOUCH_ROTATE;
            break;

          case 2:	// two-fingered touch: dolly

            state = STATE.TOUCH_DOLLY;
            break;

          case 3: // three-fingered touch: pan

            state = STATE.TOUCH_PAN;
            break;
        }

        if (prevState === STATE.NONE) {
          startDragging(event);
        }
      }


      function onMouseWheel(event) {
        if (!scope.enabled) return;

        event.preventDefault();

        if (event.deltaY < 0) {
          dollyIn();
        } else if (event.deltaY > 0) {
          dollyOut();
        }
      }

      function onContextMenu(event) {
        if (!scope.enabled) return;

        event.preventDefault();
      }

      function startDragging(event) {
        if (!scope.enabled) return;

        event.preventDefault();

        const _event = event.touches ? event.touches[0] : event;
        const x = _event.clientX;
        const y = _event.clientY;

        elementRect = scope.domElement.getBoundingClientRect();
        dragStart.set(x, y);


        if (state === STATE.TOUCH_DOLLY) {
          const dx = x - event.touches[1].pageX;
          const dy = y - event.touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          dollyStart.set(0, distance);
        }

        savedDampingFactor = scope.dampingFactor;
        scope.dampingFactor = scope.draggingDampingFactor;

        document.addEventListener('mousemove', dragging, { passive: false });
        document.addEventListener('touchmove', dragging, { passive: false });
        document.addEventListener('mouseup', endDragging);
        document.addEventListener('touchend', endDragging);
      }

      function dragging(event) {
        if (!scope.enabled) return;

        event.preventDefault();

        const _event = event.touches ? event.touches[0] : event;
        const x = _event.clientX;
        const y = _event.clientY;

        const deltaX = dragStart.x - x;
        const deltaY = dragStart.y - y;


        dragStart.set(x, y);

        switch (state) {
          case STATE.ROTATE:
          case STATE.TOUCH_ROTATE:

            const rotTheta = 2 * Math.PI * deltaX / elementRect.width;
            const rotPhi = 2 * Math.PI * deltaY / elementRect.height;
            scope.rotate(rotTheta, rotPhi, true);
            break;

          case STATE.DOLLY:
            // not implemented
            break;

          case STATE.TOUCH_DOLLY:

            const dx = x - event.touches[1].pageX;
            const dy = y - event.touches[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const dollyDelta = dollyStart.y - distance;

            if (dollyDelta > 0) {
              dollyOut();
            } else if (dollyDelta < 0) {
              dollyIn();
            }

            dollyStart.set(0, distance);
            break;

          case STATE.PAN:
          case STATE.TOUCH_PAN:
            const offset = new THREE.Vector3().copy(scope.object.position).sub(scope.target);
            // half of the fov is center to top of screen
            const targetDistance = offset.length() * Math.tan((scope.object.fov / 2) * Math.PI / 180);
            const panX = (scope.truckSpeed * deltaX * targetDistance / elementRect.height);
            const panY = (scope.truckSpeed * deltaY * targetDistance / elementRect.height);
            scope.pan(panX, panY, true);
            break;
        }
      }

      function endDragging() {
        if (!scope.enabled) return;

        scope.dampingFactor = savedDampingFactor;
        state = STATE.NONE;

        document.removeEventListener('mousemove', dragging);
        document.removeEventListener('touchmove', dragging);
        document.removeEventListener('mouseup', endDragging);
        document.removeEventListener('touchend', endDragging);
      }

      function dollyIn() {
        const zoomScale = Math.pow(0.95, scope.dollySpeed);
        scope.dolly(scope._sphericalEnd.radius * zoomScale - scope._sphericalEnd.radius);
      }

      function dollyOut() {
        const zoomScale = Math.pow(0.95, scope.dollySpeed);
        scope.dolly(scope._sphericalEnd.radius / zoomScale - scope._sphericalEnd.radius);
      }
    }
  }

  // rotX in radian
  // rotY in radian
  rotate(rotTheta, rotPhi, enableTransition) {
    this.rotateTo(
      this._sphericalEnd.theta + rotTheta,
      this._sphericalEnd.phi + rotPhi,
      enableTransition,
    );
  }

  // rotX in radian
  // rotY in radian
  rotateTo(rotTheta, rotPhi, enableTransition) {
    const theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, rotTheta));
    const phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, rotPhi));

    this._sphericalEnd.theta = theta;
    this._sphericalEnd.phi = phi;
    this._sphericalEnd.makeSafe();


    
    if (!enableTransition) {
      this._spherical.theta = this._sphericalEnd.theta;
      this._spherical.phi = this._sphericalEnd.phi;
    }

    this._needsUpdate = true;
    
  }

  dolly(distance, enableTransition) {
    this.dollyTo(this._sphericalEnd.radius + distance, enableTransition);
  }

  dollyTo(distance, enableTransition) {
    this._sphericalEnd.radius = THREE.Math.clamp(
      distance,
      this.minDistance,
      this.maxDistance,
    );

    if (!enableTransition) {
      this._spherical.radius = this._sphericalEnd.radius;
    }

    this._needsUpdate = true;
  }

  pan(x, y, enableTransition) {
    this.truck(x, y, enableTransition);
  }

  truck(x, y, enableTransition) {
    this.object.updateMatrix();

    const _xColumn = new THREE.Vector3().setFromMatrixColumn(this.object.matrix, 0);
    const _yColumn = new THREE.Vector3().setFromMatrixColumn(this.object.matrix, 1);
    _xColumn.multiplyScalar(x);
    _yColumn.multiplyScalar(-y);

    const offset = new THREE.Vector3().copy(_xColumn).add(_yColumn);
    this._targetEnd.add(offset);

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
    }

    this._needsUpdate = true;
  }

  moveTo(x, y, z, enableTransition) {
    this._targetEnd.set(x, y, z);

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
    }

    this._needsUpdate = true;
  }

  saveState() {
    this._target0.copy(this.target);
    this._position0.copy(this.object.position);
  }

  reset(enableTransition) {
    this._targetEnd.copy(this._target0);
    this._sphericalEnd.setFromVector3(this._position0);
    this._sphericalEnd.theta = this._sphericalEnd.theta % (2 * Math.PI);
    this._spherical.theta = this._spherical.theta % (2 * Math.PI);

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
      this._spherical.copy(this._sphericalEnd);
    }

    this._needsUpdate = true;
  }

  update(delta) {
    const dampingFactor = this.dampingFactor * delta / 0.016;
    const deltaTheta = this._sphericalEnd.theta - this._spherical.theta;
    const deltaPhi = this._sphericalEnd.phi - this._spherical.phi;
    const deltaRadius = this._sphericalEnd.radius - this._spherical.radius;
    const deltaTarget = new THREE.Vector3().subVectors(this._targetEnd, this.target);

    if (
      Math.abs(deltaTheta) > EPSILON
  		|| Math.abs(deltaPhi) > EPSILON
  		|| Math.abs(deltaRadius) > EPSILON
  		|| Math.abs(deltaTarget.x) > EPSILON
  		|| Math.abs(deltaTarget.y) > EPSILON
  		|| Math.abs(deltaTarget.z) > EPSILON
    ) {
      this._spherical.set(
        this._spherical.radius + deltaRadius * dampingFactor,
        this._spherical.phi + deltaPhi * dampingFactor,
        this._spherical.theta + deltaTheta * dampingFactor,
      );

      this.target.add(deltaTarget.multiplyScalar(dampingFactor));
      this._needsUpdate = true;
    } else {
      this._spherical.copy(this._sphericalEnd);
      this.target.copy(this._targetEnd);
    }

    this._spherical.makeSafe();
    this.object.position.set(
      this._spherical.cartesian.x,
      this._spherical.cartesian.y,
      this._spherical.cartesian.z,
    ).add(this.target);
    this.object.lookAt(this.target);

    const needsUpdate = this._needsUpdate;
    this._needsUpdate = false;

    return needsUpdate;
  }

  toJSON() {
    return JSON.stringify({
      enabled: this.enabled,

      minDistance: this.minDistance,
      maxDistance: infinityToMaxNumber(this.maxDistance),
      minPolarAngle: this.minPolarAngle,
      maxPolarAngle: infinityToMaxNumber(this.maxPolarAngle),
      minAzimuthAngle: infinityToMaxNumber(this.minAzimuthAngle),
      maxAzimuthAngle: infinityToMaxNumber(this.maxAzimuthAngle),
      dampingFactor: this.dampingFactor,
      draggingDampingFactor: this.draggingDampingFactor,
      dollySpeed: this.dollySpeed,
      truckSpeed: this.truckSpeed,

      target: this._targetEnd.toArray(),
      position: this.object.position.toArray(),

      target0: this._target0.toArray(),
      position0: this._position0.toArray(),
    });
  }

  fromJSON(json, enableTransition) {
    const obj = JSON.parse(json);
    const position = new THREE.Vector3().fromArray(obj.position);

    this.enabled = obj.enabled;

    this.minDistance = obj.minDistance;
    this.maxDistance = maxNumberToInfinity(obj.maxDistance);
    this.minPolarAngle = obj.minPolarAngle;
    this.maxPolarAngle = maxNumberToInfinity(obj.maxPolarAngle);
    this.minAzimuthAngle = maxNumberToInfinity(obj.minAzimuthAngle);
    this.maxAzimuthAngle = maxNumberToInfinity(obj.maxAzimuthAngle);
    this.dampingFactor = obj.dampingFactor;
    this.draggingDampingFactor = obj.draggingDampingFactor;
    this.dollySpeed = obj.dollySpeed;
    this.truckSpeed = obj.truckSpeed;

    this._target0.fromArray(obj.target0);
    this._position0.fromArray(obj.position0);

    this._targetEnd.fromArray(obj.target);
    this._sphericalEnd.setFromVector3(position.sub(this._target0));

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
      this._spherical.copy(this._sphericalEnd);
    }

    this._needsUpdate = true;
  }
}

function infinityToMaxNumber(value) {
  if (isFinite(value)) return value;

  if (value < 0) return -Number.MAX_VALUE;

  return Number.MAX_VALUE;
}

function maxNumberToInfinity(value) {
  if (Math.abs(value) < Number.MAX_VALUE) return value;

  return value * Infinity;
}
