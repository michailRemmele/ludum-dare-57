export interface MeleeWeaponConfig extends Record<string, unknown> {
  damage: number
  range: number
}

export class MeleeWeapon {
  damage: number;
  range: number;

  constructor(config: Record<string, unknown>) {
    const { damage, range } = config as MeleeWeaponConfig;

    this.damage = damage;
    this.range = range;
  }

  clone(): MeleeWeapon {
    return new MeleeWeapon({
      damage: this.damage,
      range: this.range,
    });
  }
}
