import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'dacha';
import {
  Script,
} from 'dacha';

import * as EventType from '../../events';

export class PlayerScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.actor.addEventListener(EventType.Kill, this.handleKill);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Kill, this.handleKill);
  }

  private handleKill = (): void => {
    this.scene.dispatchEvent(EventType.GameOver, { isWin: false });
  };
}

PlayerScript.scriptName = 'PlayerScript';
