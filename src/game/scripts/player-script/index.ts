import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
  ActorEvent,
} from 'dacha';
import {
  Script,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import {
  SHOAL_1_ID,
  SHOAL_2_ID,
  SHOAL_3_ID,
  SHOAL_4_ID,
  SHOAL_5_ID,
  SHOAL_6_ID,
  SHOAL_7_ID,
  SHOAL_8_ID,
} from '../../../consts/templates';
import { INITIAL_FISH } from '../../../consts/actors';
import {
  Team, Health, Movement, Shoal,
} from '../../components';
import * as EventType from '../../events';

const SHOAL_ORDER = [
  SHOAL_1_ID,
  SHOAL_2_ID,
  SHOAL_3_ID,
  SHOAL_4_ID,
  SHOAL_5_ID,
  SHOAL_6_ID,
  SHOAL_7_ID,
  SHOAL_8_ID,
];

export class PlayerScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private shoalSize: number;
  private isGameOver: boolean;
  private shoalActors: Actor[];

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.shoalSize = 1;
    this.isGameOver = false;

    const initialPiranha = this.scene.getEntityByName(INITIAL_FISH)!;

    this.shoalActors = [initialPiranha];

    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.addEventListener(EventType.FishDied, this.handleFishDied);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.removeEventListener(EventType.FishDied, this.handleFishDied);
  }

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const team = actor.getComponent(Team);
    const health = actor.getComponent(Health);

    if (health && team?.index === 3) {
      team.index = 1;
      actor.dispatchEvent(EventType.UpdateShoalIndex, { index: this.shoalSize });
      this.shoalSize += 1;
      this.shoalActors.push(actor);
      this.updateShoal();
    }
  };

  private handleFishDied = (event: ActorEvent): void => {
    const { target } = event;

    this.shoalSize -= 1;
    this.shoalActors = this.shoalActors.filter((actor) => actor.id !== target.id);

    this.updateShoal();
  };

  private updateShoal(): void {
    if (this.shoalSize <= 0) {
      return;
    }

    const shoalActor = this.actor.children.find((child) => child.getComponent(Shoal));
    shoalActor?.remove();

    const newShoalActor = this.actorSpawner.spawn(SHOAL_ORDER[this.shoalSize - 1]);
    this.actor.appendChild(newShoalActor);

    this.shoalActors.forEach(((actor, index) => {
      actor.dispatchEvent(EventType.UpdateShoalIndex, { index });
    }));
  }

  update(): void {
    if (this.isGameOver) {
      return;
    }

    if (this.shoalSize <= 0) {
      this.scene.dispatchEvent(EventType.GameOver, { isWin: false });
      this.actor.removeComponent(Movement);

      this.isGameOver = true;
    }
  }
}

PlayerScript.scriptName = 'PlayerScript';
