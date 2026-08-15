import * as React from 'react';
import { Input, makeStyles, tokens } from '@fluentui/react-components';
import { Search24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  input: {
    flexGrow: 1
  }
});

export interface IRoadmapSearchBarProps {
  value: string;
  placeholder: string;
  ariaLabel: string;
  clearButtonAriaLabel: string;
  onChange: (value: string) => void;
}

/** Debounced free-text search input for filtering roadmap items by ID or title. */
export default function RoadmapSearchBar(props: IRoadmapSearchBarProps): React.ReactElement {
  const styles = useStyles();
  const [localValue, setLocalValue] = React.useState<string>(props.value);
  const { onChange } = props;

  React.useEffect(() => {
    const handle = setTimeout(() => onChange(localValue), 250);
    return () => clearTimeout(handle);
  }, [localValue, onChange]);

  const handleClear = React.useCallback(() => {
    setLocalValue('');
  }, []);

  return (
    <div className={styles.root} role="search">
      <Input
        className={styles.input}
        contentBefore={<Search24Regular />}
        contentAfter={
          localValue ? (
            <Button
              appearance="transparent"
              icon={<Dismiss24Regular />}
              aria-label={props.clearButtonAriaLabel}
              onClick={handleClear}
            />
          ) : undefined
        }
        value={localValue}
        placeholder={props.placeholder}
        aria-label={props.ariaLabel}
        onChange={(_ev, data) => setLocalValue(data.value)}
      />
    </div>
  );
}
