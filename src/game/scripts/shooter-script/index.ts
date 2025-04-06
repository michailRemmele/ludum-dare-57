import type {
  ScriptOptions,
  UpdateOptions,
} from 'dacha';
import {
  Actor,
  Script,
  Transform,
} from 'dacha';
import { CollisionStay } from 'dacha/events';
import type { CollisionStayEvent } from 'dacha/events';

import {
  Team,
  Weapon,
  EnemyDetector,
  HitBox,
} from '../../components';
import * as EventType from '../../events';

interface ShooterScriptOptions extends ScriptOptions {
  burstTimeout: number
  burstAmount: number
}

export class ShooterScript extends Script {
  private actor: Actor;

  private burstTimeout: number;
  private burstAmount: number;

  private burstBulletsLeft: number;
  private burstCooldown: number;

  private enemyDetector: Actor;

  constructor(options: ShooterScriptOptions) {
    super();

    this.actor = options.actor;

    this.burstTimeout = options.burstTimeout;
    this.burstAmount = options.burstAmount;

    this.burstBulletsLeft = options.burstAmount;
    this.burstCooldown = 0;

    this.enemyDetector = this.actor.children.find((child) => child.getComponent(EnemyDetector))!;

    this.actor.addEventListener(EventType.Attack, this.handleAttack);
    this.enemyDetector.addEventListener(CollisionStay, this.handleCollisionEnemyDetector);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Attack, this.handleAttack);
    this.enemyDetector.removeEventListener(CollisionStay, this.handleCollisionEnemyDetector);
  }

  private handleAttack = (): void => {
    this.burstBulletsLeft -= 1;

    if (this.burstBulletsLeft === 0) {
      this.burstCooldown = this.burstTimeout;
      this.burstBulletsLeft = this.burstAmount;
    }
  };

  private handleCollisionEnemyDetector = (event: CollisionStayEvent): void => {
    if (this.burstCooldown > 0) {
      return;
    }

    const { actor } = event;

    const hitBox = actor.getComponent(HitBox);
    const team = actor.parent instanceof Actor ? actor.parent.getComponent(Team) : undefined;

    if (!hitBox || team?.index !== 1) {
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

ShooterScript.scriptName = 'ShooterScript';
