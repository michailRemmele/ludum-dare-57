import { Component } from 'dacha';

interface TeamConfig {
  index: number
}

export class LevelInfo extends Component {
  index: number;

  constructor(config: TeamConfig) {
    super();

    const { index } = config;

    this.index = index;
  }

  clone(): LevelInfo {
    return new LevelInfo({ index: this.index });
  }
}

LevelInfo.componentName = 'LevelInfo';
