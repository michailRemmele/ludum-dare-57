import type { SaveState } from '../game/systems/saver/types';

declare global {
  interface Window {
    saveState?: SaveState;
  }
}
