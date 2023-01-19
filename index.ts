import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { AbstractMesh, ActionEvent, ActionManager, ArcFollowCamera, ArcRotateCamera, AssetsManager, CannonJSPlugin, Color3, Color4, ConeParticleEmitter, Engine, ExecuteCodeAction, FollowCamera, FreeCamera, HemisphericLight, Mesh, MeshBuilder, PhysicsImpostor, Quaternion, Scalar, Scene, Vector2, Vector3 } from 'babylonjs';
import { Player } from './prefabs/player';
import { Path } from './prefabs/path';
import { UIModel } from './models/ui.model';
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

function createPickableActions({ scores }: UIModel, { collectibles, player }: ObjectsModel): void {
  collectibles.forEach(collectible => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: collectible.mesh

    },
      (event: ActionEvent) => {
        new BABYLON.Sound("pickup", './audio/pickup.mp3', scene, null, {
          autoplay: true,
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

function createEnvironment(scene: Scene): ObjectsModel {
  createSkybox(scene);
  const ground = new HiirulainenTerrain(scene);
  const player = new Player(scene);
  const collectibles = [];
  for (let i = 0; i < 15; i++) {
    const collectible = new Kannykka(scene, i);
    collectibles.push(collectible);
  }

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
    collectibles
  };


  /*
  player.mesh.physicsImpostor.registerOnPhysicsCollide(terrain.mesh.physicsImpostor, (collider: PhysicsImpostor, collideAgainst: PhysicsImpostor) => {
    console.log('collide against:'+collideAgainst);

  });
  */



}

const scene: Scene = createScene(engine);
new BABYLON.Sound("pickup", './audio/mika_hatana.m4a', scene, null, {
  autoplay: true,
  loop: true,
  volume: 1.5
});
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
