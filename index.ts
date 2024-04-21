import * as BABYLON from 'babylonjs';
import { AbstractMesh, ArcFollowCamera, Engine, HemisphericLight, Mesh, Quaternion, Scene, Vector2, Vector3 } from 'babylonjs';

import { loadAudio } from './audio';
import { UIModel } from './models/ui.model';
import { createScene, createShadows, registerServiceWorker } from './core';
import { moveTowards, randomIntFromInterval, rotateTowards, toVector3 } from './utils/geometry.util';
import { createEnvironment } from './environment';
import { createGameGUI, createFullScreenUI, createStartMenu } from './gui/gui.creator'
import { ObjectsModel } from './models/objects.model';
import { EnemyAi } from './ai';
import { createInputControls } from './player/player.input';
import { HiirulainenCamera } from './core/hiirulainen.camera';
import { AudiosModel } from './models/audios.model';
import { HiirulainenAudio } from './audio/hiirulainen.audio';
import { ampaiseVittuun, vilkkuminen } from './core/animations';
import { DEFAULT_ENDING_SCORES, FALLING_POSITION_WHEN_RESTART } from "./core/config";
import * as GUI from 'babylonjs-gui';
import { Player } from './player/player';

function createColliderActions(scene: Scene, { player, obsticles, grounds }: ObjectsModel): void {
  grounds.forEach(ground => {
    player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.mesh.physicsImpostor, () => {
      player.toggleJump(false);
    });
  })


  obsticles.forEach(obsticle =>
    player.mesh.physicsImpostor.registerOnPhysicsCollide(obsticle.mesh.physicsImpostor, () => {
      player.toggleJump(false);
    }));
}

function onCollisionWith(player: Player, collidable: AbstractMesh, colliderFn: () => void): void {
  player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
    parameter: collidable
  }, colliderFn));
}

function createPickableActions(scene: Scene, { scores, ui, omenaTekstiBlock, slider }: UIModel, { orvokit, piilotettavat, enemies, player, pickables }: ObjectsModel, { loytyi }: AudiosModel): void {
  let pisteet = 0;

  orvokit.forEach(orvokki => {
    onCollisionWith(player, orvokki.mesh, () => {
      if (player.isHitAnimationRunning())

      console.log('vooi orvokki', orvokki);
    });

  });
  enemies.forEach(enemy => {
    onCollisionWith(player, enemy.mesh, () => {
      console.log('enemy hit', enemy);
      slider.value -= enemy.hitPoints;
      if (slider.value <= 0) {
        console.log("begin DIE!");
      } else {
        player.mesh.getChildren().forEach(childMesh => {
          scene.beginDirectHierarchyAnimation(childMesh, false, [vilkkuminen()], 0, 60, false);

        });
      }
    });
    

  });
  pickables.forEach(pickable => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: pickable.mesh
    }, () => {
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
      () => {
        piilotettava.setLoydetty();
        loytyi.then((audio: HiirulainenAudio) => {
          const playbackRate = randomIntFromInterval(50, 150) / 100;
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

function restartGame(scene: Scene, timeoutInMillis = 3000): void {
  setTimeout(() => {
    scene.dispose();
    loadGame(scene.getEngine())
      .then(() => {
        console.log('game loaded!');
        engine.hideLoadingUI();
      });


  }, timeoutInMillis);
}

function createActions(scene: Scene, camera: HiirulainenCamera, objects: ObjectsModel, audios: AudiosModel, ui: UIModel): void {
  const { player } = objects;
  createInputControls(scene, camera, player);
  createColliderActions(scene, objects);
  createPickableActions(scene, ui, objects, audios);
}





async function loadGame(engine: Engine): Promise<void> {

  engine.displayLoadingUI();
  console.log('doing some stuff...');
  const scene: Scene = createScene(engine);

  new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
  const objects = await createEnvironment(scene);
  var uiControl = createFullScreenUI();
  const startMenu = createStartMenu(uiControl);

  startMenu.onPointerClickObservable.add(() => {
    console.log('start clicked!');
    uiControl.removeControl(startMenu);
    const uiModel = 
    createGameGUI(uiControl);

    const audios = loadAudio(scene);
    createActions(scene, camera, objects, audios, uiModel);
  
    scene.registerBeforeRender(() => {
      inRender(scene, camera, objects);
    });

  });
  const camera: ArcFollowCamera = new HiirulainenCamera(canvas, objects.player, scene);
  engine.runRenderLoop(() => {
    scene.render();
    resizeObserver.observe(canvas);
  });
  createShadows(scene, objects)
  const resizeObserver: ResizeObserver = new ResizeObserver(() => {
    engine.resize()
  });
 

  return scene.whenReadyAsync(true);


}


function checkIfDeadAnimationRunning(mesh: Mesh): boolean {
 return mesh.animations.filter((animation: BABYLON.Animation) => 
    animation.name == 'ampaise'
  )
  .filter((animation: BABYLON.Animation) => animation.hasRunningRuntimeAnimations)
  .length > 0;
}

function inRender(scene: Scene, camera: HiirulainenCamera, { orvokit, player, piilotettavat, puput }: ObjectsModel): void {
  if (player.position.y < FALLING_POSITION_WHEN_RESTART) {
    restartGame(camera.getScene(), 0);
    return;
  }
  orvokit.forEach(orvokki => {
    kaannyKohtiHiirulaista(player, orvokki.mesh, camera);
  });
  if (player.isHitAnimationRunning()) {
    orvokit.forEach(orvokki => {

      if (player.mesh.intersectsMesh(orvokki.mesh) && !checkIfDeadAnimationRunning(orvokki.mesh)) {
        console.log('joo tässä nyt git');
        scene.beginDirectAnimation(orvokki.mesh, [ampaiseVittuun(orvokki.position.y)],0, 30);

      }
    });
   
  }

  puput.forEach(pupu => {
    EnemyAi.executeBehaviour(camera, engine.getDeltaTime(), pupu, player);
  });
  player.mesh.physicsImpostor.setAngularVelocity(player.mesh.physicsImpostor.getAngularVelocity().scale(0))

  piilotettavat
    .filter(piilotettava => piilotettava.missing)
    .forEach(piilotettava => {
      moveTowards(piilotettava.getMesh(), toVector3(piilotettava.getPiilopaikka()), camera);
    });
}
registerServiceWorker();
const canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
console.log('jeejee');

const engine: Engine = new Engine(canvas, false);
loadGame(engine).then(() => {
  console.log('game loaded!');
  engine.hideLoadingUI();
});
function kaannyKohtiHiirulaista(player: Player, mesh: AbstractMesh, camera: HiirulainenCamera) {
  rotateTowards(mesh, player.mesh.position, camera);

}

