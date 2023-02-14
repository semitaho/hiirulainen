
import { AnimationEvent, ISceneLoaderAsyncResult, MeshBuilder, Quaternion, Scene, Skeleton, Vector3 } from 'babylonjs';
import { AbstractMesh } from 'babylonjs/index';
import { EnvironmentObject } from '../environment/environment.object';
import { Enemy } from './enemy.model';
import * as BABYLON from 'babylonjs';
import { createDefaultImpostor } from '../../core/physics.core';
import { createHulahula, createRabbitJumpAnimation } from '../../core/animations';
import { rotateTowards } from '../../utils/geometry.util';
export class Rabbit implements Enemy {
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
    console.log('sd', this.sceneLoaderAsync);
    const meshPromise = this.sceneLoaderAsync.meshes[0];
    meshPromise.scaling.scaleInPlace(0.07);
    meshPromise.position.z = -1;
    this._mesh.addChild(meshPromise);
    this._mesh.setDirection(Vector3.Right());
    this._mesh.position = new Vector3(20, 0, 3);

    console.log('meshpromise', this._mesh);
    //createDefaultImpostor(this._mesh, true);
    this.animatedSkeleton = this.sceneLoaderAsync.skeletons[0];
  }


  get mesh(): AbstractMesh {
    return this._mesh;
  }

  public animateMove(speed: number): void {

    if (this.rabbitJumpAnimation && this.rabbitJumpAnimation.animationStarted) return;
    this.scene.beginAnimation(this.animatedSkeleton.bones[0], 33, 55, false, 0.5);

    const anim = createRabbitJumpAnimation(this.mesh);
    anim.addEvent(new AnimationEvent(5, () => {
      const trail = BABYLON.MeshBuilder.CreateSphere("trailBox", {
        arc: 1,
        diameterX: 0.7,
        diameterY: 0.5,
        diameterZ: 0.7



      }, this.scene);
      // trail.position = new Vector3(this._mesh.position.x - 1, 0, this._mesh.position.z + 0.2);
      const sourceMat = new BABYLON.StandardMaterial("sourceMat", this.scene);

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
      combinedTrail.position = this._mesh.position;
      combinedTrail.rotationQuaternion = this._mesh.rotationQuaternion;
      // const combinedTrail = BABYLON.Mesh.MergeMeshes([trail, trail2]);
      // combinedTrail.position = this._mesh.position;
      // combinedTrail.rotationQuaternion = new Quaternion(0, this._mesh.rotationQuaternion.y, 0);
      //trail.position = this._mesh.position.clone();
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
        console.log('deleting trail...');
        combinedTrail.dispose();
      });

    }, true));
    this.rabbitJumpAnimation = this.scene.beginDirectAnimation(this._mesh, [anim], 0, 30, false, 1);

  }
}


