import type { WidgetSchema } from 'dacha-workbench';

import {
  CombatSystem,
  MovementSystem,
  Reaper,
  Saver,
  AnalyticsSystem,
} from '../../../src/game/systems';

import { combatSystem } from './combat-system';
import { movementSystem } from './movement-system';
import { reaper } from './reaper';
import { saver } from './saver';
import { analyticsSystem } from './analytics-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [CombatSystem.systemName]: combatSystem,
  [MovementSystem.systemName]: movementSystem,
  [Reaper.systemName]: reaper,
  [Saver.systemName]: saver,
  [AnalyticsSystem.systemName]: analyticsSystem,
};
