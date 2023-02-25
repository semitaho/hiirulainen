import { Scene, TransformNode } from "babylonjs";
import { ObsticleObject } from './obsticle.object';
export function createObsticles(scene: Scene, ymparisto: TransformNode): ObsticleObject[] {
    const obsticle = new ObsticleObject(scene, "trampoline.jpeg")
    obsticle.setPosition(25, 3, 40);
    obsticle.mesh.parent = ymparisto;

    const obsticle2 = new ObsticleObject(scene, "trampoline2.jpeg")
    obsticle2.setPosition(20, 4, 50);
    obsticle2.mesh.parent = ymparisto;
    return [obsticle, obsticle2];

}