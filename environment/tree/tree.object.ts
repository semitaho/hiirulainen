import { AbstractMesh, ISceneLoaderAsyncResult, Mesh, TransformNode } from "babylonjs";
import { EnvironmentObject } from "../environment.object";
import * as BABYLON from 'babylonjs';
import { createDefaultImpostor } from "../../core/physics.core";

export class Tree extends EnvironmentObject {

  constructor(parentNode: TransformNode, treeSync?: ISceneLoaderAsyncResult) {
    super("tree" + Math.random());
    if (treeSync) {
      this.createTreeFromImport(parentNode, treeSync);
    }
  }

  private createTreeFromImport(parentNode: TransformNode, treeSync: ISceneLoaderAsyncResult): void {
     this.mainMesh =treeSync.meshes[0].clone("newTree", parentNode);

     createDefaultImpostor(this.mainMesh, true);
  }

}