import * as BABYLON from 'babylonjs';
import { AbstractMesh, ActionEvent, ArcFollowCamera, Color3, Engine, HemisphericLight, Mesh, PhysicsImpostor, Quaternion, Scene, Vector3 } from 'babylonjs';

import { loadAudio } from './audio';
import { UIModel } from './models/ui.model';
import { createScene, createShadows, createUI, registerServiceWorker } from './core';
import { calculateWidth, moveTowards, rotateTowards } from './utils/geometry.util';
import { createEnvironment } from './prefabs/environment';
import { ObjectsModel } from './models/objects.model';
import { createInputControls } from './core/player.input';
import { HiirulainenCamera } from './prefabs/hiirulainen.camera';
import { AudiosModel } from './models/audios.model';
import { HiirulainenAudio } from './audio/hiirulainen.audio';
import { HiirulainenTerrain } from './prefabs/hiirulainen.terrain';
import { vilkkuminen } from './core/animations';
import { DEFAULT_ENDING_SCORES, FALLING_POSITION_WHEN_RESTART } from "./core/config";
import * as GUI from 'babylonjs-gui';
import { OrvokkiObject } from './prefabs/kaverit';
import { Player } from './prefabs/player';

function createColliderActions(scene: Scene, { player, obsticles, ground }: ObjectsModel): void {
  player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

  obsticles.forEach(obsticle =>
    player.mesh.physicsImpostor.registerOnPhysicsCollide(obsticle.mesh.physicsImpostor, () => {
      console.log('kjoo');
      player.toggleJump(false);
    }));



}

function createPickableActions(scene: Scene, { scores, ui, omenaTekstiBlock }: UIModel, { piilotettavat, enemies, player, pickables }: ObjectsModel, { loytyi }: AudiosModel): void {
  let pisteet = 0;
  enemies.forEach(enemy => {
    console.log('enemy', enemy);
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: enemy.mesh
    }, (event: ActionEvent) => {
      console.log('enemy hit', enemy);
      player.mesh.getChildren().forEach(childMesh => {
        scene.beginDirectHierarchyAnimation(childMesh, false, [vilkkuminen()], 0, 30, true);

      });

  

    }));

  });
  pickables.forEach(pickable => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: pickable.mesh
    }, (event: ActionEvent) => {
      pickable.mesh.dispose(true);
      pisteet += pickable.points;
      omenaTekstiBlock.text = "Pisteitä: " + pisteet;
      player.mesh.actionManager.unregisterAction(iaction);
      player.mesh.scaling.scaleInPlace(1.05);
      player.mesh.physicsImpostor.forceUpdate();

    }));
  });
  piilotettavat.forEach(piilotettava => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: piilotettava.getMesh()
    },
      (event: ActionEvent) => {

        piilotettava.setLoydetty();
        loytyi.then((audio: HiirulainenAudio) => {
          const playbackRate = HiirulainenTerrain.randomIntFromInterval(50, 150) / 100;
          audio.setPlaybackRate(playbackRate);
          audio.play();
        });
        scene.beginAnimation(piilotettava.getMesh(), 0, 30, false);
        //piilotettava.getMesh().dispose(false, true);
        scores.text = (parseInt(scores.text, 20) + 1).toString();
        player.mesh.actionManager.unregisterAction(iaction);
        if (scores.text === DEFAULT_ENDING_SCORES) {
          player.gameOver();
          const textBlock = new GUI.TextBlock("score", "Peli päättyi!");
          textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
          textBlock.paddingBottom = 10;
          textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          textBlock.color = "yellow";
          textBlock.fontSize = 60;
          ui.addControl(textBlock);
          restartGame(scene);

          //BABYLON.Animation.CreateAndStartAnimation("fadeout", textBlock, "alpha", 1, 30, 0, 30);
          // setTimeout(() => ui.removeControl(textBlock), 6000);
        }

        // Create a particle system
        /*
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
        */
      }));
  });

}

function restartGame(scene: Scene, timeoutInMillis: number = 3000): void {
  setTimeout(() => {
    scene.dispose();
    loadGame(scene.getEngine())
      .then(_ => {
        console.log('game loaded!');
        engine.hideLoadingUI();
      });


  }, timeoutInMillis);
}

function createActions(scene: Scene, camera: HiirulainenCamera, objects: ObjectsModel, audios: AudiosModel, ui: UIModel): void {
  const { player, ground } = objects;
  createInputControls(scene, camera, player);
  createColliderActions(scene, objects);
  createPickableActions(scene, ui, objects, audios);
}





function loadGame(engine: Engine): Promise<void> {
  engine.displayLoadingUI();
  const scene: Scene = createScene(engine);
  new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
  const objects = createEnvironment(scene);
  const audios = loadAudio(scene);
  const uiModel = createUI(scene);
  let camera: ArcFollowCamera = new HiirulainenCamera(canvas, objects.player, scene);

  createActions(scene, camera, objects, audios, uiModel);
  createShadows(scene, objects)
  let resizeObserver: ResizeObserver = new ResizeObserver(_ => {
    engine.resize()
  });
  engine.runRenderLoop(() => {
    scene.render();
    resizeObserver.observe(canvas);
  });
  scene.registerBeforeRender(() => {
    inRender(camera, objects);
  });
  //scene.debugLayer.show();
  return scene.whenReadyAsync(true);

}

function inRender(camera: HiirulainenCamera, { orvokit, player, piilotettavat, puput }: ObjectsModel): void {
  if (player.position.y < FALLING_POSITION_WHEN_RESTART) {
    restartGame(camera.getScene(), 0);
    return;
  }
  orvokit.forEach(orvokki => {
    kaannyKohtiHiirulaista(player, orvokki.mesh, camera);
  });

  puput.then(puputSync => puputSync.forEach(pupu => {
    kaannyKohtiHiirulaista(player, pupu, camera);

  }));;
  player.mesh.physicsImpostor.setAngularVelocity(player.mesh.physicsImpostor.getAngularVelocity().scale(0))

  piilotettavat
    .filter(piilotettava => piilotettava.missing)
    .forEach(piilotettava => {
      moveTowards(piilotettava.getMesh(), piilotettava.getPiilopaikka(), camera);
    });
}
registerServiceWorker();
let canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine: Engine = new Engine(canvas, true);
loadGame(engine).then(_ => {
  console.log('game loaded!');
  engine.hideLoadingUI();
});
function kaannyKohtiHiirulaista(player: Player, mesh: AbstractMesh, camera: HiirulainenCamera) {
  const direction = player.mesh.position.subtract(mesh.position);
  mesh.rotationQuaternion = Quaternion.Slerp(mesh.rotationQuaternion, rotateTowards(direction, camera), 0.2);
}

