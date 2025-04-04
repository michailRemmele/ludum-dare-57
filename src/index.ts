import {
  Engine,

  CameraSystem,
  MouseInputSystem,
  MouseControlSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  PhysicsSystem,
  ScriptSystem,
  Animator,
  SpriteRenderer,
  UiBridge,
  AudioSystem,
  GameStatsMeter,

  Camera,
  MouseControl,
  KeyboardControl,
  RigidBody,
  ColliderContainer,
  ScriptBundle,
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
    UiBridge,
    AudioSystem,
    ScriptSystem,
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
    ScriptBundle,
    Parallax,
    Effect,
    ActiveEffects,
    ...Object.values(GameComponents),
  ],
  resources: {
    [ScriptSystem.systemName]: [
      ...Object.values(GameScripts),
    ],
    [UiBridge.systemName]: {
      // comment: to avoid eslint issues with extensions
      // eslint-disable-next-line import/extensions
      loadUiApp: () => import('./ui/index.tsx'),
    },
    [ScriptSystem.systemName]: [
      ...Object.values(GameScripts),
    ],
    [EffectsSystem.systemName]: effects,
  },
});

void engine.play();

if (isIos()) {
  applyIosSafariScreenFix();
}
