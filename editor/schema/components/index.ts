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
} from '../../../src/game/components';

import { health } from './health';
import { hitBox } from './hit-box';
import { movement } from './movement';
import { weapon } from './weapon';
import { viewDirection } from './view-direction';
import { team } from './team';
import { shoalUnit } from './shoal-unit';
import { shoal } from './shoal';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Health.componentName]: health,
  [HitBox.componentName]: hitBox,
  [Movement.componentName]: movement,
  [Weapon.componentName]: weapon,
  [ViewDirection.componentName]: viewDirection,
  [Team.componentName]: team,
  [ShoalUnit.componentName]: shoalUnit,
  [Shoal.componentName]: shoal,
};
