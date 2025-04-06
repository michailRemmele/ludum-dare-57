import type { WidgetPartSchema } from 'dacha-workbench';

export const fishScript: WidgetPartSchema = {
  fields: [
    {
      name: 'shoalIndex',
      title: 'Shoal Index',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    shoalIndex: -1,
  }),
};
