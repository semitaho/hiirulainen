import { Color3, Mesh, PBRMaterial, PhysicsImpostor, Scene, StandardMaterial, TransformNode, Vector3 } from "babylonjs";
import { create } from "domain";
import { AbstractHiiriObject } from "../abstract-hiiri.object";
import { createHulahula } from "../animations";
import { HiirulainenTerrain } from "../hiirulainen.terrain";

export class OrvokkiObject extends AbstractHiiriObject {
  constructor(private scene: Scene) {
    super(scene, "orvokki", false);
    this.mesh.setDirection(new Vector3(0,0,-1));
    this.mesh.physicsImpostor = null;
    this.createAndBeginHulaHulaAnimation();
  }


  public createBoxVector(): Vector3 {
    return new Vector3(4,2,4);
  }
  private createAndBeginHulaHulaAnimation(): void {
    const animation = createHulahula();
    this.vartaloMesh.animations = [];
    this.vartaloMesh.animations.push(animation);
    const animationRandom = HiirulainenTerrain.randomIntFromInterval(500, 2000);
    setTimeout(() =>
    this.scene.beginAnimation(this.vartaloMesh, 0, 60, true), animationRandom);
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