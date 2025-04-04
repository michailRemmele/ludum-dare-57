import {
  ParallaxSystem,
  Parallax,
  EffectsSystem,
  Effect,
} from 'dacha-game-systems';
import {
  parallaxSystem,
  parallax,
  effectsSystem,
  effect,
  locales as gameSystemsLocales,
} from 'dacha-game-systems/schema';

import {
  componentsSchema as gameComponentsSchema,
  systemsSchema as gameSystemsSchema,
  resourcesSchema,
} from './schema';
import { globalReferences } from './references';

const locales = {
  en: {
    ...gameSystemsLocales.en,
  },
};

export const componentsSchema = {
  ...gameComponentsSchema,
  [Parallax.componentName]: parallax,
  [Effect.componentName]: effect,
};

export const systemsSchema = {
  ...gameSystemsSchema,
  [ParallaxSystem.systemName]: parallaxSystem,
  [EffectsSystem.systemName]: effectsSystem,
};

export {
  resourcesSchema,
  globalReferences,
  locales,
};
