import { PhysicsImpostor, Scene, Vector3 } from "babylonjs";
import { TaloObject } from "./talo.object";
import * as BABYLON from 'babylonjs';
import { randomIntFromInterval } from "../../utils/geometry.util";
export function createTalo(scene: Scene, parent: BABYLON.TransformNode, bounds: Vector3[]) {

  const taloCount = 10;
  const syvyysCount = 2;
  for (let j = 1; j <= syvyysCount; j++) {
    for (let i = 1; i <= taloCount; i++) {
      createTaloWithImposter(() => {
        const talo = new TaloObject(scene, 1);
        talo.setPosition(bounds[0].x + (10 * i), 0, -100 + (20 * j));
        talo.setScale(randomIntFromInterval(5, 8));
        talo.rotate(Math.PI / 2);
        talo.mesh.parent = parent;
        return talo;
      });
    }

    /*
    createTaloWithImposter(() => {
      const ravintola = new TaloObject(scene, 3000);
      //   ravintola.mesh.scaling.x = 100;
      //  ravintola.mesh.scaling.y = 50;
      ravintola.setPosition(25, 0, 50);
      ravintola.setScale(5);
      ravintola.mesh.scaling.x = 25;
      ravintola.mesh.scaling.y = 20;
      ravintola.mesh.position.y = -4;
      ravintola.mesh.parent = parent;

      return ravintola;
    });
    */
  }

  createTaloWithImposter(() => {
    const talo2 = new TaloObject(scene, 2);
    talo2.setPosition(3, 0, 15);
    talo2.setScale(randomIntFromInterval(4, 7));
    return talo2;
});

}


function createTaloWithImposter(talofn: () => TaloObject): void {
  const talo = talofn();
  talo.perustuksetMesh.physicsImpostor = new PhysicsImpostor(talo.perustuksetMesh, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      ignoreParent: true,
      friction: 1,
      restitution: 0,
  });
}
