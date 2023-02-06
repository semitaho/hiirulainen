import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from "babylonjs";
import { EnvironmentObject } from "./environment.object";
import { TextureMaterial } from './../../textures/texture.material';
export class MultaObject extends EnvironmentObject {
  private readonly MULTA_DEPTH = 30;

  private _mesh: Mesh;
  constructor(private scene: Scene) {
    super("multa");
    this._mesh = this.createMesh();
  }

  public get mesh(): Mesh {
    return this._mesh;
  }

  private createMesh(): Mesh {
    const mesh = MeshBuilder.CreateGround("multa" + Math.random(), {
      height: this.MULTA_DEPTH,
      width: 10
      
    });
    
    mesh.material = new TextureMaterial(this.scene,"./textures/soilMud.jpeg");
    mesh.receiveShadows = true;
    return mesh;



  }
}