import type {
  Scene,
  BehaviorOptions,
  UpdateOptions,
} from 'dacha';
import {
  Actor,
  Behavior,
  Transform,
  MathOps,
} from 'dacha';
import { CollisionStay } from 'dacha/events';
import type { CollisionStayEvent } from 'dacha/events';

import { PLAYER_ACTOR_NAME } from '../../../consts/actors';
import { BUBBLE_ID } from '../../../consts/templates';
import { CAMERA_SPEED } from '../../../consts/game';
import {
  Team,
  Health,
  Movement,
  ShoalUnit,
  Shoal,
  Weapon,
  EnemyDetector,
  HitBox,
} from '../../components';
import * as EventType from '../../events';
import type {
  UpdateShoalIndexEvent,
  MovementEvent,
} from '../../events';

const IMMORTAL_DURATION = 500;

export class FishScript extends Behavior {
  private actor: Actor;
  private scene: Scene;

  private enemyDetector: Actor;
  private player: Actor;

  private shoalIndex: number;
  private shouldCatchUp: boolean;

  private immortalDuration: number;

  constructor(options: BehaviorOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.enemyDetector = this.actor.children.find((child) => child.getComponent(EnemyDetector))!;
    this.player = this.scene.findChildByName(PLAYER_ACTOR_NAME)!;

    const team = this.actor.getComponent(Team);
    const hitBoxActor = this.actor.children.find((child) => child.getComponent(HitBox))!;
    const hitBox = hitBoxActor.getComponent(HitBox);

    hitBox.disabled = team.index !== 1;

    this.shoalIndex = team.index === 1 ? 0 : -1;
    this.shouldCatchUp = false;

    if (team.index === 1) {
      const bubble = this.actor.children.find((child) => child.templateId === BUBBLE_ID);
      bubble?.remove();
    }

    this.immortalDuration = 0;

    this.actor.addEventListener(EventType.UpdateShoalIndex, this.handleUpdateShoalIndex);
    this.actor.addEventListener(EventType.Kill, this.handleKill);
    this.actor.addEventListener(EventType.Damage, this.handleDamage);
    this.actor.addEventListener(EventType.DamageDone, this.handleDamageDone);

    this.player.addEventListener(EventType.Movement, this.handlePlayerMovement);

    this.enemyDetector.addEventListener(CollisionStay, this.handleCollisionEnemyDetector);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.UpdateShoalIndex, this.handleUpdateShoalIndex);
    this.actor.removeEventListener(EventType.Kill, this.handleKill);
    this.actor.removeEventListener(EventType.Damage, this.handleDamage);
    this.actor.removeEventListener(EventType.DamageDone, this.handleDamageDone);

    this.player.removeEventListener(EventType.Movement, this.handlePlayerMovement);

    this.enemyDetector.removeEventListener(CollisionStay, this.handleCollisionEnemyDetector);
  }

  private handleDamage = (): void => {
    const health = this.actor.getComponent(Health);
    if (health.immortal) {
      return;
    }

    this.immortalDuration = IMMORTAL_DURATION;
  };

  private handleDamageDone = (): void => {
    this.actor.dispatchEvent(EventType.FishDamaged);
  };

  private handleCollisionEnemyDetector = (event: CollisionStayEvent): void => {
    if (this.shoalIndex === -1) {
      return;
    }

    const { actor } = event;

    const hitBox = actor.getComponent(HitBox);
    const team = actor.parent instanceof Actor ? actor.parent.getComponent(Team) : undefined;

    if (!hitBox || hitBox.disabled || team?.index !== 2) {
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
    this.actor.dispatchEvent(EventType.FishBite);
  };

  private handleUpdateShoalIndex = (event: UpdateShoalIndexEvent): void => {
    this.shoalIndex = event.index;
  };

  private handleKill = (): void => {
    if (this.shoalIndex === -1) {
      return;
    }

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

  private updateShield(deltaTime: number): void {
    const health = this.actor.getComponent(Health);
    if (this.immortalDuration > 0) {
      health.immortal = true;
      this.immortalDuration -= deltaTime;
    } else {
      health.immortal = false;
    }
  }

  private updateMovement(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    const transform = this.actor.getComponent(Transform);

    transform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;

    const movement = this.actor.getComponent(Movement);
    if (!movement) {
      return;
    }

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
      movement.speed = movement.maxSpeed * 1.25;
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
    this.updateShield(options.deltaTime);
  }
}

FishScript.behaviorName = 'FishScript';
