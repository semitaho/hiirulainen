import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, Texture } from "babylonjs";
import { EnvironmentObject } from "../environment.object";
import * as BABYLON from 'babylonjs';
import { TextureMaterial } from "../../textures/texture.material";
export class ObsticleObject extends EnvironmentObject {

  private _mesh: Mesh;
  constructor(scene: Scene, textureFile: string) {
    super("obsticle");
    this._mesh = MeshBuilder.CreateBox("obsticleBox", {
      height: 1,
      width: 5,
      depth: 5,
    
    });

    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      friction: 1,
      damping: 0,
      restitution: 0,
    })
    this.mesh.receiveShadows = true;
    this.mesh.material = new TextureMaterial(scene, "./textures/"+textureFile);;
  

  }

  get mesh(): Mesh {
    return this._mesh;
  }

}