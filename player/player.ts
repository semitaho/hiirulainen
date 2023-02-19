import { Mesh, PhysicsImpostor, Quaternion, Scene, TransformNode, Vector3, IPhysicsEnabledObject, StandardMaterial, Color3, ActionManager, Animation, IAnimationKey } from "babylonjs";
import * as BABYLON from 'babylonjs';
import { AbstractHiiriObject } from '../models';
import { DEFAULT_JUMP_IMPULSE } from "../core/config";
import { convertColor } from "../utils/geometry.util";
import { createHitAnimation, createJumpHitAnimation } from "../core/animations";

export class Player extends AbstractHiiriObject {

  private hitAnimation: BABYLON.Animatable;

  createBoxVector(): Vector3 {
    return new Vector3(1, 3, 1);
   }

  private jumping = false;
  private readonly impulse = 0.1;

  constructor(protected scene: Scene) {
    super(scene, "hiirulainen");
    this.mesh.actionManager = new ActionManager(scene);
    this.mesh.setDirection(Vector3.Forward());


    //meshHiirulainen.physicsImpostor= new PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10   });
    //boxCollider.addChild(this.mesh);

  }
  createPomppiminen(mesh: Mesh) {
    const fps = 60;
    const timeSlot = 40;
    const animation = new Animation("pomppiminen", "position.y", fps, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const keys: IAnimationKey[] = [
      {
        frame: 0,
        value: mesh.position.y
      },
      {
        frame: timeSlot / 2,
        value: mesh.position.y + 0.2
      },
      {
        frame: timeSlot,
        value: mesh.position.y
      }
    ];

    animation.setKeys(keys);
    mesh.animations.push(animation);
    this.scene.beginAnimation(mesh, 0, fps, true);
  }

  gameOver(): void {
    this.createPomppiminen(this.leftSilmaMesh);
    this.createPomppiminen(this.rightSilmaMesh);

    this.createHyvatKadetAnimations(this.leftKasiMesh, -1);
    this.createHyvatKadetAnimations(this.rightKasiMesh, 1);
    this.mesh.setDirection(Vector3.Backward());
  }

  private createHyvatKadetAnimations(mesh: Mesh, direction: number): void {
    const fps = 60;
    const timeSlot = 40;
    const animation = new Animation("hyvatkadetOikea", "rotation", fps, Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CYCLE);

    const kasienAukaisuKulma = Math.PI / 1.5;
    const kasienNosto = -direction * Math.PI / 2;
    const keys: IAnimationKey[] = [
      {
        frame: 0,
        value: new Quaternion(kasienAukaisuKulma, kasienNosto, 0)

      },

      {
        frame: timeSlot / 2,
        value: new Quaternion(Math.PI, kasienNosto, direction * Math.PI / 2)
      },
      {
        frame: timeSlot,
        value: new Quaternion(kasienAukaisuKulma, kasienNosto, 0)
      }

    ];
    mesh.animations.push(animation);

    const positionfixAnimation = new Animation("hyvatkadetPos", "position", fps, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
    const fixedHeight = 0.4;
    positionfixAnimation.setKeys([{
      frame: 0,
      value: new Vector3(direction * 0.6, fixedHeight, 0.1)
    },
    {
      frame: timeSlot / 2,
      value: new Vector3(direction * 0.3, fixedHeight, 0.1)
    },
    {
      frame: timeSlot,
      value: new Vector3(direction * 0.6, fixedHeight, 0.1)
    }

    ])
    animation.setKeys(keys);
    mesh.animations.push(positionfixAnimation);
    this.scene.beginAnimation(mesh, 0, fps, true);


  }

  toggleJump(jumping: boolean) {
    this.jumping = jumping;
  }


  fixRotation() {
    this.mesh.rotation.z = 0;
  }

  protected createVartalo(): Mesh {
    this.vartaloMesh = super.createVartalo();
    const hiirulaisvartalo = this.vartaloMesh.material as StandardMaterial;
    hiirulaisvartalo.diffuseColor = convertColor(231, 243, 244);
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
    this.mesh.physicsImpostor.applyImpulse(Vector3.Up().scaleInPlace(DEFAULT_JUMP_IMPULSE), this.mesh.position);
    this.jumping = true;

  }

  public checkHit(checkHit: boolean): void {

    if (!checkHit) {
      return;
    }
    if (this.hitAnimation && this.hitAnimation.animationStarted) {
      return;
    }
    console.log('ohhoh');
    const hitAnimation = createHitAnimation();
    const jumpHitAnimation = createJumpHitAnimation();

    this.hitAnimation = this.scene.beginDirectAnimation(this.vartaloMesh, [hitAnimation, jumpHitAnimation], 0, 30, false, 1.2);
   
    //this.hitAnimation = this.scene.beginDirectAnimation(this.mesh, [animation], 0, 30);
  }

}
