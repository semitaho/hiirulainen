import { HiirulainenTerrain } from '../hiirulainen.terrain';
import { AitiObject, MaikkiObject, OrvokkiObject } from '../kaverit';
import { TimanttiObject } from './timantti.object';
import { createRenkaanPyoriminen } from "./../../core/animations";
import { NurmikkoObject } from './nurmikko.object';
import { PhysicsImpostor, Scene, Vector2 } from 'babylonjs';
import { ObjectsModel } from '../../models/objects.model';
import { Player } from '../player';
import { TaloObject } from './talo.object';
import { RoadObject } from './road.object';
import * as BABYLON from 'babylonjs';
import { AutoObject } from './auto.object';
import { MultaObject } from './multa.object';
import { JuustoObject } from './juusto.object';

import { calculateWidth } from '../../utils/geometry.util';
import { ObsticleObject} from './obsticle.object';
import { OmenaObject } from './omena.object';
import { DEFAULT_PICKABLE_HEIGHT_POSITION } from '../../core/config';


function createTaloWithImposter(talofn: () => TaloObject): void {
    const talo = talofn();
    talo.perustuksetMesh.physicsImpostor = new PhysicsImpostor(talo.perustuksetMesh, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        ignoreParent: true,
        friction: 1,
        restitution: 0,
    });
}

export function createEnvironment(scene: Scene): ObjectsModel {
    createSkybox(scene);
    const ground = new HiirulainenTerrain(scene);
    const player = new Player(scene);
    player.setPosition(35, 1.5, 47);

    const collectibles = [];
    const bounds = ground.getBounds();
    const orvokit = [];
    for (let i = 0; i < 10; i++) {
        const orvokkiObject = new OrvokkiObject(scene);
        orvokkiObject.setPosition(40 + (i * 3), 2, 50);
        orvokit.push(orvokkiObject);
    }

    const obsticle = new ObsticleObject(scene, "trampoline.jpeg")
    obsticle.setPosition(30, 2, 20);

    const obsticle2 = new ObsticleObject(scene,  "trampoline2.jpeg")
    obsticle2.setPosition(45, 5, 20);
    const omena = new OmenaObject(scene);
    omena.setPosition(45, 7, 20);
    const pickables = [omena];

    for (let positionX= 20; positionX <= 50; positionX = positionX + 3) {
        const newOmena = new OmenaObject(scene);
        newOmena.setPosition(positionX, DEFAULT_PICKABLE_HEIGHT_POSITION, 10);
        pickables.push(newOmena);
    }

    for (let positionz= -80; positionz <= 10; positionz = positionz + 5) {
        const newOmena = new OmenaObject(scene);
        newOmena.setPosition(60, DEFAULT_PICKABLE_HEIGHT_POSITION, positionz);
        pickables.push(newOmena);
    }

    /*
    const juusto = new JuustoObject(scene);
    juusto.setPosition(45, DEFAULT_PICKABLE_HEIGHT_POSITION, player.position.z);
*/

    const taloCount = 10;
    const syvyysCount = 2;
    for (let j = 1; j <= syvyysCount; j++) {
        for (let i = 1; i <= taloCount; i++) {
            createTaloWithImposter(() => {
                const talo = new TaloObject(scene, 1);
                talo.setPosition(bounds[0].x + (10 * i), 0, -100 + (20 * j));
                talo.setScale(HiirulainenTerrain.randomIntFromInterval(5, 8));
                talo.rotate(Math.PI / 2);
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
            return ravintola;
        });


    }


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
        new Vector2( 80, 60),
        new Vector2( 70, -60),
        new Vector2( 40, 40),
    
    ];
    for (let i = 0; i < 10; i++) {
        const maikki = new MaikkiObject(scene, HiirulainenTerrain.randomIntFromInterval(0, 4));
        maikki.setPosition(HiirulainenTerrain.randomIntFromInterval(24, 35), 1.5, HiirulainenTerrain.randomIntFromInterval(26, 43));
        maikki.setPiilopaikka(piilopaikat[i]);
        maikit.push(maikki);
    }
    createTrees(scene);
    createGrass(scene);
    const enemies = createCars(scene);
    return {
        player,
        ground,
        aiti,
        orvokit,
        pickables,
        enemies,
        collectibles,
        obsticles: [obsticle, obsticle2],
        piilotettavat: maikit
    };

}

function createGrass(scene: BABYLON.Scene) {
    const nurmikkoCount = 15;
    for (let i = 0; i < nurmikkoCount; i++) {
        const nurmikkoObject = new NurmikkoObject(scene);
        nurmikkoObject.setPosition((-100 + NurmikkoObject.WIDTH / 2) + i * (NurmikkoObject.WIDTH), 0.1, -41);
    }
}

function createCars(scene: Scene): AutoObject[] {
    const car = new AutoObject(scene);
    const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const carKeys = [];

    carKeys.push({
        frame: 0,
        value: -100
    });

    carKeys.push({
        frame: 150,
        value: 0
    });

    carKeys.push({
        frame: 300,
        value: 100
    });

    animCar.setKeys(carKeys);

    car.mesh.animations = [];
    car.mesh.animations.push(animCar);

    scene.beginAnimation(car.mesh, 0, 300, true);
    return [car];
}

function createTrees(scene: BABYLON.Scene) {
    const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/palmtree.png", 1000, { width: 512, height: 1024 }, scene);
    for (let i = 0; i < 20; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        const treePositionX = Math.random() * (-100);
        const randomHeight = HiirulainenTerrain.randomIntFromInterval(15, 20);
        tree.position.x = treePositionX;

        tree.width = 10;
        tree.height = randomHeight;
        tree.position.set(treePositionX, randomHeight - 10, Math.random() * 50 + 15);
        const multaObject = new MultaObject(scene);
        multaObject.setPosition(-100 + (calculateWidth(multaObject) / 2) + (i * calculateWidth(multaObject)), 0.1, 26);
    }

    for (let i = 500; i < 600; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        const treePositionX = HiirulainenTerrain.randomIntFromInterval(30, 90);
        const treePositionZ=  HiirulainenTerrain.randomIntFromInterval(-20, -50);

        const randomHeight = HiirulainenTerrain.randomIntFromInterval(15, 20);
        tree.position.x = treePositionX;
        tree.position.z = treePositionZ;

        tree.width = 10;
        tree.height = randomHeight 
        tree.position.y += 3;
        //tree.size = 10;
      //  tree.position.set(treePositionX, 0, treePositionZ);
    }
}

function createSkybox(scene: Scene) {
    scene.clearColor = new BABYLON.Color4(0.5, 0.6, 1, 0.9);
    scene.fogColor = new BABYLON.Color3(1, 0, 1);
    scene.fogDensity = 0.5;
    scene.ambientColor = new BABYLON.Color3(1, 1, 2);
}