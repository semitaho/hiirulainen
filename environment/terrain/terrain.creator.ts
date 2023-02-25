import { Scene } from "babylonjs";
import { createDefaultImpostor } from "../../core/physics.core";
import { Groundable } from "../../models/groundable.model";
import { TextureMaterial } from "../../textures/texture.material";
import { calculateWidth, randomIntFromInterval } from "../../utils/geometry.util";
import { MultaObject } from "../multa/multa.object";
import { TerrainObject } from './terrain.object';
export function createTerrains(scene: Scene): Groundable[] {
  const ground = new TerrainObject(scene, 80);
  const multaMaterial =  new   TextureMaterial(scene, "/textures/soilMud.jpeg");;
  const mullat = [];
  for (let i = 0; i < 20; i++) {
    const treePositionX = Math.random() * (-100);
    const randomHeight = randomIntFromInterval(15, 20);
    const multaObject = new MultaObject(scene, multaMaterial);
    multaObject.setPosition(-20 + (calculateWidth(multaObject) / 2) + (i * calculateWidth(multaObject)), 0, 70);
    createDefaultImpostor(multaObject.mesh, true);
    mullat.push(multaObject);
  }
 
  return [ground, ...mullat];
}