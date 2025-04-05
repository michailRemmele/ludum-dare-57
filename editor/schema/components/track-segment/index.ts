import type { WidgetSchema } from 'dacha-workbench';

export const trackSegment: WidgetSchema = {
  title: 'Track Segment',
  fields: [
    {
      name: 'index',
      title: 'Index',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
    isInitial: false,
  }),
};
