import { ArcFollowCamera, Camera, PhysicsImpostor, Quaternion, Scene, Vector2, Vector3 } from "babylonjs";

import { createKasi } from './mesh.creator';
import { AbstractHiiriObject } from './abstract-hiiri.object';


 export class AitiObject extends AbstractHiiriObject {

   constructor(private scene: Scene) {
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
   
   // console.log('current pos', this.mesh.position);
   // const target =  new Vector3(0, location.y, 0).subtract(new  Vector3(0, this.mesh.position.y, 0));
    //this.mesh.rotate(Vector3.Up(),0.05)
    let angle = Math.atan2(location.x-this.mesh.position.x ,location.y-this.mesh.position.z);
    angle += camera.rotation.y;
    let targ = Quaternion.FromEulerAngles(0, angle, 0);
    this.mesh.rotationQuaternion =  Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 0.2);
    this.mesh.translate(Vector3.Forward(), 0.05);
   // this.mesh.translate()

    //   this.mesh.moveWithCollisions(location);
  
    /*
    let angle = Math.atan2(playerInput.horizontalAxis, playerInput.verticalAxis);
    angle += camera.rotation.y;
    let targ = Quaternion.FromEulerAngles(0, angle, 0);
    this.mesh.rotationQuaternion =
   // this.mesh.ro
   */
  }

}