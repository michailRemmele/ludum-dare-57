import type { WidgetPartSchema } from 'dacha-workbench';

export const shooterScript: WidgetPartSchema = {
  fields: [
    {
      name: 'burstTimeout',
      title: 'Burst Timeout',
      type: 'number',
    },
    {
      name: 'burstAmount',
      title: 'Burst Amount',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    burstTimeout: 0,
    burstAmount: 0,
  }),
};
