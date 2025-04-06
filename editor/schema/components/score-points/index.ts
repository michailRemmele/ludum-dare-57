import type { WidgetSchema } from 'dacha-workbench';

export const scorePoints: WidgetSchema = {
  title: 'Score Points',
  fields: [
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    amount: 0,
  }),
};
