import { Mesh, Vector3 } from "babylonjs";
import { CollectibleModel } from "../models/collectible.model";
import { createPyoriminen, createSiirtyma } from "./animations";
import * as BABYLON from 'babylonjs';
import { HiirulainenTerrain } from "./hiirulainen.terrain";

export class Kannykka extends CollectibleModel {
  

  constructor(scene: BABYLON.Scene, index: number) {
    super();
  
    const material = new BABYLON.StandardMaterial("paita"+index);
    material.diffuseTexture = new BABYLON.Texture("./../textures/pear/food_pears_asian_01_diff_4k.jpg");
    this.mesh.material = material;
    this.mesh.animations.push(createPyoriminen(this.mesh.rotation));
    const yPos = 1;
    const { randomIntFromInterval } = HiirulainenTerrain;
    this.mesh.animations.push(createSiirtyma([new Vector3(randomIntFromInterval(-50, 50), 1, randomIntFromInterval(-50, 50)), new Vector3(randomIntFromInterval(-50, 50), 3, randomIntFromInterval(-50, 50)) ]))
    scene.beginAnimation(this.mesh, 0, 200, true, 0.2);
    /*
    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnIntersectionEnterTrigger, (evt: BABYLON.ActionEvent) => {
      console.log('event', evt);

    }));
    */

  }

  get points(): number {
    return 100;
  }



}