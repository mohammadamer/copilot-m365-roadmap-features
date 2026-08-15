import type { IRoadmapApiItem } from '../models/RoadmapApiResponse';
import { mapRoadmapApiItem, type IRoadmapItem } from '../models/IRoadmapItem';
import type { IRoadmapService } from './IRoadmapService';

const ROADMAP_API_URL = 'https://www.microsoft.com/releasecommunications/api/v1/m365';

/** Thrown when the roadmap API cannot be reached or returns an unexpected payload. */
export class RoadmapFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'RoadmapFetchError';
  }
}

/**
 * Fetches Microsoft 365 roadmap data from the public Release Communications API.
 * The resolved promise is cached for the lifetime of the module so repeated
 * calls within a session don't re-fetch the (large) payload.
 */
export class RoadmapService implements IRoadmapService {
  private static _cachedRequest: Promise<IRoadmapItem[]> | undefined;

  public async fetchRoadmapItems(): Promise<IRoadmapItem[]> {
    if (!RoadmapService._cachedRequest) {
      RoadmapService._cachedRequest = this._fetchFromApi().catch((error) => {
        // Allow a retry on the next call if this attempt failed.
        RoadmapService._cachedRequest = undefined;
        throw error;
      });
    }
    return RoadmapService._cachedRequest;
  }

  private async _fetchFromApi(): Promise<IRoadmapItem[]> {
    let response: Response;
    try {
      response = await fetch(ROADMAP_API_URL, { method: 'GET'});
    } catch (error) {
      console.error('[RoadmapService] Fetch error:', error);
      throw new RoadmapFetchError('Unable to reach the Microsoft 365 roadmap service. Check your network connection.', error);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '(unable to read body)');
      console.error(`[RoadmapService] HTTP ${response.status}:`, errorBody);
      throw new RoadmapFetchError(`Roadmap service returned an unexpected status (${response.status}).`);
    }

    let raw: IRoadmapApiItem[];
    try {
      raw = await response.json();
    } catch (error) {
      console.error('[RoadmapService] JSON parse error:', error);
      throw new RoadmapFetchError('Unable to parse the roadmap service response.', error);
    }

    if (!Array.isArray(raw)) {
      console.error('[RoadmapService] Unexpected response type:', typeof raw, raw);
      throw new RoadmapFetchError('Roadmap service returned an unexpected payload shape.');
    }

    try {
      const mapped = raw.map(mapRoadmapApiItem);
      console.log(`[RoadmapService] Successfully loaded and mapped ${mapped.length} roadmap items`);
      return mapped;
    } catch (error) {
      console.error('[RoadmapService] Mapping error:', error);
      throw new RoadmapFetchError('Unable to process roadmap data.', error);
    }
  }
}
