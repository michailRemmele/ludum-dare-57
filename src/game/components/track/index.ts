import { Component } from 'dacha';

interface TrackConfig {
  mob: string
  amount: number
  frequency: number
  patrolDistance: number
}

export class Track extends Component {
  mob: string;
  amount: number;
  frequency: number;
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

Track.componentName = 'Track';
