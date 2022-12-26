import { Mesh, PhysicsImpostor, Quaternion, Scene, TransformNode, Vector3 } from "babylonjs";
import * as BABYLON from 'babylonjs';
import { PlayerInput } from "../player-input";
import { createKasienheiluttelu } from './animations';

export class Player {


  public mesh: BABYLON.Mesh;


  constructor(scene: BABYLON.Scene) {

    const meshHiirulainen = BABYLON.MeshBuilder.CreateBox("hiirulainen", { height: 2.5 });
    meshHiirulainen.isVisible = false;
    meshHiirulainen.position = new Vector3(0, 2, 0);
    meshHiirulainen.setDirection(Vector3.Zero());
    const vartalo = this.createVartalo(meshHiirulainen);
    const meshPaa = this.createPaa(vartalo);
    this.createKasi("kasi1", vartalo, -1, scene);
    this.createKasi("kasi1", vartalo, 1, scene);

    this.createSilma("silma1", meshPaa, -1);
    this.createSilma("silma2", meshPaa, 1);

    this.createKorva("korva1", meshPaa, 1);
    this.createKorva("korva2", meshPaa, -1);

    this.mesh = meshHiirulainen;

    this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { pressure: 0, restitution: 0, mass: 2 });

    meshHiirulainen.physicsImpostor.physicsBody.linearDamping = 0;
    meshHiirulainen.physicsImpostor.physicsBody.angularDamping = 0;
    /*
   console.log(meshHiirulainen.physicsImpostor.physicsBody);
   */

    //meshHiirulainen.physicsImpostor= new PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10   });
    //boxCollider.addChild(this.mesh);


  }

  public move(moveVector: Vector3): void {
    //this._mesh.position.x += moveVector.x;
    // this._mesh.moveWithCollisions(moveVector)
    this.mesh.locallyTranslate(new Vector3(0, 0, moveVector.z));
    // this._mesh.translate(new BABYLON.Vector3(moveVector.x, 0, 0), 1, BABYLON.Space.LOCAL);
    this.mesh.rotateAround(this.mesh.position, new Vector3(0, 1, 0), moveVector.x);

    //this._mesh.rotateAround())
    //this._mesh.locallyTranslate(new Vector3(moveVector.x*speed,0, moveVector.y * speed));
  }

  private animateMove(): void {

  }

  checkRotation(playerInput: PlayerInput, camera: BABYLON.ArcFollowCamera): void {
    let input = new Vector3(playerInput.horizontalAxis, 0, playerInput.verticalAxis); //along which axis is the direction
    if (input.length() === 0) {
      return;
    }

    let angle = Math.atan2(playerInput.horizontalAxis, playerInput.verticalAxis);
    angle += camera.rotation.y;
    console.log("angle:" + angle);
    let targ = Quaternion.FromEulerAngles(0, angle, 0);
    this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 0.3);



  }

  public checkJump(playerInput: PlayerInput): void {

    if (playerInput.jumpKeyDown && playerInput.jumpCount === 1) {
      console.log('hyppää...');
      this.mesh.physicsImpostor.applyImpulse(Vector3.Up().scaleInPlace(10), this.mesh.position);
    }
  }

  private createKorva(name: string, parentMesh: Mesh, direction: number): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateSphere(name, {
      diameterX: 0.5,
      diameterY: 0.6,
      diameterZ: 0.4
    });
    capsule.setPositionWithLocalVector(new Vector3(0.5 * direction, 0.5, -0.8));
    capsule.parent = parentMesh;
    return capsule;
  }

  private createPaa(hiirulainen: TransformNode): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateCapsule("paa", {
      radius: 0.2,
      height: 1.8,
      orientation: Vector3.Forward(),
      radiusTop: 0.5
    });
    capsule.setPositionWithLocalVector(new Vector3(0, 1, 0.5));

    capsule.parent = hiirulainen;
    return capsule;
  }

  private createSilma(name: string, paa: Mesh, direction: number): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateSphere(name, {
      diameterZ: 0.1,
      diameterY: 0.2,
      diameterX: 0.2


    });
    capsule.setParent(paa);
    capsule.setPositionWithLocalVector(new Vector3(0.2 * direction, 0.4, -0.1));

    return capsule;
  }

  private createKasi(kasinimi: string, vartaloMesh: Mesh, direction: number, scene: Scene): Mesh {

    const kasi = BABYLON.MeshBuilder.CreateCapsule(kasinimi, {
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

    newMesh.setPositionWithLocalVector(new Vector3(0.2 * direction, 0, 0.2));
    const frameRate = 50;
    const kasienheiluttelu = createKasienheiluttelu(direction);
    newMesh.animations.push(kasienheiluttelu);
    scene.beginAnimation(newMesh, 0, 2* frameRate, true);
    return kasi;
  }

  private createVartalo(hiirulainen: Mesh): Mesh {
    const vartalo = BABYLON.MeshBuilder.CreateCapsule("paa", {
      radius: 0.1,
      height: 2,
      radiusTop: 0.2,
      radiusBottom: 0.45
    });
    const material = new BABYLON.StandardMaterial("paita");
    material.diffuseColor = BABYLON.Color3.FromHexString("#1E90FF");
    vartalo.material = material;
    vartalo.setPositionWithLocalVector(new Vector3(0, 0, 0));

    vartalo.parent = hiirulainen;
    return vartalo;
  }


}
