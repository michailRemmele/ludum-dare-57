import type { WidgetSchema } from 'dacha-workbench';

export const team: WidgetSchema = {
  title: 'Team',
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
