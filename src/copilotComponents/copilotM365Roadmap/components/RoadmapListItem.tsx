import * as React from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  Body1,
  Body1Strong,
  Caption1,
  Button,
  Badge,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { Open24Regular, LinkMultiple24Regular } from '@fluentui/react-icons';
import type { IRoadmapItem } from '../models/IRoadmapItem';
import { getRoadmapFeatureUrl } from '../models/IRoadmapItem';
import RoadmapStatusBadge from './RoadmapStatusBadge';

const useStyles = makeStyles({
  card: {
    width: '100%'
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: `0 ${tokens.spacingHorizontalXS}`
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  tagRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  metaGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  footer: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap'
  }
});

export interface IRoadmapListItemStrings {
  openLinkButtonLabel: string;
  viewOnRoadmapButtonLabel: string;
  publicPreviewDateLabel: string;
  generalAvailabilityDateLabel: string;
  lastUpdatedLabel: string;
  platformsLabel: string;
  cloudInstancesLabel: string;
  productsLabel: string;
  noValuePlaceholder: string;
}

export interface IRoadmapListItemProps {
  readonly item: IRoadmapItem;
  readonly strings: IRoadmapListItemStrings;
  readonly onOpenLink: (url: string) => void;
}

/** A single feature rendered as a Fluent UI card, with a link to its Microsoft 365 roadmap page. */
export default function RoadmapListItem(props: IRoadmapListItemProps): React.ReactElement {
  const styles = useStyles();
  const { item, strings } = props;

  const roadmapUrl = React.useMemo(() => getRoadmapFeatureUrl(item.id), [item.id]);

  const handleOpenRoadmapLink = React.useCallback(() => {
    props.onOpenLink(roadmapUrl);
  }, [props, roadmapUrl]);

  const handleOpenMoreInfoLink = React.useCallback(() => {
    if (item.moreInfoLink) {
      props.onOpenLink(item.moreInfoLink);
    }
  }, [props, item]);

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <div className={styles.headerText}>
            <div className={styles.titleRow}>
              <Caption1>#{item.id}</Caption1>
              <Body1Strong>{item.title}</Body1Strong>
            </div>
            <RoadmapStatusBadge status={item.status} />
          </div>
        }
      />

      <div className={styles.body}>
        <Body1 className={styles.description}>{item.description || strings.noValuePlaceholder}</Body1>

        {item.products.length > 0 ? (
          <div className={styles.tagRow}>
            {item.products.map((product) => (
              <Badge key={product} appearance="outline" size="small">
                {product}
              </Badge>
            ))}
          </div>
        ) : undefined}

        <div className={styles.metaGrid}>
          <Caption1>
            {strings.publicPreviewDateLabel}: {item.publicPreviewDate || strings.noValuePlaceholder}
          </Caption1>
          <Caption1>
            {strings.generalAvailabilityDateLabel}: {item.publicDisclosureAvailabilityDate || strings.noValuePlaceholder}
          </Caption1>
          <Caption1>
            {strings.lastUpdatedLabel}: {item.modified || strings.noValuePlaceholder}
          </Caption1>
        </div>

        {item.platforms.length > 0 ? (
          <div className={styles.tagRow}>
            <Caption1>{strings.platformsLabel}:</Caption1>
            {item.platforms.map((platform) => (
              <Badge key={platform} appearance="tint" size="small">
                {platform}
              </Badge>
            ))}
          </div>
        ) : undefined}

        {item.cloudInstances.length > 0 ? (
          <div className={styles.tagRow}>
            <Caption1>{strings.cloudInstancesLabel}:</Caption1>
            {item.cloudInstances.map((cloud) => (
              <Badge key={cloud} appearance="tint" size="small">
                {cloud}
              </Badge>
            ))}
          </div>
        ) : undefined}
      </div>

      <CardFooter className={styles.footer}>
        <Button appearance="primary" icon={<LinkMultiple24Regular />} onClick={handleOpenRoadmapLink}>
          {strings.viewOnRoadmapButtonLabel}
        </Button>
        {item.moreInfoLink ? (
          <Button appearance="secondary" icon={<Open24Regular />} onClick={handleOpenMoreInfoLink}>
            {strings.openLinkButtonLabel}
          </Button>
        ) : undefined}
      </CardFooter>
    </Card>
  );
}
