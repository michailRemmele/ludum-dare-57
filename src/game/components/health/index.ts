import { Component } from 'dacha';

interface HealthConfig {
  points: number
  immortal: boolean
}

export class Health extends Component {
  points: number;
  maxPoints: number;
  immortal: boolean;

  constructor(config: HealthConfig) {
    super();

    const { points, immortal } = config;

    this.points = points;
    this.maxPoints = points;

    this.immortal = immortal;
  }

  clone(): Health {
    return new Health({ points: this.points, immortal: this.immortal });
  }
}

Health.componentName = 'Health';
