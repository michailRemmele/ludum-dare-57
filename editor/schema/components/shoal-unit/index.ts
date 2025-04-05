import type { WidgetSchema } from 'dacha-workbench';

export const shoalUnit: WidgetSchema = {
  title: 'ShoalUnit',
  fields: [
    {
      name: 'index',
      title: 'Index',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
  }),
};
