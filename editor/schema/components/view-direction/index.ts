import type { WidgetSchema } from 'dacha-workbench';

export const viewDirection: WidgetSchema = {
  title: 'ViewDirection',
  fields: [
    {
      name: 'x',
      title: 'X',
      type: 'number',
    },
    {
      name: 'y',
      title: 'Y',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    x: 0,
    y: 0,
  }),
};
