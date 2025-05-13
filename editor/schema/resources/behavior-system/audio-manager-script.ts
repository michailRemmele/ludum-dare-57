import type { WidgetPartSchema } from 'dacha-workbench';

export const audioManagerScript: WidgetPartSchema = {
  fields: [
    {
      name: 'backgroundMusic',
      title: 'backgroundMusic',
      type: 'string',
    },
    {
      name: 'levelUp',
      title: 'levelUp',
      type: 'string',
    },
    {
      name: 'powerUp',
      title: 'powerUp',
      type: 'string',
    },
    {
      name: 'fishDamage',
      title: 'fishDamage',
      type: 'string',
    },
    {
      name: 'fishDeath',
      title: 'fishDeath',
      type: 'string',
    },
    {
      name: 'fishBite',
      title: 'fishBite',
      type: 'string',
    },
    {
      name: 'enemyShoot',
      title: 'enemyShoot',
      type: 'string',
    },
    {
      name: 'win',
      title: 'win',
      type: 'string',
    },
    {
      name: 'lose',
      title: 'lose',
      type: 'string',
    },
  ],
};
