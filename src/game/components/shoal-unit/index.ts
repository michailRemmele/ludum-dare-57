import { Component } from 'dacha';

interface ShoalUnitConfig {
  index: number
}

export class ShoalUnit extends Component {
  index: number;

  constructor(config: ShoalUnitConfig) {
    super();

    this.index = config.index;
  }

  clone(): ShoalUnit {
    return new ShoalUnit({
      index: this.index,
    });
  }
}

ShoalUnit.componentName = 'ShoalUnit';
