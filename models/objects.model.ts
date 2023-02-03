import { Player} from './../prefabs/player';
import { HiirulainenTerrain } from './../prefabs/hiirulainen.terrain';
import { AitiObject } from '../prefabs/kaverit';
import { CollectibleModel } from './collectible.model';
import { Piilotettava } from './piilotettava.interface';
import { OrvokkiObject } from '../prefabs/kaverit';

export interface ObjectsModel {
  player: Player,
  ground: HiirulainenTerrain,
  aiti: AitiObject,
  orvokit: OrvokkiObject[],
  collectibles: CollectibleModel[],
  piilotettavat: Piilotettava[]
};