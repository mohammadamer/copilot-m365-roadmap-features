import * as React from 'react';
import {
  FluentProvider,
  IdPrefixProvider,
  webLightTheme,
  webDarkTheme,
  Title3,
  Body1,
  Button,
  Spinner,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { ArrowExpand24Regular, ResizeLarge24Regular, ArrowClockwise24Regular } from '@fluentui/react-icons';

import type { ICopilotM365RoadmapProps } from './ICopilotM365RoadmapProps';
import { useRoadmapData } from '../hooks/useRoadmapData';
import {
  searchRoadmapItems,
  filterByStatus,
  filterByProduct,
  getDistinctProducts,
  getDistinctStatuses,
  paginate,
  getTotalPages
} from '../utils/roadmapFilters';
import RoadmapSearchBar from './RoadmapSearchBar';
import RoadmapFilters from './RoadmapFilters';
import RoadmapList from './RoadmapList';
import RoadmapPagination from './RoadmapPagination';

const PAGE_SIZE: number = 20;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap'
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap'
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center'
  }
});

const EXPANDED_WIDTH: number = 700;
const EXPANDED_HEIGHT: number = 550;
const COMPACT_WIDTH: number = 420;
const COMPACT_HEIGHT: number = 320;

/**
 * Main React UI for browsing Microsoft 365 roadmap features.
 *
 * Composes a search bar, status/product filters, an accordion-based
 * result list, and pagination on top of data fetched via `useRoadmapData`.
 */
export default function CopilotM365Roadmap(props: Readonly<ICopilotM365RoadmapProps>): React.ReactElement {
  const { hostContext, bridge, onRequestDisplayMode, onRequestSizeChange, strings } = props;
  const styles = useStyles();

  const { items, loading, error, refetch } = useRoadmapData();

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState<number>(1);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;

  const statusOptions = React.useMemo(() => getDistinctStatuses(items), [items]);
  const productOptions = React.useMemo(() => getDistinctProducts(items), [items]);

  const filteredItems = React.useMemo(() => {
    const searched = searchRoadmapItems(items, searchQuery);
    const statusFiltered = filterByStatus(searched, selectedStatuses);
    return filterByProduct(statusFiltered, selectedProduct);
  }, [items, searchQuery, selectedStatuses, selectedProduct]);

  const totalPages = React.useMemo(() => getTotalPages(filteredItems.length, PAGE_SIZE), [filteredItems]);

  // Keep the current page in range whenever the filtered result set shrinks.
  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedItems = React.useMemo(() => paginate(filteredItems, page, PAGE_SIZE), [filteredItems, page]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handleStatusChange = React.useCallback((statuses: string[]) => {
    setSelectedStatuses(statuses);
    setPage(1);
  }, []);

  const handleProductChange = React.useCallback((product: string | undefined) => {
    setSelectedProduct(product);
    setPage(1);
  }, []);

  const handleOpenLink = React.useCallback(
    async (url: string): Promise<void> => {
      await bridge.openLinkAsync(url);
    },
    [bridge]
  );

  const handleExpand = React.useCallback(async (): Promise<void> => {
    await onRequestDisplayMode('fullscreen');
  }, [onRequestDisplayMode]);

  const handleResize = React.useCallback(async (): Promise<void> => {
    if (isExpanded) {
      await onRequestSizeChange(COMPACT_WIDTH, COMPACT_HEIGHT);
    } else {
      await onRequestSizeChange(EXPANDED_WIDTH, EXPANDED_HEIGHT);
    }
    setIsExpanded(!isExpanded);
  }, [onRequestSizeChange, isExpanded]);

  const resultCountText = strings.ResultCountTemplate.replace('{0}', String(filteredItems.length));

  const itemStrings = {
    openLinkButtonLabel: strings.OpenLinkButtonLabel,
    viewOnRoadmapButtonLabel: strings.ViewOnRoadmapButtonLabel,
    publicPreviewDateLabel: strings.PublicPreviewDateLabel,
    generalAvailabilityDateLabel: strings.GeneralAvailabilityDateLabel,
    lastUpdatedLabel: strings.LastUpdatedLabel,
    platformsLabel: strings.PlatformsLabel,
    cloudInstancesLabel: strings.CloudInstancesLabel,
    productsLabel: strings.ProductsLabel,
    noValuePlaceholder: strings.NoValuePlaceholder
  };

  return (
    <IdPrefixProvider value="copilot-component-">
      <FluentProvider theme={theme} targetDocument={props.targetDocument} style={{ minHeight: '100%' }}>
        <div className={styles.root}>
          <div className={styles.header}>
            <Title3>Microsoft 365 Roadmap</Title3>
            <div className={styles.actions}>
              <Button appearance="subtle" icon={<ArrowExpand24Regular />} onClick={handleExpand}>
                {strings.ExpandButtonLabel}
              </Button>
              <Button appearance="subtle" icon={<ResizeLarge24Regular />} onClick={handleResize}>
                {isExpanded ? strings.CompactButtonLabel : strings.ExpandButtonLabel}
              </Button>
            </div>
          </div>

          <div className={styles.toolbar}>
            <RoadmapSearchBar
              value={searchQuery}
              placeholder={strings.SearchPlaceholder}
              ariaLabel={strings.SearchAriaLabel}
              clearButtonAriaLabel={strings.ClearSearchButtonLabel}
              onChange={handleSearchChange}
            />
            <RoadmapFilters
              statusOptions={statusOptions}
              selectedStatuses={selectedStatuses}
              statusFilterLabel={strings.StatusFilterLabel}
              onStatusChange={handleStatusChange}
              productOptions={productOptions}
              selectedProduct={selectedProduct}
              productFilterLabel={strings.ProductFilterLabel}
              allProductsOptionLabel={strings.AllProductsOptionLabel}
              onProductChange={handleProductChange}
            />
            {!loading && !error ? (
              <div className={styles.statusRow}>
                <Body1>{resultCountText}</Body1>
              </div>
            ) : undefined}
          </div>

          {loading ? (
            <div className={styles.centered}>
              <Spinner label={strings.LoadingMessage} />
            </div>
          ) : undefined}

          {!loading && error ? (
            <div className={styles.errorBox}>
              <Body1>{error}</Body1>
              <Button appearance="primary" icon={<ArrowClockwise24Regular />} onClick={refetch}>
                {strings.ErrorRetryButtonLabel}
              </Button>
            </div>
          ) : undefined}

          {!loading && !error ? (
            <>
              <RoadmapList
                items={pagedItems}
                itemStrings={itemStrings}
                emptyStateMessage={strings.EmptyStateMessage}
                onOpenLink={handleOpenLink}
              />
              {filteredItems.length > 0 ? (
                <RoadmapPagination
                  page={page}
                  totalPages={totalPages}
                  previousLabel={strings.PaginationPreviousLabel}
                  nextLabel={strings.PaginationNextLabel}
                  pageStatusTemplate={strings.PaginationPageStatusTemplate}
                  onPageChange={setPage}
                />
              ) : undefined}
            </>
          ) : undefined}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
