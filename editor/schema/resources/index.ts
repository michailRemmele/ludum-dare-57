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
  FloatingTrackScript,
  BonusTrackScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  playerScript,
  fishScript,
  trackScript,
  thornsScript,
  shooterScript,
  staticTrackScript,
  floatingTrackScript,
  bonusTrackScript,
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
    [FloatingTrackScript.scriptName]: floatingTrackScript,
    [BonusTrackScript.scriptName]: bonusTrackScript,
  },
  [EffectsSystem.systemName]: {},
};
