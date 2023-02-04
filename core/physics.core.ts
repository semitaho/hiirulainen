import { AbstractMesh, PhysicsImpostor } from "babylonjs";


export function createDefaultImpostor(mesh: AbstractMesh, isStatic: boolean = false) {
  mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, {
    mass: isStatic ? 0 : 1,
    restitution: 0,
    friction: 10
  })

}