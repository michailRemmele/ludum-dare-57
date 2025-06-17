import {
  Engine,

  CameraSystem,
  MouseInputSystem,
  MouseControlSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  PhysicsSystem,
  BehaviorSystem,
  Animator,
  SpriteRenderer,
  UIBridge,
  AudioSystem,
  GameStatsMeter,

  Camera,
  MouseControl,
  KeyboardControl,
  RigidBody,
  Collider,
  Behaviors,
  Animatable,
  Sprite,
  Light,
  AudioSource,
  Transform,
} from 'dacha';
import {
  ParallaxSystem,
  Parallax,
} from 'dacha-game-systems';

import { isTouchDevice } from './utils/is-touch-device';
import { applyIosSafariScreenFix } from './utils/ios-screen-fix';
import { isIos } from './utils/is-ios';
import { importAll } from './utils/import-all';
import type { SystemConstructor, ComponentConstructor, BehaviorConstructor } from './types/utils';

import config from '../data/data.json';

const gameComponents = importAll(require.context('./', true, /.component.ts$/)) as ComponentConstructor[];
const gameSystems = importAll(require.context('./', true, /.system.ts$/)) as SystemConstructor[];
const gameBehaviors = importAll(require.context('./', true, /.behavior.ts$/)) as BehaviorConstructor[];

const touchDevice = isTouchDevice();

const engine = new Engine({
  config,
  systems: [
    CameraSystem,
    PhysicsSystem,
    Animator,
    SpriteRenderer,
    UIBridge,
    AudioSystem,
    BehaviorSystem,
    GameStatsMeter,
    ...(!touchDevice
      ? [
        MouseInputSystem,
        MouseControlSystem,
        KeyboardInputSystem,
        KeyboardControlSystem,
      ]
      : []
    ),
    ParallaxSystem,
    ...gameSystems,
  ],
  components: [
    Camera,
    MouseControl,
    KeyboardControl,
    RigidBody,
    Collider,
    Animatable,
    Sprite,
    Light,
    AudioSource,
    Transform,
    Behaviors,
    Parallax,
    ...gameComponents,
  ],
  resources: {
    [BehaviorSystem.systemName]: [
      ...gameBehaviors,
    ],
    [UIBridge.systemName]: {
      // comment: to avoid eslint issues with extensions
      // eslint-disable-next-line import/extensions
      loadUI: () => import('./ui/index.tsx'),
    },
  },
});

void engine.play();

if (isIos()) {
  applyIosSafariScreenFix();
}
