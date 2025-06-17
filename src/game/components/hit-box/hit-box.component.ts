import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface HitBoxConfig {
  disabled: boolean
}

@DefineComponent({
  name: 'HitBox',
})
export default class HitBox extends Component {
  @DefineField()
  disabled: boolean;

  constructor(config: HitBoxConfig) {
    super();

    const { disabled } = config;

    this.disabled = disabled;
  }

  clone(): HitBox {
    return new HitBox({ disabled: this.disabled });
  }
}
