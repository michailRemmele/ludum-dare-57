export interface RangeWeaponConfig extends Record<string, unknown> {
  damage: number
  range: number
  projectileSpeed: number
  projectileModel: string
  projectileRadius: number
}

export class RangeWeapon {
  damage: number;
  range: number;
  projectileSpeed: number;
  projectileModel: string;
  projectileRadius: number;

  constructor(config: Record<string, unknown>) {
    const {
      damage,
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
    } = config as RangeWeaponConfig;

    this.damage = damage;
    this.range = range;
    this.projectileSpeed = projectileSpeed;
    this.projectileModel = projectileModel;
    this.projectileRadius = projectileRadius;
  }

  clone(): RangeWeapon {
    return new RangeWeapon({
      damage: this.damage,
      range: this.range,
      projectileSpeed: this.projectileSpeed,
      projectileModel: this.projectileModel,
      projectileRadius: this.projectileRadius,
    });
  }
}
