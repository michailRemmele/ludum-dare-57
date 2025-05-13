import {
  WorldSystem,
} from 'dacha';
import type {
  WorldSystemOptions,
  World,
} from 'dacha';

import * as EventType from '../../events';
import type { SendAnalyticsEvent } from '../../events';

export class AnalyticsSystem extends WorldSystem {
  private world: World;

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;

    this.world.addEventListener(EventType.SendAnalytics, this.handleSendAnalytics);
  }

  onWorldDestroy(): void {
    this.world.removeEventListener(EventType.SendAnalytics, this.handleSendAnalytics);
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
