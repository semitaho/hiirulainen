
import { AnimationEvent, ISceneLoaderAsyncResult, Mesh, MeshBuilder, Quaternion, Scene, Skeleton, Vector2, Vector3 } from 'babylonjs';
import { AbstractMesh } from 'babylonjs/index';
import { Enemy } from '../enemy.model';
import * as BABYLON from 'babylonjs';
import { createRabbitMoveJumpAnimation } from '../../core/animations';
import { Path } from '../../ai';
import { rotateTowards, toVector3 } from '../../utils/geometry.util';
import { HiirulainenCamera } from '../../core/hiirulainen.camera';
export class Rabbit implements Enemy {
  private _path: Path

  private _pupuMoveAnimation: BABYLON.Animatable;
  private _timeInWaypointMs = 0;
  jump() {
    this._mesh.applyImpulse(Vector3.Up().scale(100), this._mesh.position)
  }

  private animatedSkeleton: Skeleton;
  private rabbitJumpAnimation: BABYLON.Animatable;

  private _mesh: AbstractMesh;
  constructor(private scene: Scene, private sceneLoaderAsync: ISceneLoaderAsyncResult) {
    this._mesh = BABYLON.MeshBuilder.CreateBox("janis", { width: 2, height: 6, depth: 2.5 });
    this._mesh.visibility = 0;
    // this._mesh.position.y = 2;
    const meshPromise = this.sceneLoaderAsync.meshes[0].clone("pupuRand", this.mesh);
    meshPromise.scaling.scaleInPlace(0.07);
    meshPromise.position.z = -1;
    this._mesh.addChild(meshPromise);
    this._mesh.rotationQuaternion = Quaternion.Zero();
    this._mesh.setDirection(Vector3.Right());

    console.log('meshpromise', this._mesh);
    //createDefaultImpostor(this._mesh, true);
    this.animatedSkeleton = this.sceneLoaderAsync.skeletons[0];
  }


  get mesh(): AbstractMesh {
    return this._mesh;
  }

  get path(): Path {
    return this._path;
  }

  set path(path: Path) {
    this._path = path;
  }

  get timeInWaypointMs() {
    return this._timeInWaypointMs;
  }

  set timeInWaypointMs(waypointTime: number) {
    this._timeInWaypointMs = waypointTime;

  }


  public stopMove(): void {
    if (this._pupuMoveAnimation && this._pupuMoveAnimation.animationStarted) {
      this._pupuMoveAnimation.stop();
      console.log("STOP");
      this._pupuMoveAnimation = null;
    }

    if (this.rabbitJumpAnimation && this.rabbitJumpAnimation.animationStarted) {
      this.rabbitJumpAnimation.stop();
      this.rabbitJumpAnimation = null;
      this._mesh.position.y = 0;
    }
  }

  public animateRotation(targetPosition: Vector2, camera: HiirulainenCamera): void {
    // Create a quaternion rotation
    const direction = toVector3(targetPosition).subtract(this._mesh.position);

    const input = direction.normalize();
     if (!this.mesh.rotationQuaternion) {
       this.mesh.rotationQuaternion = Quaternion.Zero();
     }
 
     let angle = Math.atan2(input.x, input.z);
     angle += camera.rotation.y;
     let targetRotation = Quaternion.FromEulerAngles(0, angle, 0);
     console.log('target rotation angle', angle);
     const fps = 30;

    // Create an animation for the rotation
    const animation = new BABYLON.Animation(
      "quaternionRotationAnimation",
      "rotationQuaternion",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_QUATERNION,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Create keyframes for the animation
    const keyFrames = [];

    // Start at frame 0 with the current rotation
    keyFrames.push({
      frame: 0,
      value: this._mesh.rotationQuaternion
    });

    // End at frame 100 with the new rotation
    keyFrames.push({
      frame: fps,
      value: targetRotation
    });

    // Set the keyframes for the animation
    animation.setKeys(keyFrames);


    // Start the animation
    this.scene.beginDirectAnimation(this._mesh, [animation], 0, fps, false, 5);


  }
  public animateMove(target: Vector2, speed = 1): void {

    if (this.rabbitJumpAnimation && this.rabbitJumpAnimation.animationStarted) return;
    this._pupuMoveAnimation = this.scene.beginAnimation(this.animatedSkeleton.bones[0], 33, 55, false, 0.5);
    const anim = createRabbitMoveJumpAnimation(this.mesh, target);
    anim.addEvent(new AnimationEvent(5, () => {
      const combinedTrail = this.createTrail();
      const frames_in_sec = 60;
      const animateFadeAway = new BABYLON.Animation("fadeaway", "visibility", frames_in_sec, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      animateFadeAway.setKeys([{
        frame: 0,
        value: 1,
      }, {
        frame: frames_in_sec,
        value: 0
      }]);

      this.scene.beginDirectHierarchyAnimation(combinedTrail, true, [animateFadeAway], 0, frames_in_sec, false, 0.1, () => {
        combinedTrail.dispose();
      });

    }, true));
    this.rabbitJumpAnimation = this.scene.beginDirectAnimation(this._mesh, [anim], 0, 30, false, speed);

  }

  private createTrail() {
    const trail = BABYLON.MeshBuilder.CreateSphere("trailBox", {
      arc: 1,
      diameterX: 0.7,
      diameterY: 0.3,
      diameterZ: 0.7
    }, this.scene);
    // trail.position = new Vector3(this._mesh.position.x - 1, 0, this._mesh.position.z + 0.2);
    const sourceMat = new BABYLON.StandardMaterial("sourceMat", this.scene);

    sourceMat.alpha = 0.3;
    sourceMat.diffuseColor = BABYLON.Color3.Black();
    trail.material = sourceMat;
    trail.position.x = 0.7;
    trail.position.y = 0;

    const trail2 = trail.clone();
    const legsRange = 0.7;
    trail.position.x = -(legsRange / 2);
    trail2.position.x = legsRange / 2;
    const combinedTrail = new BABYLON.TransformNode("trails", this.scene);
    trail.parent = combinedTrail;
    trail2.parent = combinedTrail;
    combinedTrail.position = this._mesh.position.clone();
    combinedTrail.position.y = 0;
    combinedTrail.rotationQuaternion = this._mesh.rotationQuaternion.clone();
    return combinedTrail;
  }
}


