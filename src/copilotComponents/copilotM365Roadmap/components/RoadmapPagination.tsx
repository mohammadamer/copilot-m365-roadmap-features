import * as React from 'react';
import { Button, Caption1, makeStyles, tokens } from '@fluentui/react-components';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM
  }
});

export interface IRoadmapPaginationProps {
  page: number;
  totalPages: number;
  previousLabel: string;
  nextLabel: string;
  pageStatusTemplate: string;
  onPageChange: (page: number) => void;
}

/** Previous/Next pagination controls with a "page X of Y" status readout. */
export default function RoadmapPagination(props: IRoadmapPaginationProps): React.ReactElement {
  const styles = useStyles();

  const handlePrevious = React.useCallback(() => {
    props.onPageChange(Math.max(1, props.page - 1));
  }, [props]);

  const handleNext = React.useCallback(() => {
    props.onPageChange(Math.min(props.totalPages, props.page + 1));
  }, [props]);

  const statusText = props.pageStatusTemplate
    .replace('{0}', String(props.page))
    .replace('{1}', String(props.totalPages));

  return (
    <nav className={styles.root} aria-label={statusText}>
      <Button
        appearance="subtle"
        icon={<ChevronLeft24Regular />}
        disabled={props.page <= 1}
        onClick={handlePrevious}
        aria-label={props.previousLabel}
      >
        {props.previousLabel}
      </Button>
      <Caption1 role="status" aria-live="polite">
        {statusText}
      </Caption1>
      <Button
        appearance="subtle"
        icon={<ChevronRight24Regular />}
        iconPosition="after"
        disabled={props.page >= props.totalPages}
        onClick={handleNext}
        aria-label={props.nextLabel}
      >
        {props.nextLabel}
      </Button>
    </nav>
  );
}
