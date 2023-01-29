import { Mesh, MeshBuilder, PhysicsImpostor, Scene } from "babylonjs";
export abstract class EnvironmentObject {

  public mesh: Mesh;

  constructor(name: string) {
    this.mesh = MeshBuilder.CreateBox(name);
    this.mesh.visibility = 0;
    this.mesh.position.x = 0;
    this.mesh.receiveShadows = true;

  }

  public setPosition(x: number, y: number, z:number): void {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

  public setScale(scalingFactor:number): void {
    this.mesh.scaling.scaleInPlace(scalingFactor);
  }

  public rotate(amount: number): void {
    this.mesh.rotation.y = amount;
  }

}