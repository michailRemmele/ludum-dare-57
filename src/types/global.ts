import type { SaveState } from '../game/systems/saver/types';

declare global {
  interface Window {
    saveState?: SaveState
    gtag?: (
      event: string,
      eventName: string,
      payload: Record<string, string | number | boolean>,
    ) => void
  }
}
