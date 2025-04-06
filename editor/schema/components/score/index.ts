import type { WidgetSchema } from 'dacha-workbench';

export const score: WidgetSchema = {
  title: 'Score',
  fields: [
    {
      name: 'value',
      title: 'Value',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    value: 0,
  }),
};
