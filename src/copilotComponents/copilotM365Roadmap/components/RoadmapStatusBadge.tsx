import * as React from 'react';
import { Badge } from '@fluentui/react-components';
import type { RoadmapStatus } from '../models/IRoadmapItem';

const STATUS_COLOR_MAP: Record<string, 'success' | 'informative' | 'warning' | 'danger' | 'subtle'> = {
  Launched: 'success',
  'Rolling out': 'informative',
  'In development': 'warning',
  Cancelled: 'danger'
};

export interface IRoadmapStatusBadgeProps {
  status: RoadmapStatus;
}

/** Color-coded badge representing a roadmap item's lifecycle status. */
export default function RoadmapStatusBadge(props: IRoadmapStatusBadgeProps): React.ReactElement {
  const color = STATUS_COLOR_MAP[props.status] || 'subtle';
  return (
    <Badge appearance="filled" color={color}>
      {props.status}
    </Badge>
  );
}
