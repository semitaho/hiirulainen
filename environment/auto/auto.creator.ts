import { Scene } from "babylonjs";
import { createCarDriveAnimation } from "../../core/animations";
import { AutoObject } from "./auto.object";

export function createCars(scene: Scene): AutoObject[] {
    const car = new AutoObject(scene);
    const animCar = createCarDriveAnimation();
    car.mesh.animations = [];
    car.mesh.animations.push(animCar);
    scene.beginAnimation(car.mesh, 0, 300, true);
    return [car];
}