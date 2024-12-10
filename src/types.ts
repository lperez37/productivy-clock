export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface TimerState {
  initialTime: number;
  currentTime: number;
  isRunning: boolean;
  extraTimeCount: number;
  lastUpdated?: number;
}
      