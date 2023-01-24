import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';

const DEFAULT_FRAMERATE = 30;
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

export function createRenkaanPyoriminen(): BABYLON.Animation {
  const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const wheelKeys = [];

  //At the animation key 0, the value of rotation.y is 0
  wheelKeys.push({
    frame: 0,
    value: 0
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  wheelKeys.push({
    frame: DEFAULT_FRAMERATE,
    value: 2 * Math.PI
  });
  animWheel.setKeys(wheelKeys);
  return animWheel;
}

export function createSiirtyma(positions: Vector3[]): BABYLON.Animation {
  const frameRate = 30;
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
