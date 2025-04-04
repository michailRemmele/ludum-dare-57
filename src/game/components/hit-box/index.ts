import { Component } from 'dacha';

export class HitBox extends Component {
  clone(): HitBox {
    return new HitBox();
  }
}

HitBox.componentName = 'HitBox';
