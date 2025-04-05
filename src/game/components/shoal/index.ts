import { Component } from 'dacha';

export class Shoal extends Component {
  clone(): Shoal {
    return new Shoal();
  }
}

Shoal.componentName = 'Shoal';
