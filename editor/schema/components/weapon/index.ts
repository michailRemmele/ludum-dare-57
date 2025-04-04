import type { WidgetSchema } from 'dacha-workbench';
import type { FC } from 'react';

import { WeaponWidget } from './view';

export const weapon: WidgetSchema = {
  title: 'Weapon',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'cooldown',
      title: 'Cooldown',
      type: 'number',
    },
    {
      name: 'properties.damage',
      title: 'Damage',
      type: 'number',
    },
    {
      name: 'properties.range',
      title: 'Range',
      type: 'number',
    },
    {
      name: 'properties.projectileSpeed',
      title: 'Projectile Speed',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'range',
      },
    },
    {
      name: 'properties.projectileRadius',
      title: 'Projectile Radius',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'range',
      },
    },
    {
      name: 'properties.projectileModel',
      title: 'Projectile Model',
      type: 'select',
      referenceId: 'models',
      dependency: {
        name: 'type',
        value: 'range',
      },
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'Melee',
          value: 'melee',
        },
        {
          title: 'Range',
          value: 'range',
        },
      ],
    },
  },
  view: WeaponWidget as FC,
  getInitialState: () => ({
    type: 'melee',
    cooldown: 1000,
    properties: {
      damage: 1,
      range: 10,
    },
  }),
};
