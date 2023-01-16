import { Color3, Mesh, PhysicsImpostor, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { TransformNode } from "babylonjs/index";
import { AbstractHiiriObject } from "./abstract-hiiri.object";

export class MaikkiObject extends AbstractHiiriObject {

  constructor(private scene: Scene, direction: number) {
    super(scene, "maikki");

    this.setPosition(10, 4, 4);

    switch (direction) {
      case 1:
        this.mesh.setDirection(Vector3.Right());
        break;
      case 2:
        this.mesh.setDirection(Vector3.Left());
      case 3:
        this.mesh.setDirection(Vector3.Backward());
        break;


      default:
        this.mesh.setDirection(Vector3.Forward());

    }
    this.mesh.scaling = new Vector3(0.9, 0.9, 0.9);
   

  }

  createBoxVector(): Vector3 {
    return new Vector3(4,3,4);
  }
  protected createVartalo(): Mesh {
    const vartalo = super.createVartalo();
    const standardMaterial = new StandardMaterial("maikkiPaaMaterial");
    standardMaterial.diffuseColor = Color3.Gray();
    vartalo.material = standardMaterial;
    return vartalo;
  }


  protected createKorva(name: string, parentMesh: Mesh, direction: number): Mesh {
    return null;
  }

  protected createPaa(hiirulainen: TransformNode): Mesh {
    const paa = super.createPaa(hiirulainen);
    const standardMaterial = new StandardMaterial("maikkiPaaMaterial");
    standardMaterial.diffuseColor = Color3.Black();
    paa.material = standardMaterial;
    return paa;
  }

}