import { AbstractMesh, Mesh } from "babylonjs";

export interface Enemy {


  get mesh(): AbstractMesh;

  get hitPoints(): number;
}