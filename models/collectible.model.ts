import { Mesh, MeshBuilder } from "babylonjs";

export abstract class CollectibleModel {
  public mesh: Mesh;

  constructor() {
    this.mesh = MeshBuilder.CreateSphere("paaryna", {
      diameter: 1
    });
    this.mesh.isNearPickable = true;  
  }

  setPosition(x: number, y:number, z: number): void {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

  abstract get points(): number;

}