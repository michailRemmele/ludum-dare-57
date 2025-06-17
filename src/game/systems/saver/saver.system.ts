import {
  WorldSystem,
} from 'dacha';
import type {
  World,
  WorldSystemOptions,
} from 'dacha';
import { SetAudioVolume } from 'dacha/events';
import { DefineSystem } from 'dacha-workbench/decorators';

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

@DefineSystem({
  name: 'Saver',
})
export default class Saver extends WorldSystem {
  private world: World;

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;

    let saveState: SaveState;
    try {
      const lsEntry = window.localStorage.getItem(SAVE_STATE_LS_KEY);
      saveState = lsEntry ? JSON.parse(lsEntry) as SaveState : structuredClone(INITIAL_SAVE_STATE);
    } catch (err) {
      saveState = structuredClone(INITIAL_SAVE_STATE);
      console.error('An error occured during save load');
    }

    window.saveState = saveState;

    this.world.dispatchEvent(SetAudioVolume, { group: 'master', value: getAudioVolume('master') });
    this.world.dispatchEvent(SetAudioVolume, { group: 'music', value: getAudioVolume('music') });
    this.world.dispatchEvent(SetAudioVolume, { group: 'effects', value: getAudioVolume('effects') });

    this.world.addEventListener(EventType.GameOver, this.handleGameOver);
    this.world.addEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

  onWorldDestroy(): void {
    this.world.removeEventListener(EventType.GameOver, this.handleGameOver);
    this.world.removeEventListener(EventType.ResetSaveState, this.handleResetSaveState);
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
