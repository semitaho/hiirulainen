import { NurmikkoObject } from "./nurmikko.object";
import * as BABYLON from 'babylonjs';

export function createGrass(scene: BABYLON.Scene) {
    const nurmikkoCount = 15;
    for (let i = 0; i < nurmikkoCount; i++) {
        const nurmikkoObject = new NurmikkoObject(scene);
        nurmikkoObject.setPosition((-100 + NurmikkoObject.WIDTH / 2) + i * (NurmikkoObject.WIDTH), 0.1, -41);
    }
}