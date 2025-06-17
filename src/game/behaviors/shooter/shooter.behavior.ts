import type {
  BehaviorOptions,
  UpdateOptions,
} from 'dacha';
import {
  Actor,
  Behavior,
  Transform,
} from 'dacha';
import { CollisionStay } from 'dacha/events';
import type { CollisionStayEvent } from 'dacha/events';
import { DefineBehavior, DefineField } from 'dacha-workbench/decorators';

import Team from '../../components/team/team.component';
import Weapon from '../../components/weapon/weapon.component';
import EnemyDetector from '../../components/enemy-detector/enemy-detector.component';
import HitBox from '../../components/hit-box/hit-box.component';
import * as EventType from '../../events';

interface ShooterBehaviorOptions extends BehaviorOptions {
  burstTimeout: number
  burstAmount: number
  isWeaponLocked: boolean
}

@DefineBehavior({
  name: 'ShooterBehavior',
})
export default class ShooterBehavior extends Behavior {
  private actor: Actor;

  @DefineField()
  private burstTimeout: number;

  @DefineField()
  private burstAmount: number;

  @DefineField()
  private isWeaponLocked: boolean;

  private burstBulletsLeft: number;
  private burstCooldown: number;

  private enemyDetector: Actor;

  constructor(options: ShooterBehaviorOptions) {
    super();

    this.actor = options.actor;

    this.burstTimeout = options.burstTimeout;
    this.burstAmount = options.burstAmount;
    this.isWeaponLocked = options.isWeaponLocked;

    this.burstBulletsLeft = options.burstAmount;
    this.burstCooldown = 0;

    this.enemyDetector = this.actor.children.find((child) => child.getComponent(EnemyDetector))!;

    this.actor.addEventListener(EventType.Attack, this.handleAttack);
    this.actor.addEventListener(EventType.UnlockWeapon, this.handleUnlockWeapon);
    this.enemyDetector.addEventListener(CollisionStay, this.handleCollisionEnemyDetector);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Attack, this.handleAttack);
    this.actor.removeEventListener(EventType.UnlockWeapon, this.handleUnlockWeapon);
    this.enemyDetector.removeEventListener(CollisionStay, this.handleCollisionEnemyDetector);
  }

  private handleAttack = (): void => {
    this.burstBulletsLeft -= 1;
    this.actor.dispatchEvent(EventType.EnemyShoot);

    if (this.burstBulletsLeft === 0) {
      this.burstCooldown = this.burstTimeout;
      this.burstBulletsLeft = this.burstAmount;
    }
  };

  private handleUnlockWeapon = (): void => {
    this.isWeaponLocked = false;
  };

  private handleCollisionEnemyDetector = (event: CollisionStayEvent): void => {
    if (this.isWeaponLocked) {
      return;
    }
    if (this.burstCooldown > 0) {
      return;
    }

    const { actor } = event;

    const hitBox = actor.getComponent(HitBox);
    const team = actor.parent instanceof Actor ? actor.parent.getComponent(Team) : undefined;

    if (!hitBox || hitBox.disabled || team?.index !== 1) {
      return;
    }

    const weapon = this.actor.getComponent(Weapon);
    const transform = actor.getComponent(Transform);

    if (weapon.cooldownRemaining > 0) {
      return;
    }

    this.actor.dispatchEvent(EventType.AttackInput, {
      x: transform.offsetX,
      y: transform.offsetY,
    });
  };

  update(options: UpdateOptions): void {
    if (this.burstCooldown > 0) {
      this.burstCooldown -= options.deltaTime;
    }
  }
}
