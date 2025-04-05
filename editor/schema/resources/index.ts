import { ScriptSystem } from 'dacha';
import { EffectsSystem } from 'dacha-game-systems';

import {
  CameraScript,
  PlayerScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  playerScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PlayerScript.scriptName]: playerScript,
  },
  [EffectsSystem.systemName]: {},
};
