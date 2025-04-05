import { Component } from 'dacha';

interface TrackSegmentConfig {
  index: number
}

export class TrackSegment extends Component {
  index: number;

  constructor(config: TrackSegmentConfig) {
    super();

    const { index } = config;

    this.index = index;
  }

  clone(): TrackSegment {
    return new TrackSegment({ index: this.index });
  }
}

TrackSegment.componentName = 'TrackSegment';
