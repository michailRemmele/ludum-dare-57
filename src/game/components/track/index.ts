import { Component } from 'dacha';

interface TrackConfig {
  mob: string
  amount: number
  frequency: number
}

export class Track extends Component {
  mob: string;
  amount: number;
  frequency: number;

  constructor(config: TrackConfig) {
    super();

    const { mob, amount, frequency } = config;

    this.mob = mob;
    this.amount = amount;
    this.frequency = frequency;
  }

  clone(): Track {
    return new Track({
      mob: this.mob,
      amount: this.amount,
      frequency: this.frequency,
    });
  }
}

Track.componentName = 'Track';
