import * as React from 'react';
import { Dropdown, Option, makeStyles, tokens } from '@fluentui/react-components';
import type { DropdownProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap'
  },
  dropdown: {
    minWidth: '180px'
  }
});

export interface IRoadmapFiltersProps {
  statusOptions: string[];
  selectedStatuses: string[];
  statusFilterLabel: string;
  onStatusChange: (statuses: string[]) => void;

  productOptions: string[];
  selectedProduct: string | undefined;
  productFilterLabel: string;
  allProductsOptionLabel: string;
  onProductChange: (product: string | undefined) => void;
}

/** Status (multi-select) and Product (single-select) filter dropdowns for the roadmap list. */
export default function RoadmapFilters(props: IRoadmapFiltersProps): React.ReactElement {
  const styles = useStyles();

  const handleStatusChange: DropdownProps['onOptionSelect'] = React.useCallback(
    (_ev, data) => {
      props.onStatusChange(data.selectedOptions);
    },
    [props]
  );

  const handleProductChange: DropdownProps['onOptionSelect'] = React.useCallback(
    (_ev, data) => {
      const [selected] = data.selectedOptions;
      props.onProductChange(selected === props.allProductsOptionLabel ? undefined : selected);
    },
    [props]
  );

  return (
    <div className={styles.root}>
      <Dropdown
        className={styles.dropdown}
        aria-label={props.statusFilterLabel}
        placeholder={props.statusFilterLabel}
        multiselect
        selectedOptions={props.selectedStatuses}
        value={props.selectedStatuses.join(', ')}
        onOptionSelect={handleStatusChange}
      >
        {props.statusOptions.map((status) => (
          <Option key={status} value={status}>
            {status}
          </Option>
        ))}
      </Dropdown>

      <Dropdown
        className={styles.dropdown}
        aria-label={props.productFilterLabel}
        placeholder={props.productFilterLabel}
        selectedOptions={props.selectedProduct ? [props.selectedProduct] : [props.allProductsOptionLabel]}
        value={props.selectedProduct || props.allProductsOptionLabel}
        onOptionSelect={handleProductChange}
      >
        <Option key="__all__" value={props.allProductsOptionLabel}>
          {props.allProductsOptionLabel}
        </Option>
        {props.productOptions.map((product) => (
          <Option key={product} value={product}>
            {product}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
}
