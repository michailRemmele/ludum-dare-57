import type {
  Scene,
  BehaviorOptions,
  UpdateOptions,
} from 'dacha';
import {
  Actor,
  Behavior,
  Camera,
  Transform,
  Sprite,
  ColliderContainer,
} from 'dacha';
import { CollisionStay, CollisionEnter } from 'dacha/events';
import type { CollisionStayEvent, CollisionEnterEvent } from 'dacha/events';

import * as EventType from '../../events';
import type { IncreaseScorePointsEvent, GameOverEvent } from '../../events';
import {
  CAMERA_SPEED,
  VIEWPORT_SIZE,
  LEVEL_UP_BASE_STEP,
  MAX_LEVEL,
} from '../../../consts/game';
import { FINISH_ZONE_NAME } from '../../../consts/templates';
import type { BoxCollider } from '../../../types/collider';
import {
  Health,
  Team,
  HitBox,
  LevelInfo,
  Score,
} from '../../components';

const BORDER_DAMAGE = 1;
const FINISH_ZONE_DISTANCE_THRESHOLD = 32;

const LEFT_BORDER_NAME = 'LeftBorder';
const RIGHT_BORDER_NAME = 'RightBorder';
const TOP_BORDER_NAME = 'TopBorder';
const BOTTOM_BORDER_NAME = 'BottomBorder';
const DEAD_ZONE = 'DeadZone';
const ULTIMATE_DEAD_ZONE = 'UltimateDeadZone';

export class CameraScript extends Behavior {
  private actor: Actor;
  private scene: Scene;

  private leftBorder: Actor;
  private rightBorder: Actor;
  private topBorder: Actor;
  private bottomBorder: Actor;

  private ultimateDeadZone: Actor;

  private finishZone: Actor;

  private playerLevel: number;
  private nextLevelScore: number;

  private isGameOver: boolean;

  constructor(options: BehaviorOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.leftBorder = this.scene.findChildByName(LEFT_BORDER_NAME)!;
    this.rightBorder = this.scene.findChildByName(RIGHT_BORDER_NAME)!;
    this.topBorder = this.scene.findChildByName(TOP_BORDER_NAME)!;
    this.bottomBorder = this.scene.findChildByName(BOTTOM_BORDER_NAME)!;

    this.ultimateDeadZone = this.leftBorder.findChildByName(ULTIMATE_DEAD_ZONE)!;

    this.finishZone = this.scene.findChildByName(FINISH_ZONE_NAME)!;

    this.playerLevel = 1;
    this.nextLevelScore = LEVEL_UP_BASE_STEP;

    this.isGameOver = false;

    this.leftBorder.addEventListener(CollisionStay, this.handleCollisionStay);
    this.rightBorder.addEventListener(CollisionStay, this.handleCollisionStay);
    this.topBorder.addEventListener(CollisionStay, this.handleCollisionStay);
    this.bottomBorder.addEventListener(CollisionStay, this.handleCollisionStay);

    [this.leftBorder, this.rightBorder, this.topBorder, this.bottomBorder].forEach((actor) => {
      const deadZone = actor.findChildByName(DEAD_ZONE);
      deadZone?.addEventListener(CollisionEnter, this.handleCollisionEnterDeadZone);
    });

    this.ultimateDeadZone.addEventListener(
      CollisionEnter,
      this.handleCollisionEnterUltimateDeadZone,
    );

    this.scene.addEventListener(EventType.GameOver, this.handleGameOver);
    this.scene.addEventListener(EventType.IncreaseScorePoints, this.handleIncreaseScorePoints);
  }

  destroy(): void {
    this.leftBorder.removeEventListener(CollisionStay, this.handleCollisionStay);
    this.rightBorder.removeEventListener(CollisionStay, this.handleCollisionStay);
    this.topBorder.removeEventListener(CollisionStay, this.handleCollisionStay);
    this.bottomBorder.removeEventListener(CollisionStay, this.handleCollisionStay);

    [this.leftBorder, this.rightBorder, this.topBorder, this.bottomBorder].forEach((actor) => {
      const deadZone = actor.findChildByName(DEAD_ZONE);
      deadZone?.removeEventListener(CollisionEnter, this.handleCollisionEnterDeadZone);
    });

    this.ultimateDeadZone.removeEventListener(
      CollisionEnter,
      this.handleCollisionEnterUltimateDeadZone,
    );

    this.scene.removeEventListener(EventType.GameOver, this.handleGameOver);
    this.scene.removeEventListener(EventType.IncreaseScorePoints, this.handleIncreaseScorePoints);
  }

  private handleIncreaseScorePoints = (event: IncreaseScorePointsEvent): void => {
    const score = this.actor.getComponent(Score);

    score.value += event.points;

    if (this.playerLevel < MAX_LEVEL && score.value >= this.nextLevelScore) {
      this.playerLevel += 1;
      this.nextLevelScore += this.playerLevel * LEVEL_UP_BASE_STEP;

      this.scene.dispatchEvent(EventType.LevelUp, {
        level: this.playerLevel,
        nextLevelScore: this.nextLevelScore,
        isMax: this.playerLevel === MAX_LEVEL,
      });
    }
  };

  private handleGameOver = (event: GameOverEvent): void => {
    const { isWin, levelIndex, score } = event;

    this.scene.dispatchEvent(EventType.SendAnalytics, {
      name: 'game_over',
      payload: {
        isWin,
        levelIndex,
        score,
      },
    });

    this.isGameOver = true;
  };

  private handleCollisionEnterUltimateDeadZone = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const hitBox = actor.getComponent(HitBox);
    const parent = actor.parent instanceof Actor ? actor.parent : undefined;
    const health = parent?.getComponent(Health);

    if (!parent || !hitBox || hitBox.disabled || !health) {
      return;
    }

    parent.dispatchEvent(EventType.Kill);
  };

  private handleCollisionStay = (event: CollisionStayEvent): void => {
    const { actor } = event;
    const health = actor.getComponent(Health);
    const team = actor.getComponent(Team);

    if (health && team?.index === 1) {
      actor.dispatchEvent(EventType.Damage, { value: BORDER_DAMAGE });
    }
  };

  private handleCollisionEnterDeadZone = (event: CollisionEnterEvent): void => {
    const { actor } = event;
    const health = actor.getComponent(Health);
    const team = actor.getComponent(Team);

    if (health && team?.index === 1) {
      actor.dispatchEvent(EventType.Kill);
    }
  };

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = Math.ceil(camera.windowSizeY / VIEWPORT_SIZE);
  }

  private updateCamera(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    const transform = this.actor.getComponent(Transform);

    transform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;
  }

  private updateBorders(): void {
    const camera = this.actor.getComponent(Camera);
    const zoom = Math.ceil(camera.windowSizeY / VIEWPORT_SIZE);

    const windowSizeY = camera.windowSizeY / zoom;
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

  private updateLevelCompletion(): void {
    const finishZoneTransform = this.finishZone.getComponent(Transform);
    const cameraTransform = this.actor.getComponent(Transform);
    const levelInfo = this.actor.getComponent(LevelInfo);
    const score = this.actor.getComponent(Score);

    const distance = Math.abs(cameraTransform.offsetX - finishZoneTransform.offsetX);

    if (distance < FINISH_ZONE_DISTANCE_THRESHOLD) {
      this.scene.dispatchEvent(EventType.GameOver, {
        isWin: true,
        levelIndex: levelInfo.index,
        score: score.value,
      });
    }
  }

  update(options: UpdateOptions): void {
    this.updateZoom();

    if (this.isGameOver) {
      return;
    }

    this.updateCamera(options.deltaTime);
    this.updateBorders();
    this.updateLevelCompletion();
  }
}

CameraScript.behaviorName = 'CameraScript';
