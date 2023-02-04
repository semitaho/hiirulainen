import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from "babylonjs";
import { PickableObject } from "./pickable.object";
import { createRenkaanPyoriminen } from "./../../core/animations";
import { TextureMaterial } from "../../textures/texture.material";
export class OmenaObject extends PickableObject {

  private _mesh: Mesh;
  constructor(scene: Scene) {
    super();

    this._mesh = MeshBuilder.CreateSphere("omena", {
      arc: 3
    }, scene);

    this.mesh.animations = [
     createRenkaanPyoriminen()
    ];
    this.mesh.material = new TextureMaterial(scene, "./textures/apple.jpeg");
    scene.beginAnimation(this._mesh, 0, 30, true, 0.5);
  }

  get mesh() {
    return this._mesh;
  }

  get points() {
    return 5;
  }


}