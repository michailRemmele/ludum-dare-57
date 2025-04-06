import { ScriptSystem } from 'dacha';
import { EffectsSystem } from 'dacha-game-systems';

import {
  CameraScript,
  PlayerScript,
  FishScript,
  TrackScript,
  ThornsScript,
  ShooterScript,
  StaticTrackScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  playerScript,
  fishScript,
  trackScript,
  thornsScript,
  shooterScript,
  staticTrackScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PlayerScript.scriptName]: playerScript,
    [FishScript.scriptName]: fishScript,
    [TrackScript.scriptName]: trackScript,
    [ThornsScript.scriptName]: thornsScript,
    [ShooterScript.scriptName]: shooterScript,
    [StaticTrackScript.scriptName]: staticTrackScript,
  },
  [EffectsSystem.systemName]: {},
};
