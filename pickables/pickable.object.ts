import { Mesh } from "babylonjs";

export abstract class PickableObject {

  abstract get mesh(): Mesh;

  abstract get points();


  public setPosition(x: number, y: number, z:number): void {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

}