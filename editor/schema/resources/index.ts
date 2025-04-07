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
  AudioManagerScript,
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
  audioManagerScript,
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
    [AudioManagerScript.scriptName]: audioManagerScript,
  },
  [EffectsSystem.systemName]: {},
};
