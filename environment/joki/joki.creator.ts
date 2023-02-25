import { Color3, Material, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import 'babylonjs-materials';
import { JokiObject } from './joki.object';

import * as BABYLON from 'babylonjs';
import { WaterMaterial } from "babylonjs-materials";
import { createDefaultImpostor } from "../../core/physics.core";
import { TextureMaterial } from "../../textures/texture.material";
export function createJoki(scene: Scene, bounds: Vector3[]): JokiObject {
 
  const joki = new JokiObject(scene);
  joki.setPosition(0,-2.8, 47);
  return joki;
}