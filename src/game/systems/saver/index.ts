import {
  System,
} from 'dacha';
import type {
  Scene,
  SystemOptions,
} from 'dacha';
import { SetAudioVolume } from 'dacha/events';

import * as EventType from '../../events';
import { getAudioVolume } from '../../../utils/audio-settings';

import type { SaveState } from './types';

const SAVE_STATE_LS_KEY = 'saveState';

const INITIAL_SAVE_STATE: SaveState = {
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

    this.scene.addEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

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
