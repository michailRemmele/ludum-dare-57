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
  ColliderContainer,
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
  EffectsSystem,
  Effect,
  ActiveEffects,
} from 'dacha-game-systems';

import * as GameSystems from './game/systems';
import * as GameComponents from './game/components';
import * as GameScripts from './game/scripts';
import { effects } from './game/effects';
import { isTouchDevice } from './utils/is-touch-device';
import { applyIosSafariScreenFix } from './utils/ios-screen-fix';
import { isIos } from './utils/is-ios';

import config from '../data/data.json';

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
    EffectsSystem,
    ...Object.values(GameSystems),
  ],
  components: [
    Camera,
    MouseControl,
    KeyboardControl,
    RigidBody,
    ColliderContainer,
    Animatable,
    Sprite,
    Light,
    AudioSource,
    Transform,
    Behaviors,
    Parallax,
    Effect,
    ActiveEffects,
    ...Object.values(GameComponents),
  ],
  resources: {
    [BehaviorSystem.systemName]: [
      ...Object.values(GameScripts),
    ],
    [UIBridge.systemName]: {
      // comment: to avoid eslint issues with extensions
      // eslint-disable-next-line import/extensions
      loadUI: () => import('./ui/index.tsx'),
    },
    [EffectsSystem.systemName]: effects,
  },
});

void engine.play();

if (isIos()) {
  applyIosSafariScreenFix();
}
