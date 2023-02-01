import * as BABYLON from 'babylonjs';
import { ActionEvent, ArcFollowCamera, Engine, HemisphericLight, Quaternion, Scene, Vector3 } from 'babylonjs';

import { loadAudio } from './audio';
import { UIModel } from './models/ui.model';
import { createScene, createShadows, createUI, registerServiceWorker } from './core';
import { moveTowards, rotateTowards } from './utils/geometry.util';
import { createEnvironment } from './prefabs';
import { ObjectsModel } from './models/objects.model';
import { createInputControls } from './core/player.input';
import { HiirulainenCamera } from './prefabs/hiirulainen.camera';

function createColliderActions(scene: Scene, { player, piilotettavat, ground }: ObjectsModel): void {
  player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });

  player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.mesh.physicsImpostor, () => {
    player.toggleJump(false);
  });
}

function createPickableActions(scene: Scene, { scores }: UIModel, { piilotettavat, player }: ObjectsModel): void {
  piilotettavat.forEach(piilotettava => {
    const iaction = player.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
      parameter: piilotettava.getMesh()
    },
      (event: ActionEvent) => {

        piilotettava.setLoydetty();
        scene.beginAnimation(piilotettava.getMesh(), 0, 30, false);
        //piilotettava.getMesh().dispose(false, true);
        scores.text = (parseInt(scores.text, 20) + 1).toString();
        player.mesh.actionManager.unregisterAction(iaction);

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

function createActions(scene: Scene, camera: HiirulainenCamera, objects: ObjectsModel, ui: UIModel): void {
  const { player, ground } = objects;
  createInputControls(scene, camera, player);
  createColliderActions(scene, objects);
  createPickableActions(scene, ui, objects);
}


function loadGame(engine: Engine): Promise<void> {
  engine.displayLoadingUI();
  const scene: Scene = createScene(engine);
  new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
  const objects = createEnvironment(scene);
  loadAudio(scene);
  const uiModel = createUI(scene);
  let camera: ArcFollowCamera = new HiirulainenCamera(canvas, objects.player, scene);

  createActions(scene, camera, objects, uiModel);
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
  return scene.whenReadyAsync(true);

}
function inRender(camera: HiirulainenCamera, { orvokit, player, piilotettavat }: ObjectsModel): void {
  orvokit.forEach(orvokki => {
    const direction = player.mesh.position.subtract(orvokki.mesh.position);
    orvokki.mesh.rotationQuaternion = Quaternion.Slerp(orvokki.mesh.rotationQuaternion, rotateTowards(direction, camera), 0.2);
  });
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



