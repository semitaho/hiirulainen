import { BabylonFileLoaderConfiguration, LinesMesh, Mesh, Scene, Vector3 } from "babylonjs";
import * as BABYLON from 'babylonjs';


function createKorva(name: string, parentMesh: Mesh): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateSphere(name, {
        
        arc: 0.1
    } );
   // capsule.setPositionWithLocalVector(parentMesh.outlineWidth);
    return capsule;
}

function createPaa(localPosition: Vector3): Mesh {
    const capsule = BABYLON.MeshBuilder.CreateCapsule("paa",{
        radius:0.5, 
        height:0.3, 
        orientation: Vector3.Forward(),
        radiusTop:1} );
    capsule.setPositionWithLocalVector(localPosition);
    return capsule;
}
export function createHiirulainen(scene: BABYLON.Scene): Mesh {
    var customMesh = new BABYLON.Mesh("custom", scene);

    var positions = [-3, 5, 0, 
        3, 5, 0, 
        3, 5, 2, 
        -3, 5, 2];
    var indices = [0, 1, 2, 3];

    //Empty array to contain calculated values or normals added
    var normals = [];

    //Calculations of normals added
    //BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    var vertexData = new BABYLON.VertexData();

    vertexData.positions = positions;
    vertexData.indices = indices;
    //vertexData.normals = normals; //Assignment of normal to vertexData added

    vertexData.applyToMesh(customMesh);
    const paaMesh = createPaa(new Vector3(0.5,0,0));
    

    paaMesh.addChild(createKorva("korva1", paaMesh);
    //paaMesh.addChild(createKorva("korva2", new Vector3(-0.5,0,0)));
    paaMesh.setAbsolutePosition(new Vector3(0, 3,0));

    return paaMesh;


}