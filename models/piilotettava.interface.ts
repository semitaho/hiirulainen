import { Mesh, Vector2 } from "babylonjs";

export interface Piilotettava {

  setPiilopaikka(piilopaikka: Vector2);

  getPiilopaikka(): Vector2;

  getMesh(): Mesh;

  get missing(): boolean;

  setLoydetty(): void;


}