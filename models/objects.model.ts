import { Player} from './../prefabs/player';
import { HiirulainenTerrain } from './../prefabs/hiirulainen.terrain';
import { AitiObject } from '../prefabs/aiti.object';
import { CollectibleModel } from './collectible.model';

export interface ObjectsModel {
  player: Player,
  ground: HiirulainenTerrain,
  aiti: AitiObject,
  collectibles: CollectibleModel[]
};