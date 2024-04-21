import * as BABYLON from 'babylonjs';
import {  AbstractMesh, Vector2, Vector3 } from 'babylonjs';
import { toVector3 } from '../utils/geometry.util';
import { DEFAULT_FRAMERATE } from './config';

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
    value: (Math.PI / 4) * direction
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



export function createJumpHitAnimation(): BABYLON.Animation {
  const hitAnimation = new BABYLON.Animation("jumpHitAnimation", "position.y", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const arr = [{
    frame: 0,
    value: 0
  },

  {
    frame: 13,
    value: 0.5
  },

  {
    frame: 15,
    value: 0.6
  },
  {
    frame: 30,
    value: 0
  }
  ];

  hitAnimation.setKeys(arr);
  return hitAnimation;
}

export function createCarDriveAnimation() {
  const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const carKeys = [];

  carKeys.push({
      frame: 0,
      value: -100
  });

  carKeys.push({
      frame: 150,
      value: 0
  });

  carKeys.push({
      frame: 300,
      value: 100
  });

  animCar.setKeys(carKeys);
  return animCar;
}


export function createRabbitMoveJumpAnimation(mesh: AbstractMesh, target: Vector2): BABYLON.Animation {
  const hitAnimation = new BABYLON.Animation("rabbitJumpAnimation", "position", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const moveVector = toVector3(target).subtract(mesh.position).normalize();
  const moveVector2 = mesh.position.add(moveVector.scaleInPlace(1.5));
  const moveVector4 = mesh.position.add(moveVector.scaleInPlace(3));

  const arr = [{
    frame: 0,
    value: mesh.position
  },

  {
    frame: 15,
    value: new Vector3(moveVector2.x, 2.5, moveVector2.z)
  },

  {
    frame: 30,
    value:  new Vector3(moveVector4.x, 0, moveVector4.z)
  }
  ];

  hitAnimation.setKeys(arr);
  return hitAnimation;
}

export function createHitAnimation(): BABYLON.Animation {
  const hitAnimation = new BABYLON.Animation("hitAnimation", "rotation.y", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const arr = [{
    frame: 0,
    value: 0
  },


  {
    frame: 7.5,
    value: Math.PI * 2
  },

  {
    frame: 15,
    value: 2 * Math.PI * 2
  },

  {
    frame: 22.5,
    value: 3 * Math.PI * 2
  },


  {
    frame: 30,
    value: 4 * Math.PI * 2
  }];

  hitAnimation.setKeys(arr);
  return hitAnimation;
}

export function suljeAvaaSilmat(): BABYLON.Animation {
  const suljeAvaaAnimation = new BABYLON.Animation("suljeAvaa", "scaling", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  const arr = [{
    frame: 0,
    value: Vector3.One()
  },
  {
    frame: 14,
    value: Vector3.One()
  },
  {
    frame: 15,
    value: new Vector3(1, 0, 0)
  },

  {
    frame: 16,
    value: Vector3.One()
  },

  {
    frame: 30,
    value: Vector3.One()
  }];
  suljeAvaaAnimation.setKeys(arr);
  return suljeAvaaAnimation;
}

export function vilkkuminen(): BABYLON.Animation {
  const blinkingAnimation = new BABYLON.Animation("vilkkuminen", "visibility", DEFAULT_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const arr = [];
 

  //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation

  for (let kierros = 0; kierros <= 1; kierros++) {

    arr.push({
      frame: 0 + (DEFAULT_FRAMERATE * kierros),
      value: 1
    });
    arr.push({
      frame: 5 + (DEFAULT_FRAMERATE * kierros) ,
      value: 0
    });
    arr.push({
      frame: 10 + (DEFAULT_FRAMERATE * kierros),
      value: 1
    });
    arr.push({
      frame: 15 + (DEFAULT_FRAMERATE * kierros),
      value: 0
    });
    arr.push({
      frame: 20 + (DEFAULT_FRAMERATE * kierros),
      value: 1
    });
    arr.push({
      frame: 25 + (DEFAULT_FRAMERATE * kierros),
      value: 0
    });
    arr.push({
      frame: 30 + (DEFAULT_FRAMERATE * kierros),
      value: 1
    })
  }
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
    value: 30
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
