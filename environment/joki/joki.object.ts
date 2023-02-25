import { Scene, Texture } from "babylonjs";
import { EnvironmentObject } from "../environment.object";
import * as BABYLON from 'babylonjs';
import { TextureMaterial } from "../../textures/texture.material";
import { createDefaultImpostor } from "../../core/physics.core";
import { Enemy } from "../../models";
export class JokiObject extends EnvironmentObject implements Enemy {
  constructor(scene: Scene) {
    super("joki");
    this.mainMesh = BABYLON.MeshBuilder.CreateBox("riverSurface", {
      width: 100,
      height: 5,
      depth: 20

    }, scene);
    const bumpAssetUrl = "/assets/joki/waterbump.png";
    const material = new TextureMaterial(scene, bumpAssetUrl);
    material.ambientTexture = new Texture(bumpAssetUrl)
    material.alpha = 0.5;
    // material.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
    this.mainMesh.material = material;
    this.mainMesh.receiveShadows = true;
    createDefaultImpostor(this.mainMesh, true);
  }
  get hitPoints(): number {
    return 10;
  }

}