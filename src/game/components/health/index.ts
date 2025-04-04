import { Component } from 'dacha';

interface HealthConfig {
  points: number
}

export class Health extends Component {
  points: number;
  maxPoints: number;

  constructor(config: HealthConfig) {
    super();

    const { points } = config;

    this.points = points;
    this.maxPoints = points;
  }

  clone(): Health {
    return new Health({ points: this.points });
  }
}

Health.componentName = 'Health';
