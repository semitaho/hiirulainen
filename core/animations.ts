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


export function moveKasi(direction: number): BABYLON.Animation {
  const keys = [{
    frame: 0,
    value: 0
  }, {
    frame: 15,
    value: (Math.PI / 4)*direction
  },
  {
    frame: 30,
    value: 0
  }];
  const kasiheiluu = new BABYLON.Animation("kasitheiluuAnimation", "rotation.x", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  kasiheiluu.setKeys(keys);
  return kasiheiluu;


}
export function createHulahula(): BABYLON.Animation {
  const animHulahula = new BABYLON.Animation("hulahulaAnimation", "rotation.z", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  const animParams = [[0, 1], [30, -1]];
  let allKeys = [];
  animParams
    .forEach(param => {
      const frameAdder = param[0] as number;
      const valueMultiplier = param[1] as number;
      const keys = [{
        frame: 0 + frameAdder,
        value: 0 * valueMultiplier
      }, {
        frame: 8 + frameAdder,
        value: Math.PI / 8 * valueMultiplier
      },

      {
        frame: 12 + frameAdder,
        value: 0 * valueMultiplier
      },

      {
        frame: 16 + frameAdder,
        value: 0 * valueMultiplier
      },

      {
        frame: 22 + frameAdder,
        value: Math.PI / 8 * valueMultiplier
      },

      {
        frame: 26 + frameAdder,
        value: 0
      },
      {
        frame: 30 + frameAdder,
        value: 0
      }
      ];
      allKeys = allKeys.concat(keys);

    });

  animHulahula.setKeys(allKeys);
  return animHulahula;
}

export function suljeAvaaSilmat(): BABYLON.Animation {
  const suljeAvaaAnimation = new BABYLON.Animation("suljeAvaa", "scaling", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const arr = [{
    frame: 0,
    value:  Vector3.One()
  }, 
  {
    frame: 14,
    value: Vector3.One()
  },
  {
    frame: 15,
    value: new Vector3 (1,0,0)
  },

  {
    frame: 16,
    value: Vector3.One()
  },

  {
    frame: 30,
    value:  Vector3.One()
  }];
  suljeAvaaAnimation.setKeys(arr);
  return suljeAvaaAnimation;
}

export function vilkkuminen(): BABYLON.Animation {
  const blinkingAnimation = new BABYLON.Animation("vilkkuminen", "visibility", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const arr = [];
  arr.push({
    frame: 0,
    value: 1
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  arr.push({
    frame: 5,
    value: 0
  });
  arr.push({
    frame: 10,
    value: 1
  });
  arr.push({
    frame: 15,
    value: 0
  });
  arr.push({
    frame: 20,
    value: 1
  });
  arr.push({
    frame: 25,
    value: 0
  });
  arr.push({
    frame: 30,
    value: 1
  });
  blinkingAnimation.setKeys(arr);
  return blinkingAnimation;

}
export function ampaiseVittuun(startY: number): BABYLON.Animation {
  const animWheel = new BABYLON.Animation("ampaise", "position.y", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
  const wheelKeys = [];

  //At the animation key 0, the value of rotation.y is 0
  wheelKeys.push({
    frame: 0,
    value: startY
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  wheelKeys.push({
    frame: 15,
    value: 10
  });

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
  wheelKeys.push({
    frame: DEFAULT_FRAMERATE,
    value: 20
  });

  animWheel.setKeys(wheelKeys);
  return animWheel;
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
