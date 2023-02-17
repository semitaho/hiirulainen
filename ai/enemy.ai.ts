import { ArcFollowCamera, Vector3 } from "babylonjs";
import { AI_DISTANCE_TO_FOLLOW, AI_STOP_DISTANCE, TIME_IN_WAYPOINT_MS } from "../core/config";
import { Enemy } from "../models";
import { Rabbit } from "../prefabs/enemies";
import { Player } from "../prefabs/player";
import { moveTowards } from "../utils/geometry.util";
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

  static followPath(camera: ArcFollowCamera, deltaTimeMs: number, pupu: Rabbit) {
    const path = pupu.path;
    if (path.isInLocation(pupu)) {
      pupu.stopMove();
      pupu.timeInWaypointMs += deltaTimeMs;
      console.log('time', pupu.timeInWaypointMs);
      if (pupu.timeInWaypointMs >= TIME_IN_WAYPOINT_MS) {
        console.log("pitäs vaihtaa...");
        path.changeWaypoint();
        pupu.timeInWaypointMs = 0;
      }

    } else {
      moveTowards(pupu.mesh, path.getCurrentWaypoint(), camera);
      pupu.animateMove(0.1);
    }
  }

}