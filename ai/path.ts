import { Vector2, Vector3 } from "babylonjs";
import { Enemy } from "../models";
export class Path {
  

  private readonly WAYPOINT_DISTANCE = 1;

  private currentWaypointIndex:number;
  constructor(private points: Vector2[]) {
    this.currentWaypointIndex = 0;
  }

  isInLocation(object: Enemy): boolean {

    const currentWaypoint = this.getCurrentWaypoint();
    const distance = Vector3.Distance( object.mesh.position, new Vector3(currentWaypoint.x, object.mesh.position.y, currentWaypoint.y)) 
    if (distance <= this.WAYPOINT_DISTANCE)  {
      return true;
    } 
    return false;
  }

  changeWaypoint(): void  {
    this.currentWaypointIndex += 1;
    if (this.currentWaypointIndex >= this.points.length) {
      this.currentWaypointIndex = 0;
    }
  }

  getCurrentWaypoint(): Vector2 {
    return this.points[this.currentWaypointIndex];
  }
}