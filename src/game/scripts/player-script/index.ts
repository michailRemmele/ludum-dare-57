import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
  ActorEvent,
  UpdateOptions,
} from 'dacha';
import {
  Script,
  Transform,
} from 'dacha';
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

import {
  SHOAL_1_ID,
  SHOAL_2_ID,
  SHOAL_3_ID,
  SHOAL_4_ID,
  SHOAL_5_ID,
  SHOAL_6_ID,
  SHOAL_7_ID,
  SHOAL_8_ID,
} from '../../../consts/templates';
import { CAMERA_SPEED } from '../../../consts/game';
import { INITIAL_FISH, MAIN_CAMERA_NAME } from '../../../consts/actors';
import {
  Team, Health, Movement, Shoal, LevelInfo, Score,
} from '../../components';
import * as EventType from '../../events';
import type { GameOverEvent } from '../../events';

const SHOAL_ORDER = [
  SHOAL_1_ID,
  SHOAL_2_ID,
  SHOAL_3_ID,
  SHOAL_4_ID,
  SHOAL_5_ID,
  SHOAL_6_ID,
  SHOAL_7_ID,
  SHOAL_8_ID,
];

export class PlayerScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private mainCamera: Actor;

  private shoalSize: number;
  private isGameOver: boolean;
  private shoalActors: Actor[];

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.mainCamera = this.scene.getEntityByName(MAIN_CAMERA_NAME)!;

    this.shoalSize = 1;
    this.isGameOver = false;

    const initialPiranha = this.scene.getEntityByName(INITIAL_FISH)!;

    this.shoalActors = [initialPiranha];

    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.addEventListener(EventType.FishDied, this.handleFishDied);
    this.scene.addEventListener(EventType.GameOver, this.handleGameOver);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.removeEventListener(EventType.FishDied, this.handleFishDied);
    this.scene.removeEventListener(EventType.GameOver, this.handleGameOver);
  }

  private handleGameOver = (event: GameOverEvent): void => {
    this.actor.removeComponent(Movement);

    if (event.isWin) {
      this.shoalActors.forEach((actor) => {
        actor.removeComponent(Movement);
        const health = actor.getComponent(Health);
        if (health) {
          health.immortal = true;
        }
      });
    }

    this.isGameOver = true;
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const team = actor.getComponent(Team);
    const health = actor.getComponent(Health);

    if (health && team?.index === 3) {
      team.index = 1;
      health.immortal = false;
      actor.dispatchEvent(EventType.UpdateShoalIndex, { index: this.shoalSize });
      this.shoalSize += 1;
      this.shoalActors.push(actor);
      this.updateShoal();
    }
  };

  private handleFishDied = (event: ActorEvent): void => {
    const { target } = event;

    this.shoalSize -= 1;
    this.shoalActors = this.shoalActors.filter((actor) => actor.id !== target.id);

    this.updateShoal();
  };

  private updateShoal(): void {
    if (this.shoalSize <= 0) {
      return;
    }

    const shoalActor = this.actor.children.find((child) => child.getComponent(Shoal));
    shoalActor?.remove();

    const newShoalActor = this.actorSpawner.spawn(SHOAL_ORDER[this.shoalSize - 1]);
    this.actor.appendChild(newShoalActor);

    this.shoalActors.forEach(((actor, index) => {
      actor.dispatchEvent(EventType.UpdateShoalIndex, { index });
    }));
  }

  private updatePlayer(deltaTime: number): void {
    const deltaTimeInSeconds = deltaTime / 1000;

    const playerTransform = this.actor.getComponent(Transform);
    playerTransform.offsetX += deltaTimeInSeconds * CAMERA_SPEED;
  }

  update(options: UpdateOptions): void {
    this.updatePlayer(options.deltaTime);

    if (this.isGameOver) {
      return;
    }

    if (this.shoalSize <= 0) {
      const levelInfo = this.mainCamera.getComponent(LevelInfo);
      const score = this.mainCamera.getComponent(Score);
      this.scene.dispatchEvent(EventType.GameOver, {
        isWin: false,
        levelIndex: levelInfo.index,
        score: score.value,
      });
    }
  }
}

PlayerScript.scriptName = 'PlayerScript';
