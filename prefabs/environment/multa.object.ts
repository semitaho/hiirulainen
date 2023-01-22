import { Mesh, MeshBuilder, StandardMaterial, Texture } from "babylonjs";
import { EnvironmentObject } from "./environment.object";

export class MultaObject extends EnvironmentObject {
  private readonly MULTA_DEPTH = 15;
  constructor() {
    super("multa");
    this.mesh = this.createMesh();
  }

  private createMesh(): Mesh {
    const mesh = MeshBuilder.CreateGround("multa" + Math.random(), {
      height: this.MULTA_DEPTH
    });
    
    const material = new StandardMaterial("multaMaterial");
    mesh.material = material;
    material.diffuseTexture = new Texture("./textures/soilMud.jpeg");
    return mesh;



  }
}