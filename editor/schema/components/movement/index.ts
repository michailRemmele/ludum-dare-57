import type { WidgetSchema } from 'dacha-workbench';

export const movement: WidgetSchema = {
  title: 'Movement',
  fields: [
    {
      name: 'speed',
      title: 'Speed',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    speed: 0,
  }),
};
