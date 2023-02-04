import { Scene, StandardMaterial, Texture } from "babylonjs";

export class TextureMaterial extends StandardMaterial {
  constructor(scene: Scene, path: string) {
    const id =new Date().getTime();
    super("textureMaterial"+id);
    const texture = new Texture(path);
    this.diffuseTexture = texture;
  }



}