import { Component } from 'dacha';
import { DefineComponent } from 'dacha-workbench/decorators';

@DefineComponent({
  name: 'EnemyDetector',
})
export default class EnemyDetector extends Component {
  clone(): EnemyDetector {
    return new EnemyDetector();
  }
}
