import earcut from "earcut";
import { Mesh, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "babylonjs";
import { EnvironmentObject } from "../environment.object";
import { createRenkaanPyoriminen } from "../../core/animations";
import { createDefaultImpostor } from "../../core/physics.core";
import { TextureMaterial } from "../../textures/texture.material";
import { Enemy } from './../../models';

export class AutoObject extends EnvironmentObject implements Enemy {


  private _mesh: Mesh;

  constructor(private scene: Scene) {
    super("auto");
    //base
    const outline = [
      new Vector3(-0.3, 0, -0.1),
      new Vector3(0.2, 0, -0.1),
    ]

    //curved front
    for (let i = 0; i < 20; i++) {
      outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
    }

    //top
    outline.push(new Vector3(0, 0, 0.1));
    outline.push(new Vector3(-0.3, 0, 0.1));
    //face UVs
    const faceUV = [];

    faceUV[0] = new Vector4(0, 0.5, 0.38, 1);

    faceUV[1] = new Vector4(0, 0, 1, 0.5);
    faceUV[2] = new Vector4(0.38, 1, 0, 0.5);


    this._mesh = MeshBuilder.ExtrudePolygon("car", { shape: outline, depth: 0.2, faceUV, wrap: true }, null, earcut);
    this._mesh.material = new TextureMaterial(scene, "./assets/auto/car.png");
    this._mesh.rotation.x = -Math.PI / 2;

    this.createWheels();
    this.setScale(12);
    this._mesh.visibility = 1;
    this._mesh.position.y = 1.5;

  }

  get mesh(): Mesh {
    return this._mesh;
  }

  private createWheels(): void {
    //wheel face UVs
    const wheelUV = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
    const wheelRB = MeshBuilder.CreateCylinder("wheelRB", { diameter: 0.125, height: 0.05, faceUV: wheelUV });
    wheelRB.position.z = -0.015;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = -0.05;
    wheelRB.rotation.x = Math.PI / 2;
    this.mesh.addChild(wheelRB);

    //car material
  
    const wheelMat = new TextureMaterial(this.scene, "./assets/auto/wheel.png");
    wheelRB.material = wheelMat;
    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.material = wheelMat;
    wheelRF.position.x = 0.1;
    this.mesh.addChild(wheelRF);

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;
    this.mesh.addChild(wheelLB);

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;
    this.mesh.addChild(wheelLF);
    this.createAndBeginWheelAnimation(wheelLF);
    this.createAndBeginWheelAnimation(wheelRF);
    this.createAndBeginWheelAnimation(wheelLB);
    this.createAndBeginWheelAnimation(wheelRB);

  }

  private createAndBeginWheelAnimation(wheelMesh: Mesh): void {
    const animation = createRenkaanPyoriminen();
    wheelMesh.animations = [];
    wheelMesh.animations.push(animation);
    this.scene.beginAnimation(wheelMesh, 0, 30, true);
  }


}