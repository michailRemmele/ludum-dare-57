import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface TrackConfig {
  mob: string
  amount: number
  frequency: number
  patrolDistance: number
}

@DefineComponent({
  name: 'Track',
})
export default class Track extends Component {
  @DefineField()
  mob: string;

  @DefineField()
  amount: number;

  @DefineField({
    initialValue: 1000,
  })
  frequency: number;

  @DefineField()
  patrolDistance: number;

  constructor(config: TrackConfig) {
    super();

    const {
      mob, amount, frequency, patrolDistance,
    } = config;

    this.mob = mob;
    this.amount = amount;
    this.frequency = frequency;
    this.patrolDistance = patrolDistance;
  }

  clone(): Track {
    return new Track({
      mob: this.mob,
      amount: this.amount,
      frequency: this.frequency,
      patrolDistance: this.patrolDistance,
    });
  }
}
