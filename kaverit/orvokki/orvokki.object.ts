import { Color3, Mesh, PBRMaterial, PhysicsImpostor, Quaternion, Scene, StandardMaterial, TransformNode, Vector3 } from "babylonjs";
import { AbstractHiiriObject } from "../../models";
import { createHulahula, moveKasi } from "../../core/animations";
import { HiirulainenTerrain } from "../../core/hiirulainen.terrain";

export class OrvokkiObject extends AbstractHiiriObject {
  constructor(protected scene: Scene) {
    super(scene, "orvokki", false);
    this.mesh.setDirection(new Vector3(0, 0, -1));
    this.mesh.physicsImpostor = null;
    this.createHulaHulaAnimation();
    this.createKasiMovingAnimation();
    this.fireAnimations();
    this.mesh.rotationQuaternion = Quaternion.Zero();
  }
  


  public createBoxVector(): Vector3 {
    return new Vector3(4, 2, 4);
  }
  private createHulaHulaAnimation(): void {
    const animation = createHulahula();
    this.vartaloMesh.animations = [];
    this.vartaloMesh.animations.push(animation);
    
  }

  private fireAnimations(): void {
    const animationRandom = HiirulainenTerrain.randomIntFromInterval(500, 2000);
    setTimeout(() => {
      this.scene.beginAnimation(this.vartaloMesh, 0, 60, true);
      this.scene.beginAnimation(this.leftKasiMesh, 0, 30, true);
      this.scene.beginAnimation(this.rightKasiMesh, 0, 30, true);
    },
      animationRandom
    );
  }

  createKasiMovingAnimation() {
    this.leftKasiMesh.animations = [moveKasi(1)];
    this.scene.beginAnimation(this.leftKasiMesh, 0, 30, true);
    this.rightKasiMesh.animations = [moveKasi(-1)];

  }

  protected createVartalo(): Mesh {
    const vartalo = super.createVartalo();
    const standardMaterial = new PBRMaterial("orvokkiPaaMaterial");
    standardMaterial.albedoColor = Color3.Red();
    standardMaterial.roughness = 1;
    vartalo.material = standardMaterial;
    return vartalo;
  }
}