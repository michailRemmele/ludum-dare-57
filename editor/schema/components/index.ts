import type { WidgetSchema } from 'dacha-workbench';

import {
  Health,
  HitBox,
  Movement,
  Weapon,
  ViewDirection,
  Team,
  ShoalUnit,
  Shoal,
  EnemyDetector,
  TrackActivator,
  TrackSegment,
  Track,
  LevelInfo,
} from '../../../src/game/components';

import { health } from './health';
import { hitBox } from './hit-box';
import { movement } from './movement';
import { weapon } from './weapon';
import { viewDirection } from './view-direction';
import { team } from './team';
import { shoalUnit } from './shoal-unit';
import { shoal } from './shoal';
import { enemyDetector } from './enemy-detector';
import { trackActivator } from './track-activator';
import { trackSegment } from './track-segment';
import { track } from './track';
import { levelInfo } from './level-info';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Health.componentName]: health,
  [HitBox.componentName]: hitBox,
  [Movement.componentName]: movement,
  [Weapon.componentName]: weapon,
  [ViewDirection.componentName]: viewDirection,
  [Team.componentName]: team,
  [ShoalUnit.componentName]: shoalUnit,
  [Shoal.componentName]: shoal,
  [EnemyDetector.componentName]: enemyDetector,
  [TrackActivator.componentName]: trackActivator,
  [TrackSegment.componentName]: trackSegment,
  [Track.componentName]: track,
  [LevelInfo.componentName]: levelInfo,
};
