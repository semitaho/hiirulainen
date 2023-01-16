import { MeshBuilder } from "babylonjs";

export class PortaatEnvironment {

  constructor(scene: BABYLON.Scene) {
    MeshBuilder.CreateBox("joo", {
      width: 3,
      height: 0.4,
      depth: 2
    })
  }
}