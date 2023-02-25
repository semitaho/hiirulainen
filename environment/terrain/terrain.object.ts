
import { Color4, GroundMesh, Mesh, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Texture, Vector2, Vector3 } from "babylonjs";
import "../../extensions/babylon.dynamicTerrain.js";
import * as BABYLON from 'babylonjs';
import { Groundable} from './../../models/groundable.model';
import { TextureMaterial } from "../../textures/texture.material";

export class TerrainObject implements Groundable {

  public mesh: BABYLON.GroundMesh;
  public constructor(scene: Scene, height: number) {

    this.mesh = MeshBuilder.CreateGround("hiirulainenGround"+Math.random(), {
      width: 200,
      height,
    });
    const multaMaterial = new TextureMaterial(scene, "./assets/multa/soilMud.jpeg");

    this.mesh.material = multaMaterial;
    this.mesh.alphaIndex = 2;
    this.createTerrainCollider();
    this.mesh.receiveShadows = true;
    const arr = this.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind) || [];

    for (var i = 0; i < arr.length; i += 3) {
      arr[i + 2] = arr[i] / 10;
    }
    this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, arr);


  }

  private createTerrainCollider(): void {
    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      friction: 1,
      damping: 0,
      restitution: 0,
    });
    this.mesh.checkCollisions = false;
  }

  public getBounds(): Vector3[] {
    return [
      this.mesh.getBoundingInfo().boundingBox.minimum,
      this.mesh.getBoundingInfo().boundingBox.maximum,

    ];
  }

}