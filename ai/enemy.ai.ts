import { ArcFollowCamera, Vector2, Vector3 } from "babylonjs";
import { AI_DISTANCE_TO_FOLLOW, AI_STOP_DISTANCE, TIME_IN_WAYPOINT_MS } from "../core/config";
import { Enemy } from "../models";
import { Rabbit } from "../enemies";
import { Player } from "../player/player";
import { moveTowards, rotateTowards, toVector3 } from "../utils/geometry.util";
export class EnemyAi {


  static shouldFollow(player: Player, enemy: Enemy) {
    if (Vector3.Distance(player.mesh.position, enemy.mesh.position) > AI_DISTANCE_TO_FOLLOW) {
      return false;
    }

    return true;
  }
  static isChased(player: Player, enemy: Enemy): boolean {
    return Vector3.Distance(player.mesh.position, enemy.mesh.position) < AI_STOP_DISTANCE
  }

  static executeBehaviour(camera: ArcFollowCamera, deltaTimeMs: number, pupu: Rabbit, player: Player): void {

    if (EnemyAi.isChased(player, pupu)) return;
    /*
    if (EnemyAi.shouldFollow(player, pupu)) {
      //moveTowards(pupu.mesh, new Vector2(player.position.x, player.position.z), camera, 0.1);
      const playerPosition2d = new Vector2(player.position.x, player.position.z);
      rotateTowards(pupu.mesh, player.position, camera);
      // pupu.animateRotation(new Vector2(player.position.x, player.position.z), camera);
      pupu.animateMove(playerPosition2d, 2);
    } */
    EnemyAi.followPath(camera, deltaTimeMs, pupu);

  }


  static followPath(camera: ArcFollowCamera, deltaTimeMs: number, pupu: Rabbit) {
    const path = pupu.path;
    if (path.isInLocation(pupu)) {
      pupu.stopMove();

      pupu.timeInWaypointMs += deltaTimeMs;
      if (pupu.timeInWaypointMs >= TIME_IN_WAYPOINT_MS) {
        path.changeWaypoint();
        pupu.timeInWaypointMs = 0;
        pupu.animateRotation(path.getCurrentWaypoint(), camera);
      }

    } else {
      rotateTowards(pupu.mesh, toVector3(path.getCurrentWaypoint()), camera);
      pupu.animateMove(path.getCurrentWaypoint());
      //moveTowards(pupu.mesh, toVector3(path.getCurrentWaypoint()), camera);
    }

    //
  }


}