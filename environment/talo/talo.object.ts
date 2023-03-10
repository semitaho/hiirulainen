import { Color3, Mesh, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "babylonjs";
import { EnvironmentObject } from '../environment.object';

import { createDefaultImpostor } from './../../core/physics.core';
import { TextureMaterial } from "../../textures/texture.material";
export class TaloObject extends EnvironmentObject {

  public perustuksetMesh: Mesh;
  constructor(private scene: Scene, scaleFactor: number = 1) {
    super("talo" + Math.random());
    this.perustuksetMesh = this.createPerustukset();
    this.perustuksetMesh.parent = this.mesh;
    this.createKatto().parent = this.mesh;
  }


  createPerustukset(): Mesh {
    
    const boxMat = new TextureMaterial(this.scene,"./assets/talo/cubehouse.png");
   
    const vectorForPaksuIkkuna = new Vector4(0.25,0,0.375,0.5)
    const tyhja = new Vector4(0.48,0,0.625,0.55)

    const faceUV= [
      vectorForPaksuIkkuna,
      vectorForPaksuIkkuna,
      tyhja,
      tyhja


    ];
    const box = MeshBuilder.CreateBox("box", { 
      wrap: true, faceUV });
    box.position.y = 0.5;
    box.scaling.y = 0.75;
    box.material = boxMat;
    createDefaultImpostor(box, true);
    return box;
  }

  createKatto(): Mesh {
    const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 });
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.1;
    roof.material = new TextureMaterial(this.scene, './assets/talo/roof.jpg');;
    return roof;

  }
}