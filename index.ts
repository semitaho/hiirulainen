import * as BABYLON from 'babylonjs';
import { ArcFollowCamera, ArcRotateCamera, AssetsManager, CannonJSPlugin, Engine, FollowCamera, FreeCamera, HemisphericLight, Mesh, MeshBuilder, PhysicsImpostor, Scene, Vector3 } from 'babylonjs';
import { GrassProceduralTexture, CloudProceduralTexture } from 'babylonjs-procedural-textures';
import { Player } from './prefabs/player';
import { PlayerInput } from './player-input';
var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);

let resizeObserver: ResizeObserver;
function createScene(): Scene {
  var scene: Scene = new Scene(engine);
  scene.enablePhysics();
  scene.collisionsEnabled = true;
  const ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 30, height: 30 });
  ground.checkCollisions = true;
  ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
    mass: 0, restitution: 0,
    friction: 0.0
  });
  let groundMaterial = new BABYLON.StandardMaterial("grassMat", scene);

  let grassTexture = new GrassProceduralTexture("grassTex", 128, scene);
  groundMaterial.ambientTexture = grassTexture;
  ground.material = groundMaterial;
  // groundMaterial.diffuseColor = BABYLON.Color3.Red();

  scene.addMesh(ground);
  resizeObserver = new ResizeObserver((entries) => {
    engine.resize()
  });
  return scene;
}

const scene: Scene = createScene();
const player = new Player(scene);

let camera: ArcFollowCamera = new ArcFollowCamera("Camera",-Math.PI / 2, Math.PI / 4, 10, player.mesh, scene);
camera.speed = 0.2;
/*
camera.rotationOffset = 0;
camera.cameraAcceleration = 0.005;
camera.maxCameraSpeed = 10;

*/

new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
//camera.setTarget(new Vector3(0, 0, 0));
//var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
//const physicsInitialized =  scene.enablePhysics(gravityVector, physicsPlugin);
//console.log('is physics: '+physicsInitialized);
const playerInput = new PlayerInput(scene);
scene.registerBeforeRender(() => {
  player.mesh.moveWithCollisions(playerInput.moveDirection);
  player.checkJump(playerInput);
  player.checkRotation(playerInput, camera);


});
engine.runRenderLoop(() => {
  scene.render();
  resizeObserver.observe(canvas);
});