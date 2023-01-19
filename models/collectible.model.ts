import { Mesh, MeshBuilder } from "babylonjs";

export abstract class CollectibleModel {
  public mesh: Mesh;

  constructor() {
    this.mesh = MeshBuilder.CreateSphere("paaryna", {
      diameter: 1
    });
    this.mesh.isNearPickable = true;  
  }

  abstract get points(): number;

}