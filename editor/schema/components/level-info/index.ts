import type { WidgetSchema } from 'dacha-workbench';

export const levelInfo: WidgetSchema = {
  title: 'Level Info',
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
