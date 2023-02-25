import { HiirulainenScene } from "./hiirulainen.scene";
import * as BABYLON from 'babylonjs';
import { UIModel } from "../models/ui.model";
import { ObjectsModel } from "../models/objects.model";
import { Scene, ShadowGenerator, Vector3 } from "babylonjs";

export function createScene(engine: BABYLON.Engine): HiirulainenScene {
  let hiirulainenScene = new HiirulainenScene(engine);
  hiirulainenScene.preventDefaultOnPointerDown = true;
  hiirulainenScene.preventDefaultOnPointerUp = true;
  return hiirulainenScene;
}

export function createShadows(scene: Scene, objects: ObjectsModel): ShadowGenerator {
  const light = new BABYLON.DirectionalLight("dir01", new Vector3(0, -1, 0), scene);
  light.position = new BABYLON.Vector3(40, 10, 40);
  light.intensity = 0.5;
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  objects.collectibles.forEach(collectible => shadowGenerator.getShadowMap().renderList.push(collectible.mesh));
  objects.pickables.forEach(pickable => shadowGenerator.getShadowMap().renderList.push(pickable.mesh));

  shadowGenerator.getShadowMap().renderList.push(objects.player.vartaloMesh);
  return shadowGenerator;
}
export async function registerServiceWorker(){
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: '.'
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
}
