import { PhysicsImpostor, Scene, Vector2 } from "babylonjs";
import { AutoObject, MultaObject, NurmikkoObject, RoadObject, TaloObject, TimanttiObject } from "./environment";
import { HiirulainenTerrain } from "./hiirulainen.terrain";
import { MaikkiObject, OrvokkiObject } from "./kaverit";
import { Player } from "./player";
import { ObjectsModel } from "../models/objects.model";
import { createRenkaanPyoriminen } from "./animations";
import { AitiObject } from "./aiti.object";
import { calculateWidth } from "../utils/geometry.util";
import * as BABYLON from 'babylonjs';


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


    for (let i = 0; i < 15; i++) {
        const collectible = new TimanttiObject(scene, i);
        collectible.mesh.animations.push(createRenkaanPyoriminen());
        collectible.mesh.position.y = 1;
        collectible.setPosition(
            HiirulainenTerrain.randomIntFromInterval(bounds[0].x, bounds[1].x),
            1,
            HiirulainenTerrain.randomIntFromInterval(bounds[0].z + 50, bounds[1].z - 50));
        scene.beginAnimation(collectible.mesh, 0, 30, true);
        collectibles.push(collectible);
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
    createCars(scene);
    return {
        player,
        ground,
        aiti,
        orvokit,
        collectibles,
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

function createCars(scene: Scene): void {
    const car = new AutoObject(scene);
    car.setPosition(0, 2, 0);
    car.setScale(12);
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
}

function createTrees(scene: BABYLON.Scene) {
    const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "textures/palmtree.png", 1000, { width: 512, height: 1024 }, scene);
    for (let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        const treePositionX = Math.random() * (-100);
        const randomHeight = HiirulainenTerrain.randomIntFromInterval(15, 20);
        tree.position.x = treePositionX;

        tree.width = 10;
        tree.height = randomHeight;
        tree.position.set(treePositionX, randomHeight - 10, Math.random() * 50 + 15);
        const multaObject = new MultaObject();

        multaObject.setPosition(-100 + (calculateWidth(multaObject) / 2) + (i * calculateWidth(multaObject)), 0.1, 26);
    }
}

function createSkybox(scene: Scene) {
    scene.clearColor = new BABYLON.Color4(0.5, 0.6, 1, 0.9);
    scene.fogColor = new BABYLON.Color3(1, 0, 1);
    scene.fogDensity = 0.5;
    scene.ambientColor = new BABYLON.Color3(1, 1, 2);
}