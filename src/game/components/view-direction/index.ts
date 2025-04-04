import { Component } from 'dacha';

interface ViewDirectionConfig {
  x: number
  y: number
}

export class ViewDirection extends Component {
  x: number;
  y: number;

  constructor(config: ViewDirectionConfig) {
    super();

    this.x = config.x;
    this.y = config.y;
  }

  clone(): ViewDirection {
    return new ViewDirection({
      x: this.x,
      y: this.y,
    });
  }
}

ViewDirection.componentName = 'ViewDirection';
