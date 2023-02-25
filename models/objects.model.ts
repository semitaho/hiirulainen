import { Player} from '../player/player';
import { AitiObject } from '../kaverit';
import { CollectibleModel } from './collectible.model';
import { Piilotettava } from './piilotettava.interface';
import { OrvokkiObject } from '../kaverit';
import { ObsticleObject } from '../environment/obsticles/obsticle.object';
import { PickableObject } from '../pickables/pickable.object';
import { Enemy } from '../models';
import { AbstractMesh, Mesh } from 'babylonjs';
import { Rabbit } from '../enemies';
import { TerrainObject } from '../environment/terrain/terrain.object';
import { Groundable } from './groundable.model';

export interface ObjectsModel {
  player: Player,
  grounds: Groundable[],
  aiti: AitiObject,
  orvokit: OrvokkiObject[],
  pickables: PickableObject[],
  collectibles: CollectibleModel[],
  obsticles: ObsticleObject[],
  enemies: Enemy[],
  puput: Rabbit[],
  piilotettavat: Piilotettava[]
};