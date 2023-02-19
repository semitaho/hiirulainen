import { Player} from '../player/player';
import { HiirulainenTerrain } from './../core/hiirulainen.terrain';
import { AitiObject } from '../kaverit';
import { CollectibleModel } from './collectible.model';
import { Piilotettava } from './piilotettava.interface';
import { OrvokkiObject } from '../kaverit';
import { ObsticleObject } from '../environment/obsticles/obsticle.object';
import { PickableObject } from '../pickables/pickable.object';
import { Enemy } from '../models';
import { AbstractMesh, Mesh } from 'babylonjs';
import { Rabbit } from '../enemies';

export interface ObjectsModel {
  player: Player,
  ground: HiirulainenTerrain,
  aiti: AitiObject,
  orvokit: OrvokkiObject[],
  pickables: PickableObject[],
  collectibles: CollectibleModel[],
  obsticles: ObsticleObject[],
  enemies: Enemy[],
  puput: Rabbit[],
  piilotettavat: Piilotettava[]
};