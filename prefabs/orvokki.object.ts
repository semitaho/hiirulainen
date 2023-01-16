import { Color3, Mesh, PBRMaterial, PhysicsImpostor, Scene, StandardMaterial, TransformNode, Vector3 } from "babylonjs";
import { AbstractHiiriObject } from "./abstract-hiiri.object";

export class OrvokkiObject extends AbstractHiiriObject {
  constructor(private scene: Scene) {
    super(scene, "orvokki");
    this.mesh.setAbsolutePosition(new Vector3(7, 4, -2));
    this.mesh.setDirection(new Vector3(0,0,-1));
    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 2,
      restitution: 0,
      friction: 10
    });

  }


  public createBoxVector(): Vector3 {
    return new Vector3(4,2,4);
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