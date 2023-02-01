import { HiirulainenScene } from "./hiirulainen.scene";
import * as BABYLON from 'babylonjs';
import { UIModel } from "../models/ui.model";
import * as GUI from 'babylonjs-gui';
import { ObjectsModel } from "../models/objects.model";
import { Scene, Vector3 } from "babylonjs";

export function createScene(engine: BABYLON.Engine): HiirulainenScene {
  let hiirulainenScene = new HiirulainenScene(engine);
  hiirulainenScene.preventDefaultOnPointerDown = true;
  hiirulainenScene.preventDefaultOnPointerUp = true;
  return hiirulainenScene;
}

export function createShadows(scene: Scene, objects: ObjectsModel): void {
  const light = new BABYLON.DirectionalLight("dir01", new Vector3(0, -1, 0), scene);
  light.position = new BABYLON.Vector3(40, 10, 40);
  light.intensity = 0.3;
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  objects.collectibles.forEach(collectible => shadowGenerator.getShadowMap().renderList.push(collectible.mesh));
  shadowGenerator.getShadowMap().renderList.push(objects.player.vartaloMesh);
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

export function createUI(scene: HiirulainenScene): UIModel {
  var ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui");
  const textBlock = new GUI.TextBlock("score", "0");
  textBlock.color = "yellow";
  textBlock.fontSize = "50";
  textBlock.fontWeight = "bold";
  textBlock.fontFamily = "Verdana";
  textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  textBlock.setPadding("30", "30", null, null);
  ui.addControl(textBlock);
  const textBlock2 = new GUI.TextBlock("hiirulainenPeli", "Hiirulaispeli");
  textBlock2.color = "red";
  textBlock2.fontSize = "50";
  textBlock2.fontWeight = "bold";
  textBlock2.fontFamily = "Verdana";
  textBlock2.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  textBlock2.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  textBlock2.setPadding("30", null, "30", "30");
  ui.addControl(textBlock2);
  return {
    scores: textBlock
  };
}