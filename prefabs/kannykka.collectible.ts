import { Mesh, Vector3 } from "babylonjs";
import { CollectibleModel } from "../models/collectible.model";
import { createPyoriminen, createSiirtyma } from "./animations";
import * as BABYLON from 'babylonjs';

export class Kannykka extends CollectibleModel {
  

  constructor(scene: BABYLON.Scene) {
    super();
  
    const material = new BABYLON.StandardMaterial("paita");
    material.diffuseTexture = new BABYLON.Texture("./../textures/pear/food_pears_asian_01_diff_4k.jpg");
    this.mesh.material = material;
    this.mesh.animations.push(createPyoriminen(this.mesh.rotation));
    const yPos = 1;
    this.mesh.animations.push(createSiirtyma([new Vector3(-4, yPos, 0), new Vector3(3, yPos, 5) ]))
    scene.beginAnimation(this.mesh, 0, 200, true, 0.5);
    /*
    this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnIntersectionEnterTrigger, (evt: BABYLON.ActionEvent) => {
      console.log('event', evt);

    }));
    */

  }



}