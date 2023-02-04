import { Color3, MeshBuilder, PhysicsImpostor, Scene, Texture } from "babylonjs";
import { EnvironmentObject } from "./environment.object";
import * as BABYLON from 'babylonjs';
export class ObsticleObject extends EnvironmentObject {

  constructor(scene: Scene, textureFile: string) {
    super("obsticle");
    this.mesh = MeshBuilder.CreateBox("obsticleBox", {
      height: 1,
      width: 10,
      depth: 10,
    
    });

    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      friction: 1,
      damping: 0,
      restitution: 0,
    })
    this.mesh.receiveShadows = true;
    const material = new BABYLON.StandardMaterial("obsticleMaterial", scene);
    material.diffuseTexture = new Texture("./textures/"+textureFile, scene);

    this.mesh. material = material;
    


  }

}