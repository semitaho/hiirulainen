import { ActionManager, Engine, Scene } from "babylonjs";

export class HiirulainenScene extends Scene {

  constructor(engine: Engine) {
    super(engine);
    this.enablePhysics();
    this.collisionsEnabled = true;
    this.actionManager = new ActionManager(this);
  }
}