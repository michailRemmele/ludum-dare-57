import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useConfig,
} from 'dacha-workbench';
import type { WidgetProps } from 'dacha-workbench';
import type { TemplateConfig } from 'dacha';

export const WeaponWidget: FC<WidgetProps> = ({
  fields,
  path,
  references,
}) => {
  const templates = useConfig('templates') as Array<TemplateConfig>;

  const extendedReferences = useMemo(() => ({
    ...references,
    models: {
      items: templates.map((template) => ({
        title: template.name,
        value: template.id,
      })),
    },
  }), [references]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};
