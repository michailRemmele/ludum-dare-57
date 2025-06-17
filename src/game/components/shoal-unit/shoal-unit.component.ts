import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface ShoalUnitConfig {
  index: number
}

@DefineComponent({
  name: 'ShoalUnit',
})
export default class ShoalUnit extends Component {
  @DefineField()
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
