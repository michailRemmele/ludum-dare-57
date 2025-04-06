export interface CompletedLevel {
  id: string
}

export type SaveState = {
  completedLevels: CompletedLevel[]
  touched: boolean
};
