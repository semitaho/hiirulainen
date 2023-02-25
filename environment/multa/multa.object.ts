import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from "babylonjs";
import { Vector3 } from "babylonjs/index";
import { Groundable } from "../../models/groundable.model";
import { EnvironmentObject } from "../environment.object";
import { TextureMaterial } from './../../textures/texture.material';
export class MultaObject extends EnvironmentObject implements Groundable{
  private readonly MULTA_DEPTH = 30;

  private _mesh: Mesh;

  constructor(private scene: Scene, private materialTexture: TextureMaterial) {
    super("multa");
    this._mesh = this.createMesh();
  }
  getBounds(): Vector3[] {
    throw new Error("Method not implemented.");
  }

  public get mesh(): Mesh {
    return this._mesh;
  }

  private createMesh(): Mesh {
    const mesh = MeshBuilder.CreateGround("multa" + Math.random(), {
      height: this.MULTA_DEPTH,
      width: 10
      
    });
    
    mesh.material = this.materialTexture;
    mesh.receiveShadows = true;
    return mesh;



  }
}