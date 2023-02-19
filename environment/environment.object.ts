import { AbstractMesh, Mesh, MeshBuilder, PhysicsImpostor, Scene } from "babylonjs";
export abstract class EnvironmentObject {


  protected mainMesh: AbstractMesh;
  constructor(name: string) {
    this.mainMesh= MeshBuilder.CreateBox(name);
    this.mainMesh.visibility = 0;
    this.mainMesh.position.x = 0;
    this.mainMesh.receiveShadows = true;

  }

  public setPosition(x: number, y: number, z:number): void {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

  public get mesh(): AbstractMesh {
    return this.mainMesh;
  }

  public setScale(scalingFactor:number): void {
    this.mesh.scaling.scaleInPlace(scalingFactor);
  }

  public rotate(amount: number): void {
    this.mesh.rotation.y = amount;
  }

}