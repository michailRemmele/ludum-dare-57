import { BehaviorSystem } from 'dacha';
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
  ControlStickScript,
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
  controlStickScript,
} from './behavior-system';

export const resourcesSchema = {
  [BehaviorSystem.systemName]: {
    [CameraScript.behaviorName]: cameraScript,
    [PlayerScript.behaviorName]: playerScript,
    [FishScript.behaviorName]: fishScript,
    [TrackScript.behaviorName]: trackScript,
    [ThornsScript.behaviorName]: thornsScript,
    [ShooterScript.behaviorName]: shooterScript,
    [StaticTrackScript.behaviorName]: staticTrackScript,
    [FloatingTrackScript.behaviorName]: floatingTrackScript,
    [BonusTrackScript.behaviorName]: bonusTrackScript,
    [AudioManagerScript.behaviorName]: audioManagerScript,
    [ControlStickScript.behaviorName]: controlStickScript,
  },
  [EffectsSystem.systemName]: {},
};
