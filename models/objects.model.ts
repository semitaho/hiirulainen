import { Player} from './../prefabs/player';
import { HiirulainenTerrain } from './../prefabs/hiirulainen.terrain';
import { AitiObject } from '../prefabs/kaverit';
import { CollectibleModel } from './collectible.model';
import { Piilotettava } from './piilotettava.interface';
import { OrvokkiObject } from '../prefabs/kaverit';
import { ObsticleObject } from '../prefabs/environment/obsticle.object';
import { PickableObject } from '../prefabs/environment/pickable.object';
import { Enemy } from '../models';

export interface ObjectsModel {
  player: Player,
  ground: HiirulainenTerrain,
  aiti: AitiObject,
  orvokit: OrvokkiObject[],
  pickables: PickableObject[],
  collectibles: CollectibleModel[],
  obsticles: ObsticleObject[],
  enemies: Enemy[],
  piilotettavat: Piilotettava[]
};