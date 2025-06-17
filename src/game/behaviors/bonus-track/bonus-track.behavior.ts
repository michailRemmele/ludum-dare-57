import type {
  Actor,
  ActorSpawner,
  Scene,
  BehaviorOptions,
  UpdateOptions,
  ActorEvent,
} from 'dacha';
import {
  Behavior,
  Transform,
} from 'dacha';
import { DefineBehavior } from 'dacha-workbench/decorators';

import Track from '../../components/track/track.component';
import * as EventType from '../../events';
import type { UpdateShoalIndexEvent } from '../../events';

const PATROL_SPEED = 10;

interface MobState {
  direction: number
}

@DefineBehavior({
  name: 'BonusTrackBehavior',
})
export default class BonusTrackBehavior extends Behavior {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private mobs: Actor[];

  private patrolDistance: number;
  private stateMap: Record<string, MobState>;

  private mobId: string;
  private mobsLeft: number;

  constructor(options: BehaviorOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    const track = this.actor.getComponent(Track);

    this.mobs = [];
    this.stateMap = {};

    this.patrolDistance = track.patrolDistance;
    this.mobId = track.mob;
    this.mobsLeft = 0;

    this.scene.addEventListener(EventType.LevelUp, this.handleLevelUp);
    this.scene.addEventListener(EventType.Kill, this.handleMobKill);
    this.scene.addEventListener(EventType.UpdateShoalIndex, this.handleUpdateShoalIndex);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.LevelUp, this.handleLevelUp);
    this.scene.removeEventListener(EventType.Kill, this.handleMobKill);
    this.scene.removeEventListener(EventType.UpdateShoalIndex, this.handleUpdateShoalIndex);
  }

  private handleLevelUp = (): void => {
    this.mobsLeft += 1;
  };

  private handleUpdateShoalIndex = (event: UpdateShoalIndexEvent): void => {
    const { target } = event;

    this.mobs = this.mobs.filter((mob) => mob.id !== target.id);
    delete this.stateMap[target.id];
  };

  private handleMobKill = (event: ActorEvent): void => {
    const { target } = event;

    this.mobs = this.mobs.filter((mob) => mob.id !== target.id);
    delete this.stateMap[target.id];
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
    this.mobs.push(mob);
    this.stateMap[mob.id] = { direction: 1 };

    this.mobsLeft -= 1;
  }

  private updateTrackMovement(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    this.mobs.forEach((mob) => {
      const mobState = this.stateMap[mob.id];

      const spawnerTransform = this.actor.getComponent(Transform);
      const mobTransform = mob.getComponent(Transform);

      const distance = spawnerTransform.offsetY - mobTransform.offsetY;

      if (mobState.direction < 0 && distance > this.patrolDistance) {
        mobState.direction *= -1;
      }
      if (mobState.direction > 0 && distance < 0 && Math.abs(distance) > this.patrolDistance) {
        mobState.direction *= -1;
      }

      mobTransform.offsetY += PATROL_SPEED * deltaTimeInSeconds * mobState.direction;
    });
  }

  update(options: UpdateOptions): void {
    this.updateSpawn();
    this.updateTrackMovement(options.deltaTime);
  }
}
