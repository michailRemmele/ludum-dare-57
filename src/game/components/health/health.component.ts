import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface HealthConfig {
  points: number
  immortal: boolean
}

@DefineComponent({
  name: 'Health',
})
export default class Health extends Component {
  @DefineField({
    initialValue: 100,
  })
  points: number;

  @DefineField()
  immortal: boolean;

  maxPoints: number;

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
