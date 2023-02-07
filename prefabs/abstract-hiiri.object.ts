import { AbstractMesh, Color3, Mesh, PhysicsImpostor, Scene, StandardMaterial, Texture, TransformNode, Vector3 } from "babylonjs";

import * as BABYLON from 'babylonjs';
import { DEFAULT_OBJECT_MASS } from "../core/config";
import { convertColor } from "../utils/geometry.util";
export abstract class AbstractHiiriObject {

  public mesh: BABYLON.Mesh;
  public vartaloMesh: Mesh;
  public leftKasiMesh: Mesh;
  public rightKasiMesh: Mesh;

  public leftSilmaMesh: Mesh;
  public rightSilmaMesh: Mesh;

  constructor(scene: Scene, private name: string, usePhysics = true) {
    const { x, y, z } = this.createBoxVector();
    this.mesh = BABYLON.MeshBuilder.CreateBox(this.name, { width: x, height: y, depth: z });
    this.mesh.visibility = 0;
    this.vartaloMesh = this.createVartalo();
    const meshPaa = this.createPaa(this.vartaloMesh);
    this.leftKasiMesh = this.createKasi("kasi1", this.createKasiMaterial(), this.vartaloMesh, -1, scene);
    this.rightKasiMesh = this.createKasi("kasi2", this.createKasiMaterial(),this.vartaloMesh, 1, scene);
    this.createHanta(this.vartaloMesh, scene);
    this.leftSilmaMesh = this.createSilma("silma1", meshPaa, -1);
    this.rightSilmaMesh = this.createSilma("silma2", meshPaa, 1);
    this.createKorva("korva1", meshPaa, 1);
    this.createKorva("korva2", meshPaa, -1);
    if (usePhysics) {
      this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: DEFAULT_OBJECT_MASS,
        restitution: 0,
        friction: 0.5,
      });
    }
  }

  abstract createBoxVector(): Vector3;

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.setAbsolutePosition(new Vector3(x, y, z));
  }

  public get position(): Vector3 {
    return this.mesh.position;
  }

  private createHanta(mesh: Mesh, scene: Scene): void {


  }

  private createKasi(kasinimi: string, kasiMaterial: StandardMaterial, vartaloMesh: Mesh, direction: number, scene: Scene): Mesh {
    const kasi = BABYLON.MeshBuilder.CreateCapsule(this.name + kasinimi, {
      radius: 0.1,
      height: 0.6
    });

    const kasi2 = BABYLON.MeshBuilder.CreateCapsule(kasinimi, {
      radius: 0.1,
      height: 0.5, bottomCapSubdivisions: 3, tessellation: 3
    });
    kasi2.rotation.x = BABYLON.Tools.ToRadians(-15);
    kasi2.setPositionWithLocalVector(new Vector3(0, -0.3, 0.035));
    const newMesh = BABYLON.Mesh.MergeMeshes([kasi, kasi2])
    newMesh.parent = vartaloMesh;
    newMesh.rotation.x = BABYLON.Tools.ToRadians(-20);
    newMesh.material = kasiMaterial;
    newMesh.setPositionWithLocalVector(new Vector3((newMesh.getBoundingInfo().boundingSphere.radius + 0.2) * direction, 0, 0.2));
    const frameRate = 50;
    /*
    const kasienheiluttelu = createKasienheiluttelu(direction);
    newMesh.animations.push(kasienheiluttelu);
    scene.beginAnimation(newMesh, 0, 2 * frameRate, true);
    */
    return newMesh;
  }

  private createKasiMaterial(): StandardMaterial {
    const material = new StandardMaterial("kasiMaterial");
    material.diffuseColor = convertColor(114, 86, 56);
    return material;
  }


  private createSilma(name: string, paa: Mesh, direction: number): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateSphere(this.name + name, {
      diameterZ: 0.18,
      diameterY: 0.3,
      diameterX: 0.3
    });
    capsule.setParent(paa);
    capsule.setPositionWithLocalVector(new Vector3(0.2 * direction, 0.4, -0.1));
    const material = new StandardMaterial("silmaMaterial")
    material.diffuseColor = Color3.White();
    capsule.material = material;

    const sphere = BABYLON.MeshBuilder.CreateSphere("silmakuoppa", {   
      diameterZ: 0.15,
      diameterY: 0.16,
      diameterX: 0.16} );
    const silmakuoppamaterial = new StandardMaterial("silmakuoppaMaterial");
    silmakuoppamaterial.diffuseColor = Color3.Black();
    sphere.material = silmakuoppamaterial;

    capsule.addChild(sphere);
    sphere.setPositionWithLocalVector(new Vector3(0,0.05,0.05));

    return capsule;
  }



  protected createVartalo(): Mesh {
    const vartalo = BABYLON.MeshBuilder.CreateCapsule("vartalo", {
      radius: 0.1,
      height: 3,
      radiusTop: 0.2,
      radiusBottom: 0.8
    });
    const material = new BABYLON.StandardMaterial("paita");
    material.diffuseColor = BABYLON.Color3.FromHexString("#1E90FF");
    vartalo.material = material;
    vartalo.setPositionWithLocalVector(new Vector3(0, 0, 0));

    vartalo.parent = this.mesh;
    return vartalo;
  }

  protected createKorva(name: string, parentMesh: Mesh, direction: number): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateSphere(name, {
      diameterX: 0.5,
      diameterY: 0.6,
      diameterZ: 0.4
    });
    capsule.setPositionWithLocalVector(new Vector3(0.3 * direction, 0.4, -0.7));
    const material = new StandardMaterial("korva"+direction);
    material.diffuseColor = convertColor(227, 177, 150);
    capsule.material = material;
    capsule.parent = parentMesh;
    return capsule;
  }

  protected createPaa(hiirulainen: TransformNode): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateCapsule("paa", {
      radius: 0.2,
      height: 1.4,

      orientation: Vector3.Forward(),
      radiusTop: 0.5
    });
    capsule.setPositionWithLocalVector(new Vector3(0, 1.5, 0.5));
    const material = new StandardMaterial("paaMaterial");
    material.diffuseColor = convertColor(114, 86, 56);
    capsule.material = material;
    capsule.parent = hiirulainen;
   
    const arcLine = BABYLON.MeshBuilder.CreateSphere("arc", { diameterZ: .7, slice: 0.4  });
    const suumaterial = new StandardMaterial("suu");
    suumaterial.diffuseColor =Color3.Black();
    arcLine.material = suumaterial;
    capsule.addChild(arcLine);
    arcLine.setPositionWithLocalVector(new Vector3(0,0.05,-0.1));

   
    //arcLine.rotation.x = Math.PI / 4;
    //arcLine.rotation.y = Math.PI / 4;
    arcLine.rotation.z = Math.PI;

    return capsule;
  }
}