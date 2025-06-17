import { Component } from 'dacha';
import { DefineComponent } from 'dacha-workbench/decorators';

@DefineComponent({
  name: 'Shoal',
})
export default class Shoal extends Component {
  clone(): Shoal {
    return new Shoal();
  }
}
