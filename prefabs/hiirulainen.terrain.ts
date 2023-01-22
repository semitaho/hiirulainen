
import { Color4, GroundMesh, Mesh, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import "../extensions/babylon.dynamicTerrain.js";
import * as BABYLON from 'babylonjs';

export class HiirulainenTerrain {

  public mesh: BABYLON.GroundMesh;
  public constructor(scene: Scene) {

    this.mesh = MeshBuilder.CreateGround("hiirulainenGround", {
      width: 200,
      height: 200,   
    });
   
    const terrainMaterial = new BABYLON.StandardMaterial("materialGround");
    terrainMaterial.diffuseTexture = new BABYLON.Texture("./textures/snow/snow_02_diff_4k.jpg");
    this.mesh.material = terrainMaterial;
    this.mesh.alphaIndex =2;
    this.createTerrainCollider();
    this.mesh.receiveShadows = true;
  }

  private createTerrainCollider(): void {
    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      friction: 1,
      damping: 0,
      restitution: 0,
    });
    this.mesh.checkCollisions = false;
  }

  public static randomIntFromInterval(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

}