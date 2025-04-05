import type {
  Actor,
  Scene,
  ScriptOptions,
  UpdateOptions,
} from 'dacha';
import {
  Script,
  Camera,
  Transform,
  Sprite,
  ColliderContainer,
} from 'dacha';
import { CollisionStay, CollisionEnter } from 'dacha/events';
import type { CollisionStayEvent, CollisionEnterEvent } from 'dacha/events';

import * as EventType from '../../events';
import { PLAYER_ACTOR_NAME } from '../../../consts/actors';
import { CAMERA_SPEED } from '../../../consts/game';
import type { BoxCollider } from '../../../types/collider';
import { Health, Team } from '../../components';

const VIEWPORT_SIZE = 160;

const BORDER_DAMAGE = 1;
const BORDER_DAMAGE_COOLDOWN = 500;

const LEFT_BORDER_NAME = 'LeftBorder';
const RIGHT_BORDER_NAME = 'RightBorder';
const TOP_BORDER_NAME = 'TopBorder';
const BOTTOM_BORDER_NAME = 'BottomBorder';
const DEAD_ZONE = 'DeadZone';

export class CameraScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private leftBorder: Actor;
  private rightBorder: Actor;
  private topBorder: Actor;
  private bottomBorder: Actor;

  private player: Actor;

  private damageCooldown: number;
  private isGameOver: boolean;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.leftBorder = this.scene.getEntityByName(LEFT_BORDER_NAME)!;
    this.rightBorder = this.scene.getEntityByName(RIGHT_BORDER_NAME)!;
    this.topBorder = this.scene.getEntityByName(TOP_BORDER_NAME)!;
    this.bottomBorder = this.scene.getEntityByName(BOTTOM_BORDER_NAME)!;

    this.player = this.scene.getEntityByName(PLAYER_ACTOR_NAME)!;

    this.damageCooldown = 0;
    this.isGameOver = false;

    this.leftBorder.addEventListener(CollisionStay, this.handleCollisionStay);
    this.rightBorder.addEventListener(CollisionStay, this.handleCollisionStay);
    this.topBorder.addEventListener(CollisionStay, this.handleCollisionStay);
    this.bottomBorder.addEventListener(CollisionStay, this.handleCollisionStay);

    [this.leftBorder, this.rightBorder, this.topBorder, this.bottomBorder].forEach((actor) => {
      const deadZone = actor.getEntityByName(DEAD_ZONE);
      deadZone?.addEventListener(CollisionEnter, this.handleCollisionEnterDeadZone);
    });

    this.scene.addEventListener(EventType.GameOver, this.handleGameOver);
  }

  destroy(): void {
    this.leftBorder.removeEventListener(CollisionStay, this.handleCollisionStay);
    this.rightBorder.removeEventListener(CollisionStay, this.handleCollisionStay);
    this.topBorder.removeEventListener(CollisionStay, this.handleCollisionStay);
    this.bottomBorder.removeEventListener(CollisionStay, this.handleCollisionStay);

    [this.leftBorder, this.rightBorder, this.topBorder, this.bottomBorder].forEach((actor) => {
      const deadZone = actor.getEntityByName(DEAD_ZONE);
      deadZone?.removeEventListener(CollisionEnter, this.handleCollisionEnterDeadZone);
    });

    this.scene.removeEventListener(EventType.GameOver, this.handleGameOver);
  }

  private handleGameOver = (): void => {
    this.isGameOver = true;
  };

  private handleCollisionStay = (event: CollisionStayEvent): void => {
    if (this.damageCooldown > 0) {
      return;
    }

    const { actor } = event;
    const health = actor.getComponent(Health);
    const team = actor.getComponent(Team);

    if (health && team?.index === 1) {
      actor.dispatchEvent(EventType.Damage, { value: BORDER_DAMAGE });
      this.damageCooldown = BORDER_DAMAGE_COOLDOWN;
    }
  };

  private handleCollisionEnterDeadZone = (event: CollisionEnterEvent): void => {
    const { actor } = event;
    const health = actor.getComponent(Health);
    const team = actor.getComponent(Team);

    if (health && team?.index === 1) {
      actor.dispatchEvent(EventType.Damage, { value: Infinity });
    }
  };

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = Math.round(camera.windowSizeY / VIEWPORT_SIZE);
  }

  private updateCamera(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    const transform = this.actor.getComponent(Transform);

    transform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;
  }

  private updateBorders(): void {
    const camera = this.actor.getComponent(Camera);
    const zoom = Math.round(camera.windowSizeY / VIEWPORT_SIZE);

    const windowSizeY = VIEWPORT_SIZE;
    const windowSizeX = camera.windowSizeX / zoom;

    const leftTransform = this.leftBorder.getComponent(Transform);
    const rightTransform = this.rightBorder.getComponent(Transform);
    const topTransform = this.topBorder.getComponent(Transform);
    const bottomTransform = this.bottomBorder.getComponent(Transform);

    const leftCollider = this.leftBorder.getComponent(ColliderContainer).collider as BoxCollider;
    const rightCollider = this.rightBorder.getComponent(ColliderContainer).collider as BoxCollider;
    const topCollider = this.topBorder.getComponent(ColliderContainer).collider as BoxCollider;
    const bottomCollider = this.bottomBorder.getComponent(
      ColliderContainer,
    ).collider as BoxCollider;

    leftTransform.relativeOffsetX = -windowSizeX / 2 - leftCollider.sizeX / 2;
    rightTransform.relativeOffsetX = windowSizeX / 2 + rightCollider.sizeX / 2;
    topTransform.relativeOffsetY = -windowSizeY / 2 - topCollider.sizeY / 2;
    bottomTransform.relativeOffsetY = windowSizeY / 2 + bottomCollider.sizeY / 2;

    leftCollider.sizeY = windowSizeY;
    rightCollider.sizeY = windowSizeY;
    topCollider.sizeX = windowSizeX;
    bottomCollider.sizeX = windowSizeX;

    const leftSprite = this.leftBorder.getComponent(Sprite);
    const rightSprite = this.rightBorder.getComponent(Sprite);
    const topSprite = this.topBorder.getComponent(Sprite);
    const bottomSprite = this.bottomBorder.getComponent(Sprite);

    leftSprite.height = windowSizeY;
    rightSprite.height = windowSizeY;
    topSprite.width = windowSizeX;
    bottomSprite.width = windowSizeX;
  }

  private updatePlayer(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    const playerTransform = this.player.getComponent(Transform);
    playerTransform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;
  }

  update(options: UpdateOptions): void {
    this.updateZoom();

    if (this.isGameOver) {
      return;
    }

    this.updateCamera(options.deltaTime);
    this.updateBorders();
    this.updatePlayer(options.deltaTime);

    if (this.damageCooldown > 0) {
      this.damageCooldown -= options.deltaTime;
    }
  }
}

CameraScript.scriptName = 'CameraScript';
