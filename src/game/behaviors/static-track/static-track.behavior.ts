import type {
  Actor,
  ActorSpawner,
  Scene,
  BehaviorOptions,
  ActorEvent,
} from 'dacha';
import {
  Behavior,
  Transform,
  Camera,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';
import { DefineBehavior } from 'dacha-workbench/decorators';

import Team from '../../components/team/team.component';
import Health from '../../components/health/health.component';
import Track from '../../components/track/track.component';
import TrackActivator from '../../components/track-activator/track-activator.component';
import * as EventType from '../../events';
import { MAIN_CAMERA_NAME } from '../../../consts/actors';
import { VIEWPORT_SIZE } from '../../../consts/game';

const ATTACK_BORDER_OFFSET = 8;

@DefineBehavior({
  name: 'StaticTrackBehavior',
})
export default class StaticTrackBehavior extends Behavior {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private mainCamera: Actor;

  private trackActivator: Actor;

  private mob: Actor | undefined;

  private mobId: string;
  private mobsLeft: number;
  private isSpawnStarted: boolean;
  private isWeaponUnlocked: boolean;

  constructor(options: BehaviorOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.mainCamera = this.scene.findChildByName(MAIN_CAMERA_NAME)!;

    const track = this.actor.getComponent(Track);
    this.trackActivator = this.actor.children.find((child) => child.getComponent(TrackActivator))!;

    this.mobId = track.mob;
    this.mobsLeft = 1;
    this.isSpawnStarted = false;
    this.isWeaponUnlocked = false;

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

  private handleMobKill = (event: ActorEvent): void => {
    if (this.mob && event.target.id === this.mob.id) {
      this.mob = undefined;
    }
  };

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
    this.mob = mob;

    this.mobsLeft -= 1;
  }

  private updateWeaponUnlock(): void {
    if (!this.mob || this.isWeaponUnlocked) {
      return;
    }

    const mobTransform = this.mob.getComponent(Transform);

    const cameraTransform = this.mainCamera.getComponent(Transform);
    const camera = this.mainCamera.getComponent(Camera);
    const zoom = Math.ceil(camera.windowSizeY / VIEWPORT_SIZE);

    const windowSizeX = camera.windowSizeX / zoom;

    const distance = Math.abs(cameraTransform.offsetX - mobTransform.offsetX);

    if (distance < (windowSizeX / 2 - ATTACK_BORDER_OFFSET)) {
      this.mob.dispatchEvent(EventType.UnlockWeapon);
      this.isWeaponUnlocked = true;
    }
  }

  update(): void {
    if (!this.isSpawnStarted) {
      return;
    }

    this.updateWeaponUnlock();
    this.updateSpawn();
  }
}
