import { Mesh, PhysicsImpostor, Quaternion, Scene, TransformNode, Vector3, IPhysicsEnabledObject, StandardMaterial, Color3, ActionManager } from "babylonjs";
import * as BABYLON from 'babylonjs';
import { PlayerInput } from "../player-input";
import { HiirulainenScene } from "./hiirulainen.scene";
import { AbstractHiiriObject } from './abstract-hiiri.object';

export class Player extends AbstractHiiriObject {

  public vartaloMesh: Mesh;
  createBoxVector(): Vector3 {
    return new Vector3(3,3,3);
  }

  private jumping = false;
  private readonly impulse = 100;
  toggleJump(jumping: boolean) {
    this.jumping = jumping;
  }

  constructor(scene: Scene) {
    super(scene, "hiirulainen");
    this.mesh.actionManager = new ActionManager(scene);
    this.mesh.setDirection(Vector3.Forward());


    //meshHiirulainen.physicsImpostor= new PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10   });
    //boxCollider.addChild(this.mesh);


  }

  fixRotation() {
    this.mesh.rotation.z = 0;
  }

  protected createVartalo(): Mesh {
    this.vartaloMesh = super.createVartalo();
    const hiirulaisvartalo = this.vartaloMesh.material as StandardMaterial;
    hiirulaisvartalo.diffuseColor = Color3.Blue();
    return this.vartaloMesh;
  }


  checkRotation(horizontalAxis: number, verticalAxis: number, camera: BABYLON.ArcFollowCamera): void {
    let input = new Vector3(horizontalAxis, 0, verticalAxis); //along which axis is the direction
    if (input.length() === 0) {
      return;
    }

    let angle = Math.atan2(horizontalAxis, verticalAxis);
    angle += camera.rotation.y;
    let targ = Quaternion.FromEulerAngles(0, angle, 0);
    this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 0.2);
  }

  public checkJump(tryJump: boolean): void {
    if (this.jumping || !tryJump) {
      return;
    }
    this.mesh.physicsImpostor.applyImpulse(Vector3.Up().scaleInPlace(this.impulse), this.mesh.position);
    this.jumping = true;

  }

}
