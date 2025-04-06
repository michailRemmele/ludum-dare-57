import type { WidgetSchema } from 'dacha-workbench';

export const hitBox: WidgetSchema = {
  title: 'HitBox',
  fields: [
    {
      name: 'disabled',
      title: 'Disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    disabled: false,
  }),
};
