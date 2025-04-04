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
} from 'dacha';
import { PLAYER_ACTOR_NAME } from '../../../consts/actors';

import { smoothMove } from './utils';

const VIEWPORT_SIZE = 160;

export class CameraScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
  }

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = Math.round(camera.windowSizeY / VIEWPORT_SIZE);
  }

  update(options: UpdateOptions): void {
    this.updateZoom();

    const transform = this.actor.getComponent(Transform);
    const target = this.scene.getEntityByName(PLAYER_ACTOR_NAME);

    if (!target) {
      return;
    }

    const targetTransform = target.getComponent(Transform);

    const [x, y] = smoothMove(
      transform.offsetX,
      transform.offsetY,
      targetTransform.offsetX,
      targetTransform.offsetY,
      options.deltaTime,
    );

    transform.offsetX = x;
    transform.offsetY = y;
  }
}

CameraScript.scriptName = 'CameraScript';
