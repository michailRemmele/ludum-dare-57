import { ScriptSystem } from 'dacha';
import { EffectsSystem } from 'dacha-game-systems';

import {
  CameraScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
  },
  [EffectsSystem.systemName]: {},
};
