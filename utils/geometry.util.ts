import { AbstractMesh, ArcFollowCamera, Mesh, Quaternion, Vector2, Vector3 } from "babylonjs";
import { EnvironmentObject } from "../environment/environment.object";

export function calculateWidth(object: EnvironmentObject): number {
   const boundingBox = object.mesh.getBoundingInfo().boundingBox;
   return boundingBox.maximum.x - boundingBox.minimum.x;
}

export function convertColor(r: number, g: number, b:number): BABYLON.Color3 {
   return new BABYLON.Color3(r / 255, g / 255, b / 255);
}

export function randomIntFromInterval(min: number, max: number): number { // min and max included 
   return Math.floor(Math.random() * (max - min + 1) + min)
 }


export function moveTowards(mesh: AbstractMesh, location: Vector3, camera: ArcFollowCamera, speed: number = 0.1, jump = false): void {

   const distance = Vector3.Distance(mesh.position, new Vector3(location.x, mesh.position.y, location.z));
   if (distance < 0.5) {
      return;
   }
   rotateTowards(mesh, location, camera);
 
     if (jump) {
      mesh.applyImpulse(Vector3.Up().scale(100), mesh.position);
   }
   mesh.translate(Vector3.Forward(), speed);
}

export function toVector3(vec2: Vector2): Vector3 {
   return new Vector3(vec2.x, 0, vec2.y);
}

export function isRotated(currentRotation: Quaternion, targetRotation: Quaternion): boolean {
   return Math.abs(targetRotation.y - currentRotation.y) < 0.1;
}

export function rotateTowards(mesh: AbstractMesh, positionToRotate: Vector3, camera: ArcFollowCamera): boolean {

   const direction = positionToRotate.subtract(mesh.position);

   const input = direction.normalize();
    if (!mesh.rotationQuaternion) {
      mesh.rotationQuaternion = Quaternion.Zero();
    }

    let angle = Math.atan2(input.x, input.z);
    angle += camera.rotation.y;
    let targ = Quaternion.FromEulerAngles(0, angle, 0);
    mesh.rotationQuaternion = Quaternion.Slerp(mesh.rotationQuaternion, targ, 0.2);
    return isRotated(mesh.rotationQuaternion, targ);
   }