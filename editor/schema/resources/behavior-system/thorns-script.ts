import type { WidgetPartSchema } from 'dacha-workbench';

export const thornsScript: WidgetPartSchema = {
  fields: [
    {
      name: 'damage',
      title: 'Damage',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    damage: 0,
  }),
};
