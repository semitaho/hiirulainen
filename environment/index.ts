import { AitiObject, MaikkiObject, OrvokkiObject } from '../kaverit';
import { ISceneLoaderAsyncResult, PhysicsImpostor, Quaternion, Scene, SceneLoader, Vector2, Vector3 } from 'babylonjs';
import { ObjectsModel } from '../models/objects.model';
import { Player } from '../player/player';
import { TaloObject } from './talo/talo.object';
import { RoadObject } from './road/road.object';
import * as BABYLON from 'babylonjs';
import { AutoObject } from './auto/auto.object';
import { MultaObject } from './multa/multa.object';
import { Rabbit } from './../enemies';
import { createTrees } from './tree';
import { Path } from './../ai';
import { createGrass } from './nurmikko/nurmikko.creator';
import { createCars } from './auto/auto.creator';
import { createObsticles } from './obsticles/obsticle.creator';
import { ObsticleObject } from './obsticles/obsticle.object';
import { OmenaObject } from '../pickables/omena/omena.object';
import { DEFAULT_OBJECT_MASS, DEFAULT_PICKABLE_HEIGHT_POSITION, PLAYER_STARTING_POINT } from '../core/config';
import { TextureMaterial } from '../textures/texture.material';
import { createJoki } from './joki/joki.creator';
import { createTalo } from './talo/talo.creator';
import { createTerrains } from './terrain/terrain.creator';
import { randomIntFromInterval } from '../utils/geometry.util';

export async function createEnvironment(scene: Scene): Promise<ObjectsModel> {
    createSkybox(scene);
    const groundables = createTerrains(scene);
    const player = new Player(scene);
    player.position = PLAYER_STARTING_POINT;
    const ymparisto = new BABYLON.TransformNode("ymparisto");

    const orvokkiObject = new OrvokkiObject(scene);
    orvokkiObject.setPosition(8,2,35);
    orvokkiObject.mesh.parent = ymparisto;

    const collectibles = [];
    const bounds = groundables[0].getBounds();
    const kaverit = new BABYLON.TransformNode("kaverit");

    const orvokit = [];

    orvokit.push(orvokkiObject);

    for (let i = 1; i < 10; i++) {
        const orvokki3Object = new OrvokkiObject(scene);

        orvokki3Object.setPosition(40 + (i * 3), 2, 50);
        orvokit.push(orvokki3Object);
        orvokki3Object.mesh.parent = kaverit;
    }
    const omenaMaterial = new TextureMaterial(scene, "./textures/apple.jpeg")
   
   

    const omena = new OmenaObject(scene, omenaMaterial);
    omena.setPosition(45, 7, 20);
    omena.mesh.parent = ymparisto;
    const pickables = [omena];

    for (let positionX = 20; positionX <= 50; positionX = positionX + 3) {
        const newOmena = new OmenaObject(scene, omenaMaterial);
        newOmena.setPosition(positionX, DEFAULT_PICKABLE_HEIGHT_POSITION, 10);
        pickables.push(newOmena);
        newOmena.mesh.parent = ymparisto;
    }

    for (let positionz = -80; positionz <= 10; positionz = positionz + 5) {
        const newOmena = new OmenaObject(scene, omenaMaterial);
        newOmena.setPosition(60, DEFAULT_PICKABLE_HEIGHT_POSITION, positionz);
        newOmena.mesh.parent = ymparisto;
        pickables.push(newOmena);
    }

    const obsticles = createObsticles(scene, ymparisto);
    const meshImport = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/rabbit/rabbit.babylon");
    const puput = createRabbits(scene, meshImport);
    const aiti = new AitiObject(scene);
    aiti.setPosition(40, 2, 47);
    createTalo(scene, ymparisto, bounds);
    new RoadObject(scene);
    const maikit = [];
    const piilopaikat = [
        new Vector2(-40, 20),
        new Vector2(-45, 35),
        new Vector2(0, -90),
        new Vector2(-5, -85),
        new Vector2(-60, 30),
        new Vector2(-80, 20),
        new Vector2(-80, 60),
        new Vector2(80, 60),
        new Vector2(70, -60),
        new Vector2(40, 40),

    ];
    for (let i = 0; i < 10; i++) {
        const maikki = new MaikkiObject(scene, randomIntFromInterval(0, 4));
        maikki.setPosition(randomIntFromInterval(24, 35), 1.5, randomIntFromInterval(26, 43));
        maikki.setPiilopaikka(piilopaikat[i]);
        maikit.push(maikki);
        maikki.mesh.parent = kaverit;
    }
    await createTrees(scene, ymparisto);
    createGrass(scene);
    const joki = createJoki(scene, bounds);
    const enemies = [...createCars(scene), ...puput, joki];
    return {
        player,
        grounds: groundables,
        aiti,
        puput,
        orvokit,
        pickables,
        enemies,
        collectibles,
        obsticles,
        piilotettavat: maikit
    };

}

function createRabbits(scene: Scene, meshImport: ISceneLoaderAsyncResult): Rabbit[] {
    const rabbitCount = 1;
    const puput = [];
    const paths = [];
    paths.push(new Path([new Vector2(2, 5), new Vector2(18, 10), new Vector2(-4, -10)]));
    paths.push(new Path([new Vector2(10, 5), new Vector2(-4, 10), new Vector2(-4, -4)]));
    paths.push(new Path([new Vector2(-3, -6), new Vector2(-1, 10), new Vector2(-4, -10)]));
    paths.push(new Path([new Vector2(0, 0), new Vector2(1, 10)]));
    paths.push(new Path([new Vector2(-10, -6), new Vector2(7, 2)]));

    for (let i =0 ; i< rabbitCount; i++) {
        const pupu = new Rabbit(scene, meshImport);
        puput.push(pupu);
        pupu.mesh.position = new Vector3(i*10, 0, 3);
        pupu.path = paths[i];
    }
    meshImport.meshes[0].dispose();
    return puput;
}



function createSkybox(scene: Scene) {
    scene.clearColor = new BABYLON.Color4(0.5, 0.6, 1, 0.9);
    scene.fogColor = new BABYLON.Color3(1, 0, 1);
    scene.fogDensity = 0.5;
    scene.ambientColor = new BABYLON.Color3(1, 1, 2);
}