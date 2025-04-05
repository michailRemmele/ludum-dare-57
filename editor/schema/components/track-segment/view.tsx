import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useConfig,
} from 'dacha-workbench';
import type { WidgetProps } from 'dacha-workbench';
import type { ActorConfig } from 'dacha';

import { TrackSegment } from '../../../../src/game/components';

export const TrackSegmentWidget: FC<WidgetProps> = ({
  fields,
  path,
  references,
}) => {
  const tracksPath = useMemo(
    () => {
      const actorPath = path.slice(0, -3);
      return actorPath.at(-2) !== 'children' ? undefined : actorPath.slice(0, -1);
    },
    [path],
  );
  const trackChildren = useConfig(tracksPath) as ActorConfig[] | undefined;

  const extendedReferences = useMemo(() => ({
    ...references,
    tracks: {
      items: (trackChildren ?? [])
        .filter(
          (actor) => actor.components?.find(
            (component) => component.name === TrackSegment.componentName,
          ),
        )
        .map((actor) => ({
          title: actor.name,
          value: actor.id,
        })),
    },
  }), [references, trackChildren]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};
