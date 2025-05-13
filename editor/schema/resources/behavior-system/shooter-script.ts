import type { WidgetPartSchema } from 'dacha-workbench';

export const shooterScript: WidgetPartSchema = {
  fields: [
    {
      name: 'burstTimeout',
      title: 'Burst Timeout',
      type: 'number',
    },
    {
      name: 'burstAmount',
      title: 'Burst Amount',
      type: 'number',
    },
    {
      name: 'isWeaponLocked',
      title: 'Is Weapon Locked',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    burstTimeout: 0,
    burstAmount: 0,
    isWeaponLocked: false,
  }),
};
