import { Component } from 'dacha';

export class EnemyDetector extends Component {
  clone(): EnemyDetector {
    return new EnemyDetector();
  }
}

EnemyDetector.componentName = 'EnemyDetector';
