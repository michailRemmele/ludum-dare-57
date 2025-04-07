import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
  UpdateOptions,
} from 'dacha';
import {
  Script,
  Transform,
  Camera,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import {
  Team,
  Health,
  Track,
  TrackActivator,
} from '../../components';
import * as EventType from '../../events';
import { MAIN_CAMERA_NAME } from '../../../consts/actors';
import { CAMERA_SPEED, VIEWPORT_SIZE } from '../../../consts/game';

const FLOAT_BORDER_OFFSET = 32;
const ATTACK_BORDER_OFFSET = 16;

export class FloatingTrackScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private mainCamera: Actor;

  private trackActivator: Actor;
  private mob: Actor | undefined;

  private patrolDistance: number;
  private currentDirection: number;

  private shouldWaitBeforeFloat: boolean;

  private mobId: string;
  private mobsLeft: number;
  private isSpawnStarted: boolean;
  private isWeaponUnlocked: boolean;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.mainCamera = this.scene.getEntityByName(MAIN_CAMERA_NAME)!;

    const track = this.actor.getComponent(Track);
    this.trackActivator = this.actor.children.find((child) => child.getComponent(TrackActivator))!;

    this.currentDirection = 1;

    this.shouldWaitBeforeFloat = true;

    this.patrolDistance = track.patrolDistance;
    this.mobId = track.mob;
    this.mobsLeft = 1;
    this.isSpawnStarted = false;
    this.isWeaponUnlocked = false;

    this.trackActivator.addEventListener(CollisionEnter, this.handleCollisionEnterTrackActivator);
    this.actor.addEventListener(EventType.Kill, this.handleMobKill);
  }

  destroy(): void {
    this.trackActivator.removeEventListener(
      CollisionEnter,
      this.handleCollisionEnterTrackActivator,
    );
    this.actor.removeEventListener(EventType.Kill, this.handleMobKill);
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

  private handleMobKill = (): void => {
    this.mob = undefined;
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
    this.mob = mob;

    this.mobsLeft -= 1;
  }

  private updateTrackMovement(deltaTime: number): void {
    if (!this.mob || this.shouldWaitBeforeFloat) {
      return;
    }

    const deltaTimeInSeconds = deltaTime / 1000;

    const spawnerTransform = this.actor.getComponent(Transform);
    const mobTransform = this.mob.getComponent(Transform);

    const distance = spawnerTransform.offsetY - mobTransform.offsetY;

    if (this.currentDirection < 0 && distance > this.patrolDistance) {
      this.currentDirection *= -1;
    }
    if (this.currentDirection > 0 && distance < 0 && Math.abs(distance) > this.patrolDistance) {
      this.currentDirection *= -1;
    }

    mobTransform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;
    this.mob.dispatchEvent(EventType.Movement, { angle: 90 * this.currentDirection });
  }

  private updateStandingPosition(): void {
    if (!this.mob || !this.shouldWaitBeforeFloat) {
      return;
    }

    const mobTransform = this.mob.getComponent(Transform);

    const cameraTransform = this.mainCamera.getComponent(Transform);
    const camera = this.mainCamera.getComponent(Camera);
    const zoom = Math.ceil(camera.windowSizeY / VIEWPORT_SIZE);

    const windowSizeX = camera.windowSizeX / zoom;

    const distance = Math.abs(cameraTransform.offsetX - mobTransform.offsetX);

    if (!this.isWeaponUnlocked && distance < (windowSizeX / 2 - ATTACK_BORDER_OFFSET)) {
      this.mob.dispatchEvent(EventType.UnlockWeapon);
      this.isWeaponUnlocked = true;
    }
    if (distance < (windowSizeX / 2 - FLOAT_BORDER_OFFSET)) {
      this.shouldWaitBeforeFloat = false;
    }
  }

  update(options: UpdateOptions): void {
    if (!this.isSpawnStarted) {
      return;
    }

    this.updateStandingPosition();
    this.updateTrackMovement(options.deltaTime);
    this.updateSpawn();
  }
}

FloatingTrackScript.scriptName = 'FloatingTrackScript';
