import {
  System,
} from 'dacha';
import type {
  Scene,
  SystemOptions,
} from 'dacha';
import { SetAudioVolume } from 'dacha/events';

import * as EventType from '../../events';
import type { GameOverEvent } from '../../events';
import { LEVELS } from '../../../consts/game';
import { getAudioVolume } from '../../../utils/audio-settings';

import type { SaveState, CompletedLevel } from './types';

const SAVE_STATE_LS_KEY = 'saveState';

const INITIAL_SAVE_STATE: SaveState = {
  completedLevels: [],
  touched: false,
};

export class Saver extends System {
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    let saveState: SaveState;
    try {
      const lsEntry = window.localStorage.getItem(SAVE_STATE_LS_KEY);
      saveState = lsEntry ? JSON.parse(lsEntry) as SaveState : structuredClone(INITIAL_SAVE_STATE);
    } catch (err) {
      saveState = structuredClone(INITIAL_SAVE_STATE);
      console.error('An error occured during save load');
    }

    window.saveState = saveState;
  }

  mount(): void {
    this.scene.dispatchEvent(SetAudioVolume, { group: 'master', value: getAudioVolume('master') });
    this.scene.dispatchEvent(SetAudioVolume, { group: 'music', value: getAudioVolume('music') });
    this.scene.dispatchEvent(SetAudioVolume, { group: 'effects', value: getAudioVolume('effects') });

    this.scene.addEventListener(EventType.GameOver, this.handleGameOver);
    this.scene.addEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.GameOver, this.handleGameOver);
    this.scene.removeEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

  private handleGameOver = (event: GameOverEvent): void => {
    if (!event.isWin) {
      return;
    }

    const completedLevel: CompletedLevel = {
      id: LEVELS[event.levelIndex].id,
      highestScore: event.score,
    };

    const oldCompletedLevel = window.saveState!.completedLevels.find(
      (level) => level.id === completedLevel.id,
    );

    if (!oldCompletedLevel) {
      window.saveState!.completedLevels.push(completedLevel);
    } else {
      oldCompletedLevel.highestScore = Math.max(
        completedLevel.highestScore,
        oldCompletedLevel.highestScore ?? 0,
      );
    }

    this.save();
  };

  private handleResetSaveState = (): void => {
    window.saveState = structuredClone(INITIAL_SAVE_STATE);
    window.localStorage.removeItem(SAVE_STATE_LS_KEY);
  };

  private save(): void {
    window.saveState!.touched = true;

    window.localStorage.setItem(SAVE_STATE_LS_KEY, JSON.stringify(window.saveState));
  }
}

Saver.systemName = 'Saver';
