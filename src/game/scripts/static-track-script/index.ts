import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
} from 'dacha';
import {
  Script,
  Transform,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import {
  Team,
  Health,
  Track,
  TrackActivator,
} from '../../components';

export class StaticTrackScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private trackActivator: Actor;

  private mobId: string;
  private mobsLeft: number;
  private isSpawnStarted: boolean;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    const track = this.actor.getComponent(Track);
    this.trackActivator = this.actor.children.find((child) => child.getComponent(TrackActivator))!;

    this.mobId = track.mob;
    this.mobsLeft = 1;
    this.isSpawnStarted = false;

    this.trackActivator.addEventListener(CollisionEnter, this.handleCollisionEnterTrackActivator);
  }

  destroy(): void {
    this.trackActivator.removeEventListener(
      CollisionEnter,
      this.handleCollisionEnterTrackActivator,
    );
  }

  private handleCollisionEnterTrackActivator = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const team = actor.getComponent(Team);
    const health = actor.getComponent(Health);

    if (!health || team?.index !== 1) {
      return;
    }

    this.isSpawnStarted = true;
  };

  private updateSpawn(): void {
    if (this.mobsLeft === 0) {
      return;
    }

    const mob = this.actorSpawner.spawn(this.mobId);

    const spawnerTransform = this.actor.getComponent(Transform);
    const mobTransform = mob.getComponent(Transform);

    mobTransform.offsetX = spawnerTransform.offsetX;
    mobTransform.offsetY = spawnerTransform.offsetY;

    this.scene.appendChild(mob);

    this.mobsLeft -= 1;
  }

  update(): void {
    if (!this.isSpawnStarted) {
      return;
    }

    this.updateSpawn();
  }
}

StaticTrackScript.scriptName = 'StaticTrackScript';
