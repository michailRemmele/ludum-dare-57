import { Component } from 'dacha';

interface LevelInfoConfig {
  index: number
}

export class LevelInfo extends Component {
  index: number;

  constructor(config: LevelInfoConfig) {
    super();

    const { index } = config;

    this.index = index;
  }

  clone(): LevelInfo {
    return new LevelInfo({ index: this.index });
  }
}

LevelInfo.componentName = 'LevelInfo';
