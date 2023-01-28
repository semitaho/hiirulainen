import { Color3, Mesh, PhysicsImpostor, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { TransformNode, Vector2 } from "babylonjs/index";
import { Piilotettava } from "../models/piilotettava.interface";
import { AbstractHiiriObject } from "./abstract-hiiri.object";

export class MaikkiObject extends AbstractHiiriObject implements Piilotettava {

  private piilopaikka: Vector2;
  constructor(private scene: Scene, direction: number) {
    super(scene, "maikki", false);

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
    this.mesh.physicsImpostor = null;

  }
  setPiilopaikka(piilopaikka: Vector2) {
    this.piilopaikka = piilopaikka;
  }

  getPiilopaikka(): Vector2 {
    return this.piilopaikka;
  }

  getMesh(): Mesh {
    return this.mesh;
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