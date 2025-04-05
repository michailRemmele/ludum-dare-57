import { ScriptSystem } from 'dacha';
import { EffectsSystem } from 'dacha-game-systems';

import {
  CameraScript,
  PlayerScript,
  FishScript,
  TrackScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  playerScript,
  fishScript,
  trackScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PlayerScript.scriptName]: playerScript,
    [FishScript.scriptName]: fishScript,
    [TrackScript.scriptName]: trackScript,
  },
  [EffectsSystem.systemName]: {},
};
