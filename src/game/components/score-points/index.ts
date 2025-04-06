import { Component } from 'dacha';

interface ScorePointsConfig {
  amount: number
}

export class ScorePoints extends Component {
  amount: number;

  constructor(config: ScorePointsConfig) {
    super();

    const { amount } = config;

    this.amount = amount;
  }

  clone(): ScorePoints {
    return new ScorePoints({ amount: this.amount });
  }
}

ScorePoints.componentName = 'ScorePoints';
