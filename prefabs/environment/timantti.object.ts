import * as BABYLON from 'babylonjs';
import { EnvironmentObject } from "./environment.object";

export class TimanttiObject extends EnvironmentObject {


  constructor(scene: BABYLON.Scene, index: number) {
    super("timantti"+ index);
    const material = new BABYLON.StandardMaterial("paita"+index);
    material.diffuseTexture = new BABYLON.Texture("./textures/pear/food_pears_asian_01_diff_4k.jpg");
    this.mesh.material = material;
   

  }

  get points(): number {
    return 100;
  }



}