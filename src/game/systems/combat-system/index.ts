import {
  ActorCollection,
  MathOps,
  System,
  Transform,
} from 'dacha';
import type {
  Scene,
  ActorSpawner,
  SystemOptions,
  UpdateOptions,
} from 'dacha';
import { RemoveActor } from 'dacha/events';
import type { RemoveActorEvent } from 'dacha/events';

import * as EventType from '../../events';
import type { AttackEvent } from '../../events';
import { Weapon } from '../../components';

import { SimpleFighter } from './fighters';
import type { Fighter } from './fighters';
import type { Attack } from './attacks';

export class CombatSystem extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;
  private actorSpawner: ActorSpawner;

  private fighters: Record<string, Fighter>;
  private activeAttacks: Array<Attack>;
  private events: Array<AttackEvent>;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [Weapon],
    });
    this.actorSpawner = options.actorSpawner;

    this.fighters = {};
    this.activeAttacks = [];

    this.events = [];
  }

  mount(): void {
    this.scene.addEventListener(EventType.AttackInput, this.handleAttack);
    this.actorCollection.addEventListener(RemoveActor, this.handleRemoveActor);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.AttackInput, this.handleAttack);
    this.actorCollection.removeEventListener(RemoveActor, this.handleRemoveActor);
  }

  private handleRemoveActor = (event: RemoveActorEvent): void => {
    delete this.fighters[event.actor.id];
  };

  private handleAttack = (event: AttackEvent): void => {
    this.events.push(event);
  };

  private updateActiveAttacks(deltaTime: number): void {
    this.activeAttacks = this.activeAttacks.filter((attack) => {
      attack.update(deltaTime);

      if (attack.isFinished) {
        attack.destroy();
      }

      return !attack.isFinished;
    });
  }

  private updateFighters(deltaTime: number): void {
    this.actorCollection.forEach((actor) => {
      if (!this.fighters[actor.id]) {
        this.fighters[actor.id] = new SimpleFighter(actor, this.actorSpawner, this.scene);
      } else {
        this.fighters[actor.id].update(deltaTime);
      }
    });
  }

  private updateNewAttacks(): void {
    this.events.forEach((event) => {
      const { x, y, target } = event;

      const { offsetX, offsetY } = target.getComponent(Transform);

      const fighter = this.fighters[target.id];

      if (!fighter || !fighter.isReady) {
        return;
      }

      const radAngle = MathOps.getAngleBetweenTwoPoints(x, offsetX, y, offsetY);

      const attack = fighter.attack(radAngle);

      if (attack) {
        this.activeAttacks.push(attack);
        target.dispatchEvent(EventType.Attack);
      }
    });
    this.events = [];
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.updateFighters(deltaTime);
    this.updateActiveAttacks(deltaTime);

    this.updateNewAttacks();
  }
}

CombatSystem.systemName = 'CombatSystem';
