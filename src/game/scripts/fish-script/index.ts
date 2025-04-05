import type {
  Actor,
  Scene,
  ScriptOptions,
  UpdateOptions,
} from 'dacha';
import {
  Script,
  Transform,
  MathOps,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import { PLAYER_ACTOR_NAME } from '../../../consts/actors';
import { CAMERA_SPEED } from '../../../consts/game';
import {
  Team,
  Health,
  Movement,
  ShoalUnit,
  Shoal,
  Weapon,
  EnemyDetector,
} from '../../components';
import * as EventType from '../../events';
import type { UpdateShoalIndexEvent, MovementEvent } from '../../events';

export class FishScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private enemyDetector: Actor;
  private player: Actor;

  private shoalIndex: number;
  private shouldCatchUp: boolean;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.enemyDetector = this.actor.children.find((child) => child.getComponent(EnemyDetector))!;
    this.player = this.scene.getEntityByName(PLAYER_ACTOR_NAME)!;

    this.shoalIndex = 0;
    this.shouldCatchUp = false;

    this.actor.addEventListener(EventType.UpdateShoalIndex, this.handleUpdateShoalIndex);
    this.actor.addEventListener(EventType.Kill, this.handleKill);

    this.player.addEventListener(EventType.Movement, this.handlePlayerMovement);

    this.enemyDetector.addEventListener(CollisionEnter, this.handleCollisionEnterEnemyDetector);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.UpdateShoalIndex, this.handleUpdateShoalIndex);
    this.actor.removeEventListener(EventType.Kill, this.handleKill);

    this.player.removeEventListener(EventType.Movement, this.handlePlayerMovement);

    this.enemyDetector.removeEventListener(CollisionEnter, this.handleCollisionEnterEnemyDetector);
  }

  private handleCollisionEnterEnemyDetector = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const team = actor.getComponent(Team);
    const health = actor.getComponent(Health);

    if (!health || team?.index !== 2) {
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

  private handleUpdateShoalIndex = (event: UpdateShoalIndexEvent): void => {
    this.shoalIndex = event.index;
  };

  private handleKill = (): void => {
    this.actor.dispatchEvent(EventType.FishDied);
  };

  private handlePlayerMovement = (event: MovementEvent): void => {
    if (this.shouldCatchUp) {
      return;
    }

    const team = this.actor.getComponent(Team);
    const health = this.actor.getComponent(Health);

    if (!health || team.index !== 1) {
      return;
    }

    this.actor.dispatchEvent(EventType.Movement, {
      x: event.x,
      y: event.y,
      angle: event.angle,
    });
  };

  private updateMovement(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    const movement = this.actor.getComponent(Movement);
    const transform = this.actor.getComponent(Transform);

    transform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;

    const shoalActor = this.player.children.find((child) => child.getComponent(Shoal));
    const shoalUnitActor = shoalActor?.children.find((child) => {
      const shoalUnit = child.getComponent(ShoalUnit);
      return shoalUnit.index === this.shoalIndex;
    });
    const shoalUnitTransform = shoalUnitActor?.getComponent(Transform);

    if (!shoalUnitTransform) {
      return;
    }

    const distance = MathOps.getDistanceBetweenTwoPoints(
      transform.offsetX,
      shoalUnitTransform.offsetX,
      transform.offsetY,
      shoalUnitTransform.offsetY,
    );
    const angle = MathOps.radToDeg(
      MathOps.getAngleBetweenTwoPoints(
        transform.offsetX,
        shoalUnitTransform.offsetX,
        transform.offsetY,
        shoalUnitTransform.offsetY,
      ),
    ) - 180;

    this.shouldCatchUp = distance > 2;

    if (this.shouldCatchUp) {
      movement.speed = movement.maxSpeed * 1.5;
      this.actor.dispatchEvent(EventType.Movement, { angle });
    } else {
      movement.speed = movement.maxSpeed;
    }
  }

  update(options: UpdateOptions): void {
    const team = this.actor.getComponent(Team);
    const health = this.actor.getComponent(Health);

    if (!health || team.index !== 1) {
      return;
    }

    this.updateMovement(options.deltaTime);
  }
}

FishScript.scriptName = 'FishScript';
