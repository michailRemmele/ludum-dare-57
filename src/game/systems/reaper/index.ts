import {
  Actor,
  System,
  Transform,
  Sprite,
  Light,
  Animatable,
  Camera,
} from 'dacha';
import type {
  SystemOptions,
  Scene,
  UpdateOptions,
  Component,
  ActorEvent,
} from 'dacha';

import * as EventType from '../../events';
import type { DamageEvent } from '../../events';
import { ViewDirection, Health } from '../../components';
import { Constructor } from '../../../types/utils';

type ComponentConstructor = Constructor<Component> & { componentName: string };

const GRAVEYARD_CLEAN_FREQUENCY = 1000;
const GRAVEYARD_ENTRIES_LIFETIME = 4000;
const ALLOWED_COMPONENTS = new Set<ComponentConstructor>([
  ViewDirection, Transform, Sprite, Light, Animatable, Camera,
]);

export class Reaper extends System {
  private scene: Scene;

  private graveyard: Array<{ actor: Actor; lifetime: number }>;
  private timeCounter: number;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    this.graveyard = [];
    this.timeCounter = 0;
  }

  mount(): void {
    this.scene.addEventListener(EventType.Kill, this.handleKill);
    this.scene.addEventListener(EventType.Damage, this.handleDamage);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.Kill, this.handleKill);
    this.scene.removeEventListener(EventType.Damage, this.handleDamage);
  }

  handleDamage = (event: DamageEvent): void => {
    const { target, value } = event;

    const health = target.getComponent(Health);
    if (!health) {
      return;
    }

    health.points -= Math.round(value);

    if (health.points <= 0) {
      health.points = 0;
      target.dispatchEvent(EventType.Kill);
    }
  };

  handleKill = (value: Actor | ActorEvent): void => {
    const actor = value instanceof Actor ? value : value.target;

    actor.getComponents().forEach((component) => {
      if (!ALLOWED_COMPONENTS.has(component.constructor as ComponentConstructor)) {
        actor.removeComponent(component.constructor as ComponentConstructor);
      }
    });

    this.graveyard.push({
      actor,
      lifetime: GRAVEYARD_ENTRIES_LIFETIME,
    });

    actor.children.forEach((child) => this.handleKill(child));
  };

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.timeCounter += deltaTime;
    if (this.timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this.graveyard = this.graveyard.filter((entry) => {
        entry.lifetime -= this.timeCounter;

        if (entry.lifetime <= 0) {
          entry.actor.remove();

          return false;
        }

        return true;
      });

      this.timeCounter = 0;
    }
  }
}

Reaper.systemName = 'Reaper';
