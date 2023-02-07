import { ArcFollowCamera, Mesh, Quaternion, Vector2, Vector3 } from "babylonjs";
import { EnvironmentObject } from "../prefabs/environment/environment.object";

export function calculateWidth(object: EnvironmentObject): number {
   const boundingBox = object.mesh.getBoundingInfo().boundingBox;
   return boundingBox.maximum.x - boundingBox.minimum.x;
}

export function convertColor(r: number, g: number, b:number): BABYLON.Color3 {
   return new BABYLON.Color3(r / 255, g / 255, b / 255);
}

export function moveTowards(mesh: Mesh, location: Vector2, camera: ArcFollowCamera): void {

   if (Vector3.Distance(mesh.position, new Vector3(location.x, mesh.position.y, location.y)) < 0.5) {
      return;
   }
   // console.log('current pos', this.mesh.position);
   // const target =  new Vector3(0, location.y, 0).subtract(new  Vector3(0, this.mesh.position.y, 0));
   //this.mesh.rotate(Vector3.Up(),0.05)
   let angle = Math.atan2(location.x - mesh.position.x, location.y - mesh.position.z);
   angle += camera.rotation.y;
   let targ = Quaternion.FromEulerAngles(0, angle, 0);
   if (!mesh.rotationQuaternion) {
      mesh.rotationQuaternion = Quaternion.Zero();
   }
   mesh.rotationQuaternion = Quaternion.Slerp(mesh.rotationQuaternion, targ, 0.2);
   mesh.translate(Vector3.Forward(), 0.1);
}

export function rotateTowards(directionVector: Vector3, camera: ArcFollowCamera): Quaternion {
   const input = directionVector.normalize();
   if (input.length() === 0) {
      return;
    }

    let angle = Math.atan2(directionVector.x, directionVector.z);
    angle += camera.rotation.y;
    let targ = Quaternion.FromEulerAngles(0, angle, 0);
    return targ;
}