import { ArcFollowCamera } from "babylonjs";
import { HiirulainenScene } from "./hiirulainen.scene";
import { Player } from './player';

export class HiirulainenCamera extends ArcFollowCamera {
  constructor(canvas: HTMLCanvasElement, player: Player, scene: HiirulainenScene) {
    super("Camera", -Math.PI / 2, Math.PI / 6, 20, player.mesh, scene);
    this.attachControl(canvas, false);
    this.speed = 0.2;
  }
}