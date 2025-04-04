import {
  System,
} from 'dacha';
import type {
  SystemOptions,
  Scene,
} from 'dacha';

import * as EventType from '../../events';
import type { SendAnalyticsEvent } from '../../events';

export class AnalyticsSystem extends System {
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
  }

  mount(): void {
    this.scene.addEventListener(EventType.SendAnalytics, this.handleSendAnalytics);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SendAnalytics, this.handleSendAnalytics);
  }

  private handleSendAnalytics = (event: SendAnalyticsEvent): void => {
    if (!window.gtag) {
      return;
    }

    const { name, payload } = event;

    window.gtag('event', name, payload);
  };
}

AnalyticsSystem.systemName = 'AnalyticsSystem';
