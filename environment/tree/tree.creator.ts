import * as BABYLON from 'babylonjs';
import { MultaObject } from '../multa/multa.object';
import { calculateWidth, randomIntFromInterval } from '../../utils/geometry.util';
import { ISceneLoaderAsyncResult, Mesh, MeshBuilder, PhysicsImpostor, Scene } from 'babylonjs';
import { Tree } from './tree.object';
import { TextureMaterial } from '../../textures/texture.material';
import { createDefaultImpostor } from '../../core/physics.core';
export async function createTrees(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
 createSpriteTrees(scene, parent);
 createMeshTrees(scene, parent);
}

function createSpriteTrees(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/palmtree.png", 1000, { width: 512, height: 1024 }, scene);
  const multaMaterial =  new   TextureMaterial(scene, "./assets/multa/soilMud.jpeg");

  const width = 10;
 
  for (let i = 0; i < 20; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    const treePositionX = Math.random() * (-100);
    const randomHeight = randomIntFromInterval(15, 20);
    tree.position.x = treePositionX;

    tree.width = width;
    tree.height = randomHeight;
    tree.position.set(treePositionX, randomHeight - 10, Math.random() * 50 + 15);
    const multaObject = new MultaObject(scene, multaMaterial);
    multaObject.setPosition(-100 + (calculateWidth(multaObject) / 2) + (i * calculateWidth(multaObject)), 0.1, 26);
  }

  for (let i = 500; i < 600; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    const treePositionX = randomIntFromInterval(30, 90);
    const treePositionZ = randomIntFromInterval(-20, -50);

    const randomHeight = randomIntFromInterval(15, 20);
    tree.position.x = treePositionX;
    tree.position.z = treePositionZ;

    tree.width = 10;
    tree.height = randomHeight
    tree.position.y += 3;
    //tree.size = 10;
    //  tree.position.set(treePositionX, 0, treePositionZ);
  }
}

async function createMeshTrees(scene: Scene, parent: BABYLON.TransformNode): Promise<void> {
  const sceneLoaderResult = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/tree/tree.babylon");
 

  const scale = 3;
  createTreeColliderVertical(0);
  createTreeColliderVertical(35);
  createTreeColliderHorizontal(0, 100);
  
 

  for (let i = 4; i <= 30; i = i+3) {
    const tree = new Tree(parent, sceneLoaderResult);
    tree.setScale(scale-1);
    tree.setPosition(i, 0,  10);
  }
  
  const HARVENNUSKERROIN = 9;
  for (let i = 0; i < 5; i++) {
    const tree = new Tree(parent, sceneLoaderResult);
    tree.setScale(scale);
    tree.setPosition(34, 0,  i * HARVENNUSKERROIN);
  }
  for (let i = 0; i < 5; i++) {
    const tree = new Tree(parent, sceneLoaderResult);
    tree.setScale(scale);
    tree.setPosition( 0, 0,  i * HARVENNUSKERROIN);
  }

}

function createTreeColliderVertical(positionX: number): void {
  const width = 10;
  const depth= 90;

  const treeCollider = BABYLON.MeshBuilder.CreateBox("collider", {
    height: 20, depth, width
  });
  treeCollider.visibility = 1;
  treeCollider.position.x = positionX;
  treeCollider.position.z= 10;
  treeCollider.visibility = 0;
  createDefaultImpostor(treeCollider, true);
}

function createTreeColliderHorizontal(positionz: number, width: number): void {
  const depth= 10;

  const treeCollider = BABYLON.MeshBuilder.CreateBox("collider", {
    height: 20, depth, width
  });
  treeCollider.position.x = 0;
  treeCollider.position.z= positionz;
  treeCollider.visibility = 1;
  createDefaultImpostor(treeCollider, true);
}
