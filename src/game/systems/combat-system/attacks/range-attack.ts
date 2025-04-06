import {
  Actor,
  MathOps,
  VectorOps,
  Transform,
  ColliderContainer,
  RigidBody,
} from 'dacha';
import type {
  ActorSpawner,
  Scene,
} from 'dacha';
import { CollisionEnter, AddImpulse } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import * as EventType from '../../../events';
import {
  Weapon,
  HitBox,
  Team,
} from '../../../components';
import type { RangeWeapon } from '../../../components/weapon/range-weapon';
import type { CircleCollider } from '../../../../types/collider';
import { findTeam } from '../utils/find-team';

import type { Attack } from './attack';

const HEAD_PLACEMENT_FIX = 0;

export class RangeAttack implements Attack {
  private actor: Actor;
  private spawner: ActorSpawner;
  private scene: Scene;
  private angle: number;

  private weapon: Weapon;
  private shot: Actor;
  private lifetime: number;

  isFinished: boolean;

  constructor(actor: Actor, spawner: ActorSpawner, scene: Scene, angle: number) {
    this.actor = actor;
    this.spawner = spawner;
    this.scene = scene;
    this.angle = angle;

    this.weapon = this.actor.getComponent(Weapon);

    const { offsetX, offsetY } = this.actor.getComponent(Transform);
    const {
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
    } = this.weapon.properties as RangeWeapon;

    const shot = this.spawner.spawn(projectileModel);
    const shotTransform = shot.getComponent(Transform);
    const shotCollider = shot.getComponent(ColliderContainer).collider as CircleCollider;

    shotCollider.radius = projectileRadius;

    shotTransform.offsetX = offsetX;
    shotTransform.offsetY = offsetY - HEAD_PLACEMENT_FIX;
    shotTransform.rotation = MathOps.radToDeg(this.angle);

    this.scene.appendChild(shot);

    const directionVector = VectorOps.getVectorByAngle(this.angle);

    directionVector.multiplyNumber(projectileSpeed);

    const flightTime = 1000 * (range / projectileSpeed);

    this.shot = shot;
    this.lifetime = flightTime;
    this.isFinished = false;

    this.shot.dispatchEvent(AddImpulse, { value: directionVector.clone() });

    this.shot.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  destroy(): void {
    this.shot.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const { damage } = this.weapon.properties;
    const team = this.actor.getComponent(Team);

    const hitBox = actor.getComponent(HitBox);
    const rigidBody = actor.getComponent(RigidBody);
    const targetTeam = findTeam(actor);
    const target = actor.parent;

    if (team && targetTeam && (team?.index === targetTeam?.index)) {
      return;
    }

    if (rigidBody && !rigidBody.isPermeable && !rigidBody.ghost) {
      this.lifetime = 0;
    }

    if (!hitBox || hitBox.disabled || !target || !(target instanceof Actor)) {
      return;
    }

    target.dispatchEvent(EventType.Damage, { value: damage, actor: this.actor });
    this.lifetime = 0;
  };

  update(deltaTime: number): void {
    if (this.isFinished) {
      return;
    }

    this.lifetime -= deltaTime;

    if (this.lifetime <= 0) {
      this.shot.dispatchEvent(EventType.Kill);
      this.isFinished = true;
    }
  }
}
