import type { Reference } from 'dacha-workbench';

import {
  Movement,
  MovementJump,
  AttackInput,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Movement,
    MovementJump,
    AttackInput,
  ].map((value) => ({ title: value, value })),
};
