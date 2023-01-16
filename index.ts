import * as BABYLON from 'babylonjs';
import { AbstractMesh, ActionEvent, ActionManager, ArcFollowCamera, ArcRotateCamera, AssetsManager, CannonJSPlugin, Color3, Engine, ExecuteCodeAction, FollowCamera, FreeCamera, HemisphericLight, Mesh, MeshBuilder, PhysicsImpostor, Quaternion, Scalar, Scene, Vector2, Vector3 } from 'babylonjs';
import { Player } from './prefabs/player';
import { Path } from './prefabs/path';

import { TaloObject } from './prefabs/environment/talo.object';
import { AitiObject } from './prefabs/aiti.object';
import { MaikkiObject } from './prefabs/maikki.object';
import { ObjectsModel } from './models/objects.model';

import { Kannykka } from './prefabs/kannykka.collectible';
import { HiirulainenTerrain } from './prefabs/hiirulainen.terrain';
import { PlayerInput } from './player-input';
import { HiirulainenCamera } from './prefabs/hiirulainen.camera';
import { HiirulainenScene } from './prefabs/hiirulainen.scene';
let canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
var engine: Engine = new Engine(canvas, true);

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

function createColliderActions(scene: Scene, { player }: ObjectsModel): void {
  player.mesh.physicsImpostor.registerOnPhysicsCollide(objects.ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

  player.mesh.physicsImpostor.registerOnPhysicsCollide(objects.ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

}

function createPickableActions(scene: Scene, objects: ObjectsModel): void {
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
    parameter: objects.collectibles[0].mesh

  },

    (event: ActionEvent) => {
      console.log('ups');

    }));
}

function createActions(scene: Scene, objects: ObjectsModel): void {
  const { player, ground } = objects;
  createKeyboardActions(scene, player);
  createColliderActions(scene, objects);
  createPickableActions(scene, objects);
}

function createEnvironment(scene: Scene): ObjectsModel {
  createSkybox(scene);
  const ground = new HiirulainenTerrain(scene);
  const player = new Player(scene);
  const collectible = new Kannykka(scene);
  collectible.mesh.position.x = 4;
  collectible.mesh.position.y = 5;
  collectible.mesh.position.z = 3;
  const talo = new TaloObject(scene, 1);
  talo.setPosition(10, 10, -20);
  const aiti = new AitiObject(scene);
  const talo2 = new TaloObject(scene, 2);
  talo2.setPosition(3, 5, 15);
  for (let i = 0; i <= 10; i++) {
    const maikki = new MaikkiObject(scene, HiirulainenTerrain.randomIntFromInterval(0, 4));
    maikki.setPosition(HiirulainenTerrain.randomIntFromInterval(-40, 40), 3, HiirulainenTerrain.randomIntFromInterval(2, 50));
  }
  return {
    player,
    ground,
    aiti,
    collectibles: [collectible]
  };


  /*
  player.mesh.physicsImpostor.registerOnPhysicsCollide(terrain.mesh.physicsImpostor, (collider: PhysicsImpostor, collideAgainst: PhysicsImpostor) => {
    console.log('collide against:'+collideAgainst);

  });
  */



}

const scene: Scene = createScene(engine);
const objects = createEnvironment(scene);
createActions(scene, objects);

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
const { player, aiti } = objects;
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
    aiti.moveTowards(path.getCurrentWaypoint(), camera);
  }

});


engine.runRenderLoop(() => {
  scene.render();
  resizeObserver.observe(canvas);
});

function createSkybox(scene: Scene) {
  scene.clearColor = new BABYLON.Color4(0.5, 0.6, 1, 0.9);
  scene.fogColor = new BABYLON.Color3(1, 0, 1);
  scene.fogDensity = 0.5;
  scene.ambientColor = new BABYLON.Color3(1, 1, 2);
}
