import { Component } from 'dacha';

export class TrackActivator extends Component {
  clone(): TrackActivator {
    return new TrackActivator();
  }
}

TrackActivator.componentName = 'TrackActivator';
