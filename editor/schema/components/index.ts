import type { WidgetSchema } from 'dacha-workbench';

import {
  Health,
  HitBox,
  Movement,
  Weapon,
  ViewDirection,
  Team,
} from '../../../src/game/components';

import { health } from './health';
import { hitBox } from './hit-box';
import { movement } from './movement';
import { weapon } from './weapon';
import { viewDirection } from './view-direction';
import { team } from './team';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Health.componentName]: health,
  [HitBox.componentName]: hitBox,
  [Movement.componentName]: movement,
  [Weapon.componentName]: weapon,
  [ViewDirection.componentName]: viewDirection,
  [Team.componentName]: team,
};
