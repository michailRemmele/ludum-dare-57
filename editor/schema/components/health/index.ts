import type { WidgetSchema } from 'dacha-workbench';

export const health: WidgetSchema = {
  title: 'Health',
  fields: [
    {
      name: 'points',
      title: 'Points',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    points: 100,
  }),
};
