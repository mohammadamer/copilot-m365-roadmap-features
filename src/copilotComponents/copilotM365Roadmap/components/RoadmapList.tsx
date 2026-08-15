import * as React from 'react';
import { Body1, makeStyles, tokens } from '@fluentui/react-components';
import type { IRoadmapItem } from '../models/IRoadmapItem';
import RoadmapListItem, { type IRoadmapListItemStrings } from './RoadmapListItem';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalM
  },
  empty: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL
  }
});

export interface IRoadmapListProps {
  readonly items: IRoadmapItem[];
  readonly itemStrings: IRoadmapListItemStrings;
  readonly emptyStateMessage: string;
  readonly onOpenLink: (url: string) => void;
}

/** Card grid of roadmap items; renders an empty-state message when there are none. */
export default function RoadmapList(props: IRoadmapListProps): React.ReactElement {
  const styles = useStyles();

  if (props.items.length === 0) {
    return (
      <div className={styles.empty}>
        <Body1>{props.emptyStateMessage}</Body1>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {props.items.map((item) => (
        <RoadmapListItem key={item.id} item={item} strings={props.itemStrings} onOpenLink={props.onOpenLink} />
      ))}
    </div>
  );
}
