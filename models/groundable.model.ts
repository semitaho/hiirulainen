import { Mesh, Vector3 } from "babylonjs";

export interface Groundable {
   getBounds(): Vector3[];

   get mesh(): Mesh;

}