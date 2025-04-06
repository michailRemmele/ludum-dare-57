export interface CompletedLevel {
  id: string
  highestScore: number
}

export type SaveState = {
  completedLevels: CompletedLevel[]
  touched: boolean
};
