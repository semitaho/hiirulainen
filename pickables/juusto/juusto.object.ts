import { Scene } from "babylonjs";
import { Mesh } from "babylonjs/index";
import { PickableObject } from "../pickable.object";
import * as BABYLON from "babylonjs";
import { TextureMaterial } from "../../textures/texture.material";
export class JuustoObject extends PickableObject {

  private _mesh: Mesh;
  constructor(scene: Scene) {
    super();
    this._mesh = BABYLON.MeshBuilder.CreateDisc("disc", {tessellation: 3}, scene); // makes a triangle
    this._mesh.scaling.scaleInPlace(2);
    this._mesh.material = new TextureMaterial(scene, "./textures/juusto.jpg");

  }
  get mesh(): Mesh {
   return this._mesh;
  }
  get points(): number {
     return 7;
  }

}
