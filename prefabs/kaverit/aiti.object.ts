import { ArcFollowCamera, Camera, PhysicsImpostor, Quaternion, Scene, Vector2, Vector3 } from "babylonjs";

import { AbstractHiiriObject } from '../abstract-hiiri.object';
import { moveTowards } from "../../utils/geometry.util";
 

 export class AitiObject extends AbstractHiiriObject {

   constructor(protected scene: Scene) {
    super(scene, "aiti");
    this.mesh.setAbsolutePosition(new Vector3(-5, 8, -3));
    this.mesh.scaling = new Vector3(2,2,2);
   
    /*
    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 10,
      friction: 0,
      restitution: 0,
      
   });
   */
   
   
    /*
    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { 
      friction: 0,

      pressure: 0, restitution: 0, mass: 5 });
    this.mesh.physicsImpostor.physicsBody.linearDamping = 0;
    this.mesh.physicsImpostor.physicsBody.angularDamping = 0;
    */
    //this.mesh.setDirection(Vector3.Left());

  }

  createBoxVector(): Vector3 {
    return new Vector3(4,8,4);
  }

  moveTowards(location: Vector2, camera: ArcFollowCamera): void {
    moveTowards(this.mesh, location, camera);
  }

}