import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { AbstractMesh, ActionEvent, ActionManager, ArcFollowCamera, ArcRotateCamera, AssetsManager, CannonJSPlugin, Color3, Color4, ConeParticleEmitter, Engine, EventState, ExecuteCodeAction, FollowCamera, FreeCamera, HemisphericLight, Mesh, MeshBuilder, PhysicsImpostor, Quaternion, Scalar, Scene, Vector2, Vector3 } from 'babylonjs';
import { Player } from './prefabs/player';
import { Path } from './prefabs/path';
import { UIModel } from './models/ui.model';
import { AutoObject, NurmikkoObject, TimanttiObject, TaloObject, RoadObject, MultaObject } from './prefabs/environment/';

import { calculateWidth, moveTowards } from './utils/geometry.util';
import { AitiObject } from './prefabs/aiti.object';
import { MaikkiObject } from './prefabs/maikki.object';
import { ObjectsModel } from './models/objects.model';
import { HiirulainenAudio } from './audio/hiirulainen.audio';
import { HiirulainenTerrain } from './prefabs/hiirulainen.terrain';
import { PlayerInput } from './player-input';
import { HiirulainenCamera } from './prefabs/hiirulainen.camera';
import { HiirulainenScene } from './prefabs/hiirulainen.scene';
import { createRenkaanPyoriminen } from './prefabs/animations';
import * as serviceWorker from './service.worker';

let canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
var engine: Engine = new Engine(canvas, true);
if (Engine.audioEngine) {
  //Engine.audioEngine.useCustomUnlockedButton = true;
}
function createScene(engine: BABYLON.Engine): Scene {
  let hiirulainenScene = new HiirulainenScene(engine);
  return hiirulainenScene;
}
let verticalAxis = 0,
  horizontalAxis = 0,
  tryJump = false,
  moveVector = Vector3.Zero();

function createKeyboardActions(scene: Scene, player: Player): void {
  const speedAmount = 0.3;
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
    trigger: BABYLON.ActionManager.OnKeyDownTrigger,
    parameter: ' '
  },
    () => {
      console.log('SPACE button was pressed');
      tryJump = true;


    })
  );
  let
    vertical = 0,
    horizontal = 0;
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
    (event: BABYLON.ActionEvent) => {
      switch (event.sourceEvent?.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          vertical = 0;
          verticalAxis = 0;
          break;
        case ' ':
          tryJump = false;
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          horizontal = 0;
          horizontalAxis = 0;
          break;
        default:
          break;
      }
    }));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
    (event: BABYLON.ActionEvent) => {
      const lerpAmount = 1;
      switch (event.sourceEvent?.key) {
        case 'ArrowUp':
          vertical = Scalar.Lerp(vertical, speedAmount, lerpAmount);
          verticalAxis = 1;
          break;
        case 'ArrowDown':
          vertical = Scalar.Lerp(vertical, -speedAmount, lerpAmount);
          verticalAxis = -1;
          break;
        case 'ArrowRight':
          horizontal = Scalar.Lerp(horizontal, speedAmount, lerpAmount);
          horizontalAxis = 1;
          break;
        case "ArrowLeft":
          horizontal = Scalar.Lerp(horizontal, -speedAmount, lerpAmount);
          horizontalAxis = -1;
          break;
        default:
          // horizontal = 0, horizontalAxis = 0, vertical = 0, verticalAxis = 0;
          break;
      }
    }));
  scene.onBeforeRenderObservable.add(() => {
    moveVector = new Vector3(horizontal, 0, vertical).scaleInPlace(0.5);
    player.fixRotation();

  });

}

function createColliderActions(scene: Scene, { player, aiti }: ObjectsModel): void {
  player.mesh.physicsImpostor.registerOnPhysicsCollide(objects.ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

  player.mesh.physicsImpostor.registerOnPhysicsCollide(objects.ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

  const babylonSound = new HiirulainenAudio('mika_hatana.m4a', scene,
    () => { },
    {
      autoplay: false,
      loop: false,
      volume: 1.5
    });
  scene.registerBeforeRender(() => {
    const distance = Vector3.Distance(player.position, aiti.position);
    if (distance < 10 && !babylonSound.isPlaying) {
      //babylonSound.play();
    }
  });


}

function createPickableActions({ scores }: UIModel, { collectibles, player }: ObjectsModel): void {
  collectibles.forEach(collectible => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: collectible.mesh
    },
      (event: ActionEvent) => {
        new HiirulainenAudio("pickup.mp3", scene, () => { }, {
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
  createKeyboardActions(scene, player);
  createColliderActions(scene, objects);
  createPickableActions(ui, objects);
}

function createShadows(scene: Scene, objects: ObjectsModel): void {
  const light = new BABYLON.DirectionalLight("dir01", new Vector3(0, -1, 0), scene);
  light.position = new BABYLON.Vector3(40, 10, 40);
  light.intensity = 0.1;
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

function startLaskeminen(scene: Scene) {
  const audio = new HiirulainenAudio("Yksi.m4a", scene,

    () => {
      console.log('hei vaan!');
      const audio3 = new HiirulainenAudio("Kolme.m4a", scene, null);
      const audio4 = new HiirulainenAudio("Nelja.m4a", scene, null);
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
      audio.play();


    },
    {
      loop: false,
      volume: 1.5
    });

}

function createAudio(scene: Scene): void {
  const audio = new HiirulainenAudio("tunetank.mp3", scene, () => {
  }, {
    autoplay: true,
    volume: 0.2
  });

  startLaskeminen(scene);
}

function createEnvironment(scene: Scene): ObjectsModel {
  createSkybox(scene);
  const ground = new HiirulainenTerrain(scene);
  const player = new Player(scene);
  const collectibles = [];
  const bounds = ground.getBounds();
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
    createAudio(scene);

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


  /*
  player.mesh.physicsImpostor.registerOnPhysicsCollide(terrain.mesh.physicsImpostor, (collider: PhysicsImpostor, collideAgainst: PhysicsImpostor) => {
    console.log('collide against:'+collideAgainst);

  });
  */



}

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
const scene: Scene = createScene(engine);

const objects = createEnvironment(scene);
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


