import { HiirulainenTerrain } from '../core/hiirulainen.terrain';
import { AitiObject, MaikkiObject, OrvokkiObject } from '../kaverit';
import { createCarDriveAnimation, createRenkaanPyoriminen } from "./../core/animations";
import { NurmikkoObject } from './nurmikko/nurmikko.object';
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
import { ObsticleObject } from './obsticles/obsticle.object';
import { OmenaObject } from '../pickables/omena/omena.object';
import { DEFAULT_OBJECT_MASS, DEFAULT_PICKABLE_HEIGHT_POSITION, PLAYER_STARTING_POINT } from '../core/config';
import { TextureMaterial } from '../textures/texture.material';


function createTaloWithImposter(talofn: () => TaloObject): void {
    const talo = talofn();
    talo.perustuksetMesh.physicsImpostor = new PhysicsImpostor(talo.perustuksetMesh, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        ignoreParent: true,
        friction: 1,
        restitution: 0,
    });
}

export async function createEnvironment(scene: Scene): Promise<ObjectsModel> {
    createSkybox(scene);
    const ground = new HiirulainenTerrain(scene);
    const player = new Player(scene);
    player.position = PLAYER_STARTING_POINT;

    const collectibles = [];
    const bounds = ground.getBounds();
    const kaverit = new BABYLON.TransformNode("kaverit");
    const ymparisto = new BABYLON.TransformNode("ymparisto");

    const orvokit = [];
    for (let i = 0; i < 10; i++) {
        const orvokkiObject = new OrvokkiObject(scene);
        orvokkiObject.setPosition(40 + (i * 3), 2, 50);
        orvokit.push(orvokkiObject);
        orvokkiObject.mesh.parent = kaverit;
    }
    const omenaMaterial = new TextureMaterial(scene, "./textures/apple.jpeg")
    const obsticle = new ObsticleObject(scene, "trampoline.jpeg")
    obsticle.setPosition(30, 2, 20);
    obsticle.mesh.parent = ymparisto;

    const obsticle2 = new ObsticleObject(scene, "trampoline2.jpeg")
    obsticle2.setPosition(45, 5, 20);
    obsticle2.mesh.parent = ymparisto;

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

    const taloCount = 10;
    const syvyysCount = 2;
    for (let j = 1; j <= syvyysCount; j++) {
        for (let i = 1; i <= taloCount; i++) {
            createTaloWithImposter(() => {
                const talo = new TaloObject(scene, 1);
                talo.setPosition(bounds[0].x + (10 * i), 0, -100 + (20 * j));
                talo.setScale(HiirulainenTerrain.randomIntFromInterval(5, 8));
                talo.rotate(Math.PI / 2);
                talo.mesh.parent = ymparisto;
                return talo;
            });
        }

        createTaloWithImposter(() => {
            const ravintola = new TaloObject(scene, 3000);
            //   ravintola.mesh.scaling.x = 100;
            //  ravintola.mesh.scaling.y = 50;
            ravintola.setPosition(25, 0, 50);
            ravintola.setScale(5);
            ravintola.mesh.scaling.x = 25;
            ravintola.mesh.scaling.y = 20;
            ravintola.mesh.position.y = -4;
            ravintola.mesh.parent = ymparisto;

            return ravintola;
        });
    }

    const meshImport = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/rabbit/rabbit.babylon");
    const puput = createRabbits(scene, meshImport);
    const aiti = new AitiObject(scene);
    aiti.setPosition(40, 2, 47);
    createTaloWithImposter(() => {
        const talo2 = new TaloObject(scene, 2);
        talo2.setPosition(3, 0, 15);
        talo2.setScale(HiirulainenTerrain.randomIntFromInterval(4, 7));
        return talo2;
    });
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
        const maikki = new MaikkiObject(scene, HiirulainenTerrain.randomIntFromInterval(0, 4));
        maikki.setPosition(HiirulainenTerrain.randomIntFromInterval(24, 35), 1.5, HiirulainenTerrain.randomIntFromInterval(26, 43));
        maikki.setPiilopaikka(piilopaikat[i]);
        maikit.push(maikki);
        maikki.mesh.parent = kaverit;
    }
    await createTrees(scene, ymparisto);
    createGrass(scene);
    const enemies = [...createCars(scene), ...puput];
    return {
        player,
        ground,
        aiti,
        puput,
        orvokit,
        pickables,
        enemies,
        collectibles,
        obsticles: [obsticle, obsticle2],
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