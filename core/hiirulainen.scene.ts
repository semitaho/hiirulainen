import { ActionManager, Engine, Scene } from "babylonjs";
import * as BABYLON from 'babylonjs';
import { DEFAULT_GRAVITY } from "./config";
export class HiirulainenScene extends Scene {

  constructor(engine: Engine) {
    super(engine);
    const gravityVector = new BABYLON.Vector3(0, DEFAULT_GRAVITY, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();

    this.enablePhysics(gravityVector, physicsPlugin);
    this.collisionsEnabled = true;
    this.actionManager = new ActionManager(this);
  }
}