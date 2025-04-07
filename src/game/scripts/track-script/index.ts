import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
  UpdateOptions,
  ActorEvent,
} from 'dacha';
import {
  Script,
  Transform,
  MathOps,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import {
  Team,
  Health,
  Track,
  TrackActivator,
  TrackSegment,
  Weapon,
} from '../../components';
import * as EventType from '../../events';

const DESTINATION_THRESOLD = 4;

export class TrackScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private trackActivator: Actor;
  private trackSegments: Actor[];
  private mobs: Actor[];

  private mobDestinations: Record<string, number>;
  private mobWeaponsState: Record<string, boolean>;

  private spawnFrequency: number;
  private mobId: string;
  private mobsAmount: number;
  private mobsLeft: number;
  private isSpawnStarted: boolean;
  private spawnCooldown: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    const track = this.actor.getComponent(Track);
    this.trackActivator = this.actor.children.find((child) => child.getComponent(TrackActivator))!;
    this.trackSegments = this.actor.children.filter((child) => child.getComponent(TrackSegment));

    this.trackSegments.sort((a: Actor, b: Actor) => {
      const aTrackSegment = a.getComponent(TrackSegment);
      const bTrackSegment = b.getComponent(TrackSegment);

      return aTrackSegment.index - bTrackSegment.index;
    });

    this.mobs = [];
    this.mobDestinations = {};
    this.mobWeaponsState = {};

    this.mobId = track.mob;
    this.spawnFrequency = track.frequency;
    this.mobsAmount = track.amount;
    this.mobsLeft = this.mobsAmount;
    this.isSpawnStarted = false;
    this.spawnCooldown = 0;

    this.trackActivator.addEventListener(CollisionEnter, this.handleCollisionEnterTrackActivator);
    this.scene.addEventListener(EventType.Kill, this.handleMobKill);
  }

  destroy(): void {
    this.trackActivator.removeEventListener(
      CollisionEnter,
      this.handleCollisionEnterTrackActivator,
    );
    this.scene.removeEventListener(EventType.Kill, this.handleMobKill);
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

  private handleMobKill = (event: ActorEvent): void => {
    const { target } = event;

    if (!this.mobs.length) {
      return;
    }

    this.mobs = this.mobs.filter((mob) => mob.id !== target.id);
    delete this.mobDestinations[target.id];
    delete this.mobWeaponsState[target.id];
  };

  private updateSpawn(deltaTime: number): void {
    if (this.mobsLeft === 0) {
      return;
    }
    if (this.spawnCooldown > 0) {
      this.spawnCooldown -= deltaTime;
      return;
    }

    const mob = this.actorSpawner.spawn(this.mobId);

    const spawnerTransform = this.actor.getComponent(Transform);
    const mobTransform = mob.getComponent(Transform);

    mobTransform.offsetX = spawnerTransform.offsetX;
    mobTransform.offsetY = spawnerTransform.offsetY;

    this.scene.appendChild(mob);

    this.mobs.push(mob);

    this.spawnCooldown = this.spawnFrequency;
    this.mobsLeft -= 1;
  }

  private updateTrackMovement(): void {
    this.mobs.forEach((actor) => {
      const transform = actor.getComponent(Transform);

      const intersectedSegmentIndex = this.trackSegments.findIndex(
        (segment) => {
          const segmentTransform = segment.getComponent(Transform);
          const distance = MathOps.getDistanceBetweenTwoPoints(
            transform.offsetX,
            segmentTransform.offsetX,
            transform.offsetY,
            segmentTransform.offsetY,
          );

          return distance < DESTINATION_THRESOLD;
        },
      );

      let nextSegmentIndex: number;
      if (!this.mobDestinations[actor.id]) {
        nextSegmentIndex = 0;
      } else if (intersectedSegmentIndex !== -1) {
        nextSegmentIndex = intersectedSegmentIndex + 1;
      } else {
        nextSegmentIndex = intersectedSegmentIndex;
      }

      if (nextSegmentIndex !== -1 && this.trackSegments[nextSegmentIndex]) {
        const nextSegment = this.trackSegments[nextSegmentIndex];

        const { offsetX, offsetY } = actor.getComponent(Transform);
        const { offsetX: destX, offsetY: destY } = nextSegment.getComponent(Transform);

        const angle = MathOps.radToDeg(
          MathOps.getAngleBetweenTwoPoints(
            offsetX,
            destX,
            offsetY,
            destY,
          ),
        ) - 180;

        this.mobDestinations[actor.id] = angle;
        actor.dispatchEvent(EventType.Movement, { angle });

        return;
      }

      const angle = this.mobDestinations[actor.id];
      if (angle !== undefined) {
        actor.dispatchEvent(EventType.Movement, { angle });
      }
    });
  }

  private updateWeaponUnlock(): void {
    this.mobs.forEach((mob) => {
      if (!mob.getComponent(Weapon) || this.mobWeaponsState[mob.id]) {
        return;
      }

      mob.dispatchEvent(EventType.UnlockWeapon);
      this.mobWeaponsState[mob.id] = true;
    });
  }

  update(options: UpdateOptions): void {
    if (!this.isSpawnStarted) {
      return;
    }

    this.updateWeaponUnlock();
    this.updateTrackMovement();
    this.updateSpawn(options.deltaTime);
  }
}

TrackScript.scriptName = 'TrackScript';
