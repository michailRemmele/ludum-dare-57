import type { Actor, ActorEvent, SceneEvent } from 'dacha';

export const Movement = 'Movement';
export const MovementJump = 'MovementJump';

export const ControlStickInput = 'ControlStickInput';

export const AttackInput = 'AttackInput';
export const Attack = 'Attack';
export const Damage = 'Damage';
export const DamageDone = 'DamageDone';
export const Kill = 'Kill';

export const ResetSaveState = 'ResetSaveState';

export const SendAnalytics = 'SendAnalytics';

export const GameOver = 'GameOver';

export const UpdateShoalIndex = 'UpdateShoalIndex';
export const NewFishJoin = 'NewFishJoin';
export const FishDied = 'FishDied';
export const FishDamaged = 'FishDamaged';
export const UnlockWeapon = 'UnlockWeapon';
export const EnemyShoot = 'EnemyShoot';
export const FishBite = 'FishBite';

export const IncreaseScorePoints = 'IncreaseScorePoints';
export const LevelUp = 'LevelUp';

export type MovementEvent = ActorEvent<{
  angle?: number
  x?: number
  y?: number
}>;

export type AttackInputEvent = ActorEvent<{ x: number, y: number }>;
export type AttackEvent = ActorEvent<{ x: number, y: number }>;
export type DamageEvent = ActorEvent<{ value: number, actor?: Actor }>;

export type UpdateShoalIndexEvent = ActorEvent<{
  index: number
}>;

export type ControlStickInputEvent = SceneEvent<{ x: number, y: number }>;

export type SendAnalyticsEvent = SceneEvent<{
  name: string
  payload: Record<string, string | number | boolean>
}>;

export type GameOverEvent = SceneEvent<{
  isWin: boolean
  levelIndex: number
  score: number
}>;

export type IncreaseScorePointsEvent = SceneEvent<{
  points: number
}>;

export type LevelUpEvent = SceneEvent<{
  level: number
  nextLevelScore: number
  isMax: boolean
}>;

declare module 'dacha' {
  export interface ActorEventMap {
    [Movement]: MovementEvent
    [MovementJump]: ActorEvent

    [AttackInput]: AttackInputEvent
    [Attack]: ActorEvent
    [Damage]: DamageEvent
    [DamageDone]: ActorEvent
    [Kill]: ActorEvent

    [UpdateShoalIndex]: UpdateShoalIndexEvent
    [NewFishJoin]: ActorEvent
    [FishDied]: ActorEvent
    [FishDamaged]: ActorEvent
    [FishBite]: ActorEvent
    [UnlockWeapon]: ActorEvent
    [EnemyShoot]: ActorEvent
  }

  export interface SceneEventMap {
    [ControlStickInput]: ControlStickInputEvent
    [ResetSaveState]: SceneEvent
    [SendAnalytics]: SendAnalyticsEvent
    [GameOver]: GameOverEvent
    [IncreaseScorePoints]: IncreaseScorePointsEvent
    [LevelUp]: LevelUpEvent
  }
}
