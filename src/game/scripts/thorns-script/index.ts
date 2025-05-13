import type {
  BehaviorOptions,
} from 'dacha';
import {
  Actor,
  Behavior,
} from 'dacha';
import { CollisionStay } from 'dacha/events';
import type { CollisionStayEvent } from 'dacha/events';

import {
  Team,
  HitBox,
} from '../../components';
import * as EventType from '../../events';

interface ThornsBehaviorOptions extends BehaviorOptions {
  damage: number
}

export class ThornsScript extends Behavior {
  private actor: Actor;

  private damage: number;

  constructor(options: ThornsBehaviorOptions) {
    super();

    this.actor = options.actor;

    this.damage = options.damage;

    this.actor.addEventListener(CollisionStay, this.handleCollisionStay);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionStay, this.handleCollisionStay);
  }

  private handleCollisionStay = (event: CollisionStayEvent): void => {
    const { actor } = event;

    const hitBox = actor.getComponent(HitBox);
    const parent = actor.parent instanceof Actor ? actor.parent : undefined;
    const team = parent?.getComponent(Team);

    if (!parent || !hitBox || hitBox.disabled || team?.index !== 1) {
      return;
    }

    parent.dispatchEvent(EventType.Damage, { value: this.damage });
  };
}

ThornsScript.behaviorName = 'ThornsScript';
