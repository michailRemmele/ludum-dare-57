import {
  Actor,
  MathOps,
  Transform,
  ColliderContainer,
} from 'dacha';
import type {
  ActorSpawner,
  Scene,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import * as EventType from '../../../events';
import {
  Weapon,
  HitBox,
  Team,
} from '../../../components';
import type { BoxCollider, CircleCollider } from '../../../../types/collider';
import { findTeam } from '../utils/find-team';
import { MELEE_HIT_ID } from '../../../../consts/templates';

import type { Attack } from './attack';

const HIT_LIFETIME = 100;

const getHitOffset = (actor: Actor): number => {
  const collider = actor.getComponent(ColliderContainer).collider as BoxCollider & CircleCollider;

  return collider.radius !== undefined
    ? collider.radius
    : Math.min(collider.sizeX, collider.sizeX) / 2;
};

export class MeleeAttack implements Attack {
  private actor: Actor;
  private spawner: ActorSpawner;
  private scene: Scene;
  private angle: number;

  private weapon: Weapon;
  private hit: Actor;
  private lifetime: number;

  isFinished: boolean;

  constructor(actor: Actor, spawner: ActorSpawner, scene: Scene, angle: number) {
    this.actor = actor;
    this.spawner = spawner;
    this.scene = scene;
    this.angle = angle;

    this.weapon = this.actor.getComponent(Weapon);

    const { offsetX, offsetY } = this.actor.getComponent(Transform);
    const { range } = this.weapon.properties;

    const degAngle = MathOps.radToDeg(this.angle);

    const hit = this.spawner.spawn(MELEE_HIT_ID);
    const hitTransform = hit.getComponent(Transform);
    const hitCollider = hit.getComponent(ColliderContainer).collider as CircleCollider;

    hitCollider.radius = range;

    const hitCenter = MathOps.getLinePoint(
      degAngle + 180,
      offsetX,
      offsetY,
      getHitOffset(this.actor),
    );

    hitTransform.offsetX = hitCenter.x;
    hitTransform.offsetY = hitCenter.y;

    this.scene.appendChild(hit);

    this.hit = hit;
    this.lifetime = HIT_LIFETIME;
    this.isFinished = false;

    this.hit.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  destroy(): void {
    this.hit.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const { damage } = this.weapon.properties;
    const team = this.actor.getComponent(Team);

    const hitBox = actor.getComponent(HitBox);
    const targetTeam = findTeam(actor);
    const target = actor.parent;

    if (team && targetTeam && (team?.index === targetTeam?.index)) {
      return;
    }

    if (!hitBox || hitBox.disabled || !target || !(target instanceof Actor)) {
      return;
    }

    target.dispatchEvent(EventType.Damage, { value: damage, actor: this.actor });
  };

  update(deltaTime: number): void {
    if (this.isFinished) {
      return;
    }

    this.lifetime -= deltaTime;

    if (this.lifetime <= 0) {
      this.hit.remove();
      this.isFinished = true;
    }
  }
}
