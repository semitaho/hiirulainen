import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { AbstractMesh, ActionEvent, ActionManager, ArcFollowCamera, ArcRotateCamera, AssetsManager, CannonJSPlugin, Color3, Color4, ConeParticleEmitter, Engine, EventState, ExecuteCodeAction, FollowCamera, FreeCamera, HemisphericLight, ISoundOptions, Mesh, MeshBuilder, PhysicsImpostor, PointerEventTypes, PointerInfoBase, Quaternion, Scalar, Scene, Vector2, Vector3 } from 'babylonjs';
import { Player } from './prefabs/player';
import { Path } from './prefabs/path';
import { UIModel } from './models/ui.model';
import { AutoObject, NurmikkoObject, TimanttiObject, TaloObject, RoadObject, MultaObject } from './prefabs/environment/';

import { calculateWidth, moveTowards, rotateTowards } from './utils/geometry.util';
import { AitiObject } from './prefabs/aiti.object';
import { MaikkiObject, OrvokkiObject } from './prefabs/kaverit';
import { ObjectsModel } from './models/objects.model';
import { HiirulainenAudio } from './audio/hiirulainen.audio';
import { HiirulainenTerrain } from './prefabs/hiirulainen.terrain';
import { HiirulainenCamera } from './prefabs/hiirulainen.camera';
import { HiirulainenScene } from './prefabs/hiirulainen.scene';
import { createRenkaanPyoriminen } from './prefabs/animations';
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: '.'
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
}
registerServiceWorker();

let canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
var engine: Engine = new Engine(canvas, true);

function createScene(engine: BABYLON.Engine): Scene {
  let hiirulainenScene = new HiirulainenScene(engine);
  hiirulainenScene.preventDefaultOnPointerDown = true;
  hiirulainenScene.preventDefaultOnPointerUp = true;
  return hiirulainenScene;
}
let verticalAxis = 0,
  horizontalAxis = 0,
  xTarget = 0,
  zTarget = 0,
  tryJump = false,
  moveVector = Vector3.Zero();

function createInputControls(scene: Scene, player: Player): void {
  scene.preventDefaultOnPointerDown = true;
  scene.preventDefaultOnPointerUp = true;
  const keyboardControlsToActionsMap = {
    "ArrowDown": "Down",
    "ArrowUp": "Up",
    "ArrowRight": "Right",
    "ArrowLeft": "Left",
    " ": "Jump"
  };

  const inputControlsMap = {
    "Down": false,
    "Up": false,
    "Left": false,
    "Right": false,
    "Jump": false
  };

  scene.onPointerObservable.add((pointerInfo: BABYLON.PointerInfo) => {

    if (pointerInfo.type === PointerEventTypes.POINTERDOUBLETAP) {
      inputControlsMap["Jump"] = true;
      xTarget = 0;
      zTarget = 0;
    } else if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
      inputControlsMap["Jump"] = false;
      const ray = pointerInfo.pickInfo.ray;
      let hit = scene.pickWithRay(ray);
      if (hit.pickedMesh.id) {
        xTarget = hit.pickedPoint.x - player.position.x;
        zTarget = hit.pickedPoint.z - player.position.z;
      }
    }

    else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
      xTarget = 0;
      zTarget = 0;
      inputControlsMap["Jump"] = false;

    } else {
      inputControlsMap["Jump"] = false;

    }
  });


  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
    trigger: BABYLON.ActionManager.OnKeyDownTrigger,
    parameter: ' '
  },
    () => {
      console.log('SPACE button was pressed');
      inputControlsMap["Jump"] = true;
    })
  );
  let
    vertical = 0,
    horizontal = 0;
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
    (event: BABYLON.ActionEvent) => {
      if (!keyboardControlsToActionsMap[event.sourceEvent?.key]) {
        console.warn("keyboard key not mapped: " + event.sourceEvent.key);
        return;
      }
      inputControlsMap[keyboardControlsToActionsMap[event.sourceEvent.key]] = false;
    }));


  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
    (event: BABYLON.ActionEvent) => {
      if (!keyboardControlsToActionsMap[event.sourceEvent?.key]) {
        console.warn("keyboard key not mapped: " + event.sourceEvent.key);
        return;
      }
      inputControlsMap[keyboardControlsToActionsMap[event.sourceEvent.key]] = true;
    }));

  function updateControls() {
    const lerpAmount = 0.2;
    const lerpAmountSlow = 0.8;

    if (inputControlsMap["Up"]) {
      vertical = Scalar.Lerp(vertical, 1, lerpAmount);
      verticalAxis = 1;

    } else if (inputControlsMap["Down"]) {
      vertical = Scalar.Lerp(vertical, -1, lerpAmount);
      verticalAxis = -1;
    } else {
      vertical = 0;
      verticalAxis = 0;
    }

    if (inputControlsMap["Left"]) {
      horizontal = Scalar.Lerp(horizontal, -1, lerpAmountSlow);
      horizontalAxis = -1;

    } else if (inputControlsMap["Right"]) {
      horizontal = Scalar.Lerp(horizontal, 1, lerpAmount);
      horizontalAxis = 1;
    }
    else {
      horizontal = 0;
      horizontalAxis = 0;
    }

    if (inputControlsMap["Jump"]) {
      tryJump = true;
    } else {
      tryJump = false;
    }
  }

  scene.onBeforeRenderObservable.add(() => {
    updateControls();
    const scaleFactor = 0.2;
    moveVector = new Vector3(horizontal, 0, vertical).normalize().scaleInPlace(scaleFactor);
    const pointerVector = new Vector3(xTarget, 0, zTarget).normalize();
    if (pointerVector.length() > 0) {
      horizontalAxis = pointerVector.x;
      verticalAxis = pointerVector.z;
      moveVector = pointerVector.scaleInPlace(scaleFactor);

    }
    /*
    if (xTarget > 0 || zTarget > 0) {
      moveVector = new Vector3(xTarget, 0, zTarget).normalize().scaleInPlace(0.1);
    }
    console.log('final move vector', moveVector)
    player.fixRotation();
  */
  });

}

function createColliderActions(scene: Scene, { player, aiti }: ObjectsModel): void {
  player.mesh.physicsImpostor.registerOnPhysicsCollide(objects.ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

  player.mesh.physicsImpostor.registerOnPhysicsCollide(objects.ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

}

function createPickableActions({ scores }: UIModel, { collectibles, player }: ObjectsModel): void {
  collectibles.forEach(collectible => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: collectible.mesh
    },
      (event: ActionEvent) => {
        createHiirulainenAudio("pickup.mp3", scene, {
          //autoplay: true,
          length: 0.3,
          volume: 0.1
        });
        collectible.mesh.dispose(false, true);
        collectible.mesh = null;
        scores.text = (parseInt(scores.text, 10) + collectible.points).toString();
        player.mesh.actionManager.unregisterAction(iaction);

        // Create a particle system
        const particleSystem = new BABYLON.ParticleSystem("particles", 60000, scene);
        // Speed
        particleSystem.minEmitPower = 55;
        particleSystem.maxEmitPower = 60;
        particleSystem.minSize = 10;
        // particleSystem.min

        particleSystem.maxLifeTime = 1;
        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("./textures/flare_01.png");

        // Position where the particles are emiited from
        particleSystem.emitter = player.mesh.absolutePosition;
        particleSystem.color1 = new Color4(0, 1, 0, 0.5);
        particleSystem.color2 = new Color4(0, 1, 0, 1);
        particleSystem.start();
        particleSystem.targetStopDuration = 0.5;
      }));
  });

}


function createActions(scene: Scene, objects: ObjectsModel, ui: UIModel): void {
  const { player, ground } = objects;
  createInputControls(scene, player);
  createColliderActions(scene, objects);
  //createPickableActions(ui, objects);
}

function createShadows(scene: Scene, objects: ObjectsModel): void {
  const light = new BABYLON.DirectionalLight("dir01", new Vector3(0, -1, 0), scene);
  light.position = new BABYLON.Vector3(40, 10, 40);
  light.intensity = 0.3;
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  objects.collectibles.forEach(collectible => shadowGenerator.getShadowMap().renderList.push(collectible.mesh));

  shadowGenerator.getShadowMap().renderList.push(objects.player.vartaloMesh);

}

function createUI(scene: Scene): UIModel {
  var ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui");
  const textBlock = new GUI.TextBlock("score", "5");
  textBlock.color = "yellow";
  textBlock.fontSize = "50";
  textBlock.fontWeight = "bold";
  textBlock.fontFamily = "Verdana";
  textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  textBlock.setPadding("30", "30", null, null);
  ui.addControl(textBlock);
  const textBlock2 = new GUI.TextBlock("hiirulainenPeli", "Hiirulaispeli");
  textBlock2.color = "red";
  textBlock2.fontSize = "50";
  textBlock2.fontWeight = "bold";
  textBlock2.fontFamily = "Verdana";
  textBlock2.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  textBlock2.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  textBlock2.setPadding("30", null, "30", "30");
  ui.addControl(textBlock2);
  return {
    scores: textBlock
  };
  //  ui.addControl(new GUI.InputText("kee", "keijo"));

}

function createCars(scene: Scene): void {

  const car = new AutoObject(scene);
  car.setPosition(0, 2, 0);
  car.setScale(12);
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

  car.mesh.animations = [];
  car.mesh.animations.push(animCar);

  scene.beginAnimation(car.mesh, 0, 300, true);
}

function createHiirulainenAudio(filenameWithoutPath: string, scene: Scene, options: ISoundOptions): Promise<HiirulainenAudio> {
  return new Promise((resolve, _) => {
    const hiirulainenAudio = new HiirulainenAudio(filenameWithoutPath, scene, () => {
      resolve(hiirulainenAudio);
    }, options);
  });
}

function afterAudioPlayedCreateNewPlayeable(audio: HiirulainenAudio, newAudioPromise: Promise<HiirulainenAudio>): Promise<HiirulainenAudio> {
  return new Promise(resolve => {
    audio.onEndedObservable.add(() => {
      resolve(newAudioPromise);
    });

  });

}

function startLaskeminen(scene: Scene) {
  createHiirulainenAudio("Yksi.m4a", scene, {
    loop: false,
    volume: 0.6
  }).then((audio: HiirulainenAudio) => {
    audio.play(2);
    return afterAudioPlayedCreateNewPlayeable(
      audio,
      createHiirulainenAudio("Kaksi.m4a", scene, null));
  }).then((newAudio: HiirulainenAudio) => {
    newAudio.play(1);
    return afterAudioPlayedCreateNewPlayeable(newAudio,
      createHiirulainenAudio("Kolme.m4a", scene, null));
  }).then((newAudio: HiirulainenAudio) => {
    newAudio.play(1);
    return afterAudioPlayedCreateNewPlayeable(newAudio,
      createHiirulainenAudio("Nelja.m4a", scene, null));
  }).then((newAudio: HiirulainenAudio) => {
    newAudio.play(1);
    return afterAudioPlayedCreateNewPlayeable(newAudio,
      createHiirulainenAudio("Viisi.m4a", scene, {
        volume: 0.4
      }));
  }).then((newAudio: HiirulainenAudio) => {
    newAudio.play(1);
    return afterAudioPlayedCreateNewPlayeable(newAudio,
      createHiirulainenAudio("Tullaan.m4a", scene, null));
  }).then((newAudio: HiirulainenAudio) => {
    newAudio.play(2);
  });

  /*
   () => {
     console.log('hei vaan!');
     const audio3 = new HiirulainenAudio("Kolme.m4a", scene);
     const audio4 = new HiirulainenAudio("Nelja.m4a", scene);
     const audio5 = new HiirulainenAudio("Viisi.m4a", scene, null, {
     });
     const tullaan = new HiirulainenAudio("Tullaan.m4a", scene, null);
     audio.onEndedObservable.add(() => {
       console.log("valmix yksf");
      
       const audio2 = new HiirulainenAudio("Kaksi.m4a", scene, () => {
         audio2.play(1.5);
         audio2.onEndedObservable.add(() => {
           audio3.play(1.5);
           audio3.onEndedObservable.add(() => {
             audio4.play(1.5);
             audio4.onEndedObservable.add(() => {
               audio5.play(1.5);
               audio5.onEndedObservable.add(() => {
                 tullaan.play(1.5);

               })

             });

           });
         });
         

       });
       
     });
    // audio.play();
    */
}
function createAudio(scene: Scene): void {

  createHiirulainenAudio("tunetank.mp3", scene, {
    volume: 0.2, autoplay: false, loop: true
  }).then((audio: HiirulainenAudio) => audio.play());

  startLaskeminen(scene);
}

function createEnvironment(scene: Scene): ObjectsModel {
  createSkybox(scene);
  const ground = new HiirulainenTerrain(scene);
  const player = new Player(scene);
  player.setPosition(35, 1.5, 47);

  const collectibles = [];
  const bounds = ground.getBounds();
  const orvokit = [];
  for (let i = 0; i < 10; i++) {
    const orvokkiObject = new OrvokkiObject(scene);
    orvokkiObject.setPosition(40 + (i * 3), 2, 50);
    orvokit.push(orvokkiObject);
  }

  scene.onBeforeRenderObservable.add(() => {
    orvokit.forEach(orvokki => {
      const direction = player.mesh.position.subtract(orvokki.mesh.position);
      orvokki.mesh.rotationQuaternion = Quaternion.Slerp(orvokki.mesh.rotationQuaternion, rotateTowards(direction, camera), 0.2);
    });

  });




  for (let i = 0; i < 15; i++) {
    const collectible = new TimanttiObject(scene, i);
    collectible.mesh.animations.push(createRenkaanPyoriminen());
    collectible.mesh.position.y = 1;
    collectible.setPosition(
      HiirulainenTerrain.randomIntFromInterval(bounds[0].x, bounds[1].x),
      1,
      HiirulainenTerrain.randomIntFromInterval(bounds[0].z + 50, bounds[1].z - 50));
    scene.beginAnimation(collectible.mesh, 0, 30, true);
    collectibles.push(collectible);
  }

  const taloCount = 10;
  const syvyysCount = 2;
  for (let j = 1; j <= syvyysCount; j++) {
    for (let i = 1; i <= taloCount; i++) {
      const talo = new TaloObject(scene, 1);
      talo.setPosition(bounds[0].x + (10 * i), 0, -100 + (20 * j));
      talo.setScale(HiirulainenTerrain.randomIntFromInterval(5, 8));
      talo.rotate(Math.PI / 2)
    }

    const ravintola = new TaloObject(scene, 3000);
    //   ravintola.mesh.scaling.x = 100;
    //  ravintola.mesh.scaling.y = 50;
    ravintola.setPosition(25, 0, 50);
    ravintola.setScale(5);
    ravintola.mesh.scaling.x = 25;
    ravintola.mesh.scaling.y = 20;
    ravintola.mesh.position.y = -4;

  }


  const aiti = new AitiObject(scene);
  aiti.setPosition(40, 2, 47);
  const talo2 = new TaloObject(scene, 2);
  talo2.setPosition(3, 0, 15);
  talo2.setScale(HiirulainenTerrain.randomIntFromInterval(4, 7));

  new RoadObject(scene);
  const maikit = [];
  const piilopaikat = [new Vector2(-40, 20), new Vector2(0, -90), new Vector2(-5, -85), new Vector2(-60, 30)];
  for (let i = 0; i <= 10; i++) {
    const maikki = new MaikkiObject(scene, HiirulainenTerrain.randomIntFromInterval(0, 4));
    maikki.setPosition(HiirulainenTerrain.randomIntFromInterval(24, 35), 1.5, HiirulainenTerrain.randomIntFromInterval(26, 43));
    //const newPiilopaikka = new Vector2(HiirulainenTerrain.randomIntFromInterval(-24, 35), HiirulainenTerrain.randomIntFromInterval(-24, -50));
    maikki.setPiilopaikka(piilopaikat[HiirulainenTerrain.randomIntFromInterval(0, piilopaikat.length - 1)]);
    maikit.push(maikki);
  }
  createTrees(scene);
  createGrass(scene);
  createCars(scene);
  return {
    player,
    ground,
    aiti,
    collectibles,
    piilotettavat: maikit
  };

}



const scene: Scene = createScene(engine);

const objects = createEnvironment(scene);
createAudio(scene);
const uiModel = createUI(scene);
createActions(scene, objects, uiModel);
createShadows(scene, objects)

const path = new Path([
  new Vector2(-3, -4),
  new Vector2(1, 9),
  new Vector2(-10, 3)

]);


let camera: ArcFollowCamera = new HiirulainenCamera(canvas, objects.player, scene);


let resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
  engine.resize()
});

new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

//const playerInput = new PlayerInput(scene);
const { player, aiti, piilotettavat } = objects;
let currentTimeInMilliseconds = 0;
let startTimeInWaypoint = -1;
scene.registerBeforeRender(() => {
  currentTimeInMilliseconds = new Date().getTime();
  player.mesh.moveWithCollisions(moveVector);
  player.checkJump(tryJump);
  player.checkRotation(horizontalAxis, verticalAxis, camera);
  if (path.isInLocation(aiti)) {
    if (startTimeInWaypoint === -1) {
      startTimeInWaypoint = new Date().getTime();
    }
    if (currentTimeInMilliseconds - startTimeInWaypoint > 2000) {
      path.changeWaypoint();
      startTimeInWaypoint = -1;
    }
  } else {
    // aiti.moveTowards(path.getCurrentWaypoint(), camera);
  }
  piilotettavat.forEach(piilotettava => {
    moveTowards(piilotettava.getMesh(), piilotettava.getPiilopaikka(), camera);

  });

});


engine.runRenderLoop(() => {
  scene.render();
  resizeObserver.observe(canvas);
});

function createTrees(scene: BABYLON.Scene) {
  const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/palmtree.png", 1000, { width: 512, height: 1024 }, scene);
  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    const treePositionX = Math.random() * (-100);
    const randomHeight = HiirulainenTerrain.randomIntFromInterval(15, 20);
    tree.position.x = treePositionX;

    tree.width = 10;
    tree.height = randomHeight;
    tree.position.set(treePositionX, randomHeight - 10, Math.random() * 50 + 15);
    const multaObject = new MultaObject();

    multaObject.setPosition(-100 + (calculateWidth(multaObject) / 2) + (i * calculateWidth(multaObject)), 0.1, 26);
  }
}

function createGrass(scene: BABYLON.Scene) {
  const nurmikkoCount = 15;
  for (let i = 0; i < nurmikkoCount; i++) {
    const nurmikkoObject = new NurmikkoObject(scene);
    nurmikkoObject.setPosition((-100 + NurmikkoObject.WIDTH / 2) + i * (NurmikkoObject.WIDTH), 0.1, -41);
  }
}

function createSkybox(scene: Scene) {
  scene.clearColor = new BABYLON.Color4(0.5, 0.6, 1, 0.9);
  scene.fogColor = new BABYLON.Color3(1, 0, 1);
  scene.fogDensity = 0.5;
  scene.ambientColor = new BABYLON.Color3(1, 1, 2);
}


