import { Vector3 } from "babylonjs";
import { AI_DISTANCE_TO_FOLLOW, AI_STOP_DISTANCE } from "../core/config";
import { Enemy } from "../models";
import { Player } from "../prefabs/player";
export class EnemyAi {

  static shouldFollow(player: Player, enemy: Enemy) {
    if (Vector3.Distance(player.mesh.position, enemy.mesh.position) > AI_DISTANCE_TO_FOLLOW) {
      return false;
    }

    if (Vector3.Distance(player.mesh.position, enemy.mesh.position)  < AI_STOP_DISTANCE) {
      return false;
    }
    return true;
  }

}