import { Component } from 'dacha';

interface HitBoxConfig {
  disabled: boolean
}

export class HitBox extends Component {
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

HitBox.componentName = 'HitBox';
