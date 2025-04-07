import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'dacha';
import { Script } from 'dacha';
import { PlayAudio, StopAudio } from 'dacha/events';

import * as EventType from '../../events';
import type { GameOverEvent } from '../../events';

interface AudioManagerScriptOptions extends ScriptOptions {
  backgroundMusic: string
  levelUp: string
  powerUp: string
  fishDamage: string
  fishDeath: string
  fishBite: string
  enemyShoot: string
  win: string
  lose: string
}

export class AudioManagerScript extends Script {
  private scene: Scene;

  private backgroundMusic: Actor;
  private levelUp: Actor;
  private powerUp: Actor;
  private fishDamage: Actor;
  private fishDeath: Actor;
  private fishBite: Actor;
  private enemyShoot: Actor;
  private win: Actor;
  private lose: Actor;

  constructor(options: AudioManagerScriptOptions) {
    super();

    this.scene = options.scene;

    this.backgroundMusic = this.scene.getEntityById(options.backgroundMusic)!;
    this.levelUp = this.scene.getEntityById(options.levelUp)!;
    this.powerUp = this.scene.getEntityById(options.powerUp)!;
    this.fishDamage = this.scene.getEntityById(options.fishDamage)!;
    this.fishDeath = this.scene.getEntityById(options.fishDeath)!;
    this.fishBite = this.scene.getEntityById(options.fishBite)!;
    this.enemyShoot = this.scene.getEntityById(options.enemyShoot)!;
    this.win = this.scene.getEntityById(options.win)!;
    this.lose = this.scene.getEntityById(options.lose)!;

    this.scene.addEventListener(EventType.LevelUp, this.handleLevelUp);
    this.scene.addEventListener(EventType.NewFishJoin, this.handlePowerUp);
    this.scene.addEventListener(EventType.FishDamaged, this.handleFishDamage);
    this.scene.addEventListener(EventType.EnemyShoot, this.handleEnemyShoot);
    this.scene.addEventListener(EventType.FishBite, this.handleFishBite);
    this.scene.addEventListener(EventType.FishDied, this.handleFishDeath);
    this.scene.addEventListener(EventType.GameOver, this.handleGameOver);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.LevelUp, this.handleLevelUp);
    this.scene.removeEventListener(EventType.NewFishJoin, this.handlePowerUp);
    this.scene.removeEventListener(EventType.FishDamaged, this.handleFishDamage);
    this.scene.removeEventListener(EventType.EnemyShoot, this.handleEnemyShoot);
    this.scene.removeEventListener(EventType.FishBite, this.handleFishBite);
    this.scene.removeEventListener(EventType.FishDied, this.handleFishDeath);
    this.scene.removeEventListener(EventType.GameOver, this.handleGameOver);
  }

  private handleLevelUp = (): void => {
    this.levelUp.dispatchEvent(PlayAudio);
  };

  private handlePowerUp = (): void => {
    this.powerUp.dispatchEvent(PlayAudio);
  };

  private handleFishDamage = (): void => {
    this.fishDamage.dispatchEvent(PlayAudio);
  };

  private handleFishDeath = (): void => {
    this.fishDeath.dispatchEvent(PlayAudio);
  };

  private handleFishBite = (): void => {
    this.fishBite.dispatchEvent(PlayAudio);
  };

  private handleEnemyShoot = (): void => {
    this.enemyShoot.dispatchEvent(PlayAudio);
  };

  private handleGameOver = (event: GameOverEvent): void => {
    if (event.isWin) {
      this.win.dispatchEvent(PlayAudio);
    } else {
      this.lose.dispatchEvent(PlayAudio);
    }
    this.backgroundMusic.dispatchEvent(StopAudio);
  };
}

AudioManagerScript.scriptName = 'AudioManagerScript';
