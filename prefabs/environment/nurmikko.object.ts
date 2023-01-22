import { CreateHemisphere, MeshBuilder, Scene, StandardMaterial, Texture } from "babylonjs";
import { EnvironmentObject } from "./environment.object";
import { GrassProceduralTexture } from 'babylonjs-procedural-textures';

export class NurmikkoObject extends EnvironmentObject {
  public static readonly WIDTH = 20;
  public  static readonly DEPTH = 60;

  constructor(scene: Scene) {
    super("nurmikko"+ Math.random());
    this.mesh = MeshBuilder.CreateGround("nurmikko"+ Math.random, { width: NurmikkoObject.WIDTH, height: NurmikkoObject.DEPTH});
    const material  = new StandardMaterial("nurmikkoMat");
    material.ambientTexture = new GrassProceduralTexture("nurmikko", 128, scene);
    this.mesh.material = material;
  }
}