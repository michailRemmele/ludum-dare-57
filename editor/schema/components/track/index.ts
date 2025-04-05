import type { WidgetSchema } from 'dacha-workbench';
import type { FC } from 'react';

import { TrackWidget } from './view';

export const track: WidgetSchema = {
  title: 'Track',
  fields: [
    {
      name: 'mob',
      title: 'Mob',
      type: 'select',
      referenceId: 'templates',
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
    },
    {
      name: 'frequency',
      title: 'Frequency',
      type: 'number',
    },
  ],
  view: TrackWidget as FC,
  getInitialState: () => ({
    mob: '',
    amount: 0,
    frequency: 1000,
  }),
};
