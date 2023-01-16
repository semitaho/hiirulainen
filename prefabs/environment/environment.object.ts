import { Mesh, MeshBuilder, PhysicsImpostor, Scene } from "babylonjs";
export abstract class EnvironmentObject {

  public mesh: Mesh;

  constructor(name: string) {
    this.mesh = MeshBuilder.CreateBox(name, { height: 5, width: 1, depth: 1 });
    this.mesh.visibility = 0;

  }

  public setPosition(x: number, y: number, z:number): void {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

  public setScale(scalingFactor:number): void {
    this.mesh.position = this.mesh.scaling.scaleInPlace(scalingFactor);
  }
}