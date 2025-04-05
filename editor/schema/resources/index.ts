import { ScriptSystem } from 'dacha';
import { EffectsSystem } from 'dacha-game-systems';

import {
  CameraScript,
  PlayerScript,
  FishScript,
  TrackScript,
  ThornsScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  playerScript,
  fishScript,
  trackScript,
  thornsScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PlayerScript.scriptName]: playerScript,
    [FishScript.scriptName]: fishScript,
    [TrackScript.scriptName]: trackScript,
    [ThornsScript.scriptName]: thornsScript,
  },
  [EffectsSystem.systemName]: {},
};
