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
    value: new Vector3(-0.3, 0, 0)
  },
  {
    frame: 2 * frameRate,
    value: new Vector3(0, 1 * direction, 0)
  }];

  kasienheiluttelu.setKeys(keyFrames);
  return kasienheiluttelu;
}
