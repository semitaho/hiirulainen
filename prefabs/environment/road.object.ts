import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from 'babylonjs';
import { EnvironmentObject } from './environment.object';
import * as BABYLON from 'babylonjs';
import { RoadProceduralTexture } from 'babylonjs-procedural-textures';
export class RoadObject extends EnvironmentObject {

  private readonly width = 10;
  private readonly kavelytieWidth = 10;
  private readonly kavelytieHeight = 6;

  private readonly widthOfHeight = 10;

  constructor(scene: Scene) {
    super("tie");
    this.createRoadNetwork();
  }

  private createRoadNetwork(): void {
    const roadPieces = 20;
    const startX = -100;
    for (let i = 0; i < roadPieces; i++) 
    {
      const mesh = this.buildRoadMesh();
      const kaveyltieMesh = this.buildKavelytieMesh();
      const kaveyltieMesh2 = this.buildKavelytieMesh();

      mesh.position.x  = startX + ( i * this.width);
      kaveyltieMesh.position.x = startX + ( i * this.kavelytieWidth);
      kaveyltieMesh2.position.x = startX + ( i * this.kavelytieWidth);

      kaveyltieMesh.position.z = -8;
      kaveyltieMesh2.position.z = 8;
      mesh.parent = this.mesh;
      kaveyltieMesh.parent = this.mesh;
      kaveyltieMesh2.parent = this.mesh;

    }
  }
  private buildRoadMesh(): Mesh {
    const mesh = MeshBuilder.CreateGround("road", {
      width: this.width,
      height: this.widthOfHeight
    });
    mesh.position.y =0.1
    mesh.material = this.buildTieMaterial();
    return mesh;
  }

  private buildKavelytieMesh(): Mesh {
    const mesh = MeshBuilder.CreateGround("kavelytie", {
      width: this.kavelytieWidth,
      height: this.kavelytieHeight
    });
    mesh.position.y =0.1
    mesh.material = this.buildKavelytieMaterial();
    return mesh;
  }

  buildTieMaterial(): StandardMaterial {
    let roadmaterialpt = new StandardMaterial("roadTex");
    const texture = new Texture("./textures/roadpt.jpeg");
    roadmaterialpt.diffuseTexture = texture; 
    //roadmaterialpt.ambientTexture = texture;
    //roadmaterialpt.emissiveTexture = texture;
    return roadmaterialpt;
  }

  buildKavelytieMaterial(): StandardMaterial {
    const kavelytiematerial = new BABYLON.StandardMaterial("kavelytieMat");

    const texture = new Texture("./textures/kavelytie.jpeg");
    kavelytiematerial.diffuseTexture = texture; 
    //roadmaterialpt.ambientTexture = texture;
    //roadmaterialpt.emissiveTexture = texture;
    return kavelytiematerial;
  }

}
