import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';

export function createKasienheiluttelu(direction: number): BABYLON.Animation {
  const frameRate = 10;
  const kasienheiluttelu = new BABYLON.Animation("kasienheiluttelu", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const keyFrames = [{
    frame: 0,
    value: new Vector3(0, 1 * direction, 0)
  }, {
    frame: frameRate,
    value: new Vector3(-0.8, 0, 0)
  },
  {
    frame: 2 * frameRate,
    value: new Vector3(0, 1 * direction, 0)
  }];

  kasienheiluttelu.setKeys(keyFrames);
  return kasienheiluttelu;
}

export function createPyoriminen(rotation: Vector3): BABYLON.Animation {

  const frameRate = 60;
  const pyoriminenAnimation = new BABYLON.Animation("pyoriminen", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
  const keyFrames = [{
    frame: 0,
    value: 0
  }, {
    frame: frameRate,
    value:  Math.PI * 4
  }];

  pyoriminenAnimation.setKeys(keyFrames);
  return pyoriminenAnimation;
}

export function createSiirtyma(positions: Vector3[]): BABYLON.Animation {
  const frameRate = 50;
  const pyoriminenAnimation = new BABYLON.Animation("pyoriminen", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const keyFrames = [{
    frame: 0,
    value: positions[0]
  }, {
    frame: frameRate,
    value: positions[1]
  },
  {
    frame: frameRate * 2,
    value: positions[0]
  }

];

  pyoriminenAnimation.setKeys(keyFrames);
  return pyoriminenAnimation;

}
