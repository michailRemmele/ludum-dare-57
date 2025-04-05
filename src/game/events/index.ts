import type { Actor, ActorEvent, SceneEvent } from 'dacha';

export const Movement = 'Movement';
export const MovementJump = 'MovementJump';

export const AttackInput = 'AttackInput';
export const Attack = 'Attack';
export const Damage = 'Damage';
export const DamageDone = 'DamageDone';
export const Kill = 'Kill';

export const ResetSaveState = 'ResetSaveState';

export const SendAnalytics = 'SendAnalytics';

export const GameOver = 'GameOver';

export const UpdateShoalIndex = 'UpdateShoalIndex';
export const FishDied = 'FishDied';

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

export type SendAnalyticsEvent = SceneEvent<{
  name: string
  payload: Record<string, string | number | boolean>
}>;

export type GameOverEvent = SceneEvent<{
  isWin: boolean
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
    [FishDied]: ActorEvent
  }

  export interface SceneEventMap {
    [ResetSaveState]: SceneEvent
    [SendAnalytics]: SendAnalyticsEvent
    [GameOver]: GameOverEvent
  }
}
