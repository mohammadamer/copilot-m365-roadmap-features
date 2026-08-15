import * as React from 'react';
import type { IRoadmapItem } from '../models/IRoadmapItem';
import { RoadmapService, RoadmapFetchError } from '../services/RoadmapService';

export interface IUseRoadmapDataResult {
  items: IRoadmapItem[];
  loading: boolean;
  error: string | undefined;
  refetch: () => void;
}

const roadmapService = new RoadmapService();

/** Fetches Microsoft 365 roadmap items on mount and exposes loading/error state. */
export function useRoadmapData(): IUseRoadmapDataResult {
  const [items, setItems] = React.useState<IRoadmapItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [attempt, setAttempt] = React.useState<number>(0);

  React.useEffect(() => {
    let isCancelled = false;

    setLoading(true);
    setError(undefined);

    roadmapService
      .fetchRoadmapItems()
      .then((result) => {
        if (!isCancelled) {
          setItems(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          console.error('[useRoadmapData] Fetch error:', err);
          const message = err instanceof RoadmapFetchError 
            ? err.message 
            : err instanceof Error
            ? `Roadmap error: ${err.message}`
            : 'An unexpected error occurred while loading the roadmap.';
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [attempt]);

  const refetch = React.useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return { items, loading, error, refetch };
}
