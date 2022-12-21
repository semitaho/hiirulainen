import * as BABYLON from 'babylonjs';
import { ArcRotateCamera, AssetsManager, Engine,   FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from 'babylonjs';
import { GrassProceduralTexture, CloudProceduralTexture } from 'babylonjs-procedural-textures';
import { createHiirulainen } from './prefabs/player';
var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);

function createScene(): Scene {
  var scene: Scene = new Scene(engine);

  var camera: FreeCamera = new FreeCamera("Camera", new BABYLON.Vector3(5, 3, -3), scene);


  

  var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

  let meshHiirulainen =createHiirulainen(scene);
  camera.setTarget(meshHiirulainen.position);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
  let groundMaterial = new BABYLON.StandardMaterial("grassMat", scene);

  let grassTexture = new GrassProceduralTexture("grassTex", 128, scene);
  groundMaterial.ambientTexture = grassTexture;
  ground.material = groundMaterial;
  // groundMaterial.diffuseColor = BABYLON.Color3.Red();
  scene.addMesh(ground);

  return scene;
}

const scene: Scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});