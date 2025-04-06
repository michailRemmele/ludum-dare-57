import { Component } from 'dacha';

interface ScoreConfig {
  value: number
}

export class Score extends Component {
  value: number;

  constructor(config: ScoreConfig) {
    super();

    const { value } = config;

    this.value = value;
  }

  clone(): Score {
    return new Score({ value: this.value });
  }
}

Score.componentName = 'Score';
