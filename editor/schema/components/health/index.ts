import type { WidgetSchema } from 'dacha-workbench';

export const health: WidgetSchema = {
  title: 'Health',
  fields: [
    {
      name: 'points',
      title: 'Points',
      type: 'number',
    },
    {
      name: 'immortal',
      title: 'Immortal',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    points: 100,
    immortal: false,
  }),
};
