import { Component } from 'dacha';

import { MeleeWeapon } from './melee-weapon';
import { RangeWeapon } from './range-weapon';

const weapons = {
  melee: MeleeWeapon,
  range: RangeWeapon,
};

export interface WeaponConfig {
  type: 'melee' | 'range'
  cooldown: number
  properties: Record<string, unknown>
}

export class Weapon extends Component {
  type: 'melee' | 'range';
  cooldown: number;
  cooldownRemaining: number;
  isActive: boolean;
  properties: MeleeWeapon | RangeWeapon;

  constructor(config: WeaponConfig) {
    super();

    this.type = config.type;
    this.cooldown = config.cooldown;
    this.cooldownRemaining = 0;
    this.isActive = false;

    if (!weapons[this.type]) {
      throw new Error(`Not found weapon with same type: ${this.type}`);
    }

    this.properties = new weapons[this.type](config.properties);
  }

  clone(): Weapon {
    return new Weapon({
      type: this.type,
      cooldown: this.cooldown,
      properties: this.properties.clone() as unknown as Record<string, unknown>,
    });
  }
}

Weapon.componentName = 'Weapon';
