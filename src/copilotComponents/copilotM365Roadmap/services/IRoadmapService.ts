import type { IRoadmapItem } from '../models/IRoadmapItem';

export interface IRoadmapService {
  /** Fetches all Microsoft 365 roadmap items, caching the result for the session. */
  fetchRoadmapItems(): Promise<IRoadmapItem[]>;
}
