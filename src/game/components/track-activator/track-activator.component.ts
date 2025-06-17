import { Component } from 'dacha';
import { DefineComponent } from 'dacha-workbench/decorators';

@DefineComponent({
  name: 'TrackActivator',
})
export default class TrackActivator extends Component {
  clone(): TrackActivator {
    return new TrackActivator();
  }
}
