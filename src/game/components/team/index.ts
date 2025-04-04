import { Component } from 'dacha';

interface TeamConfig {
  index: number
}

export class Team extends Component {
  index: number;

  constructor(config: TeamConfig) {
    super();

    const { index } = config;

    this.index = index;
  }

  clone(): Team {
    return new Team({ index: this.index });
  }
}

Team.componentName = 'Team';
