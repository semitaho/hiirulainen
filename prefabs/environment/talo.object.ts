import { Color3, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { EnvironmentObject} from './environment.object';
export class TaloObject extends EnvironmentObject {


  constructor(scene: Scene, scaleFactor: number = 1) {
    super("talo"+Math.random());
    this.mesh.addChild(this.createPerustukset());
    this.mesh.addChild(this.createKatto());
    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0,  friction: 0 })

    //this.mesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
  }


  createPerustukset() {
    const mesh = MeshBuilder.CreateBox("taloPerustukset", {
      width: 8,
      height: 5,
      depth: 8
    });
    const standardMaterial = new StandardMaterial("taloMaterial");
    standardMaterial.diffuseColor = new Color3(1,0,0.5);
    mesh.material = standardMaterial;
    return mesh;

  }

  createKatto() {
    const mesh = MeshBuilder.CreateCylinder("talo1", {
      diameterBottom: 13,
      diameterTop: 0, height:4

    });
    mesh.position.y = 4
    
    const standardMaterial = new StandardMaterial("kattoMaterial");
    standardMaterial.diffuseColor = new Color3(0, 0.5, 0);
    mesh.material = standardMaterial;
    return mesh;

  }
}