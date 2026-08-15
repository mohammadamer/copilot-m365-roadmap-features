import type { IRoadmapApiItem } from './RoadmapApiResponse';

/** Known roadmap lifecycle statuses; API may also return other free-text values. */
export type RoadmapStatus = 'In development' | 'Rolling out' | 'Launched' | 'Cancelled' | string;

/** Normalized, UI-friendly representation of a single Microsoft 365 roadmap feature. */
export interface IRoadmapItem {
  id: number;
  title: string;
  description: string;
  moreInfoLink: string | undefined;
  publicDisclosureAvailabilityDate: string;
  publicPreviewDate: string;
  created: string;
  modified: string;
  status: RoadmapStatus;
  products: string[];
  cloudInstances: string[];
  releasePhase: string[];
  platforms: string[];
}

function mapTagNames(tags: { tagName: string }[] | undefined): string[] {
  return tags ? tags.map((tag) => tag.tagName) : [];
}

/** Builds the deep link to a feature's page on the public Microsoft 365 roadmap site. */
export function getRoadmapFeatureUrl(id: number): string {
  return `https://www.microsoft.com/microsoft-365/roadmap?featureid=${id}`;
}

/** Maps a raw API item to the normalized shape used throughout the UI. */
export function mapRoadmapApiItem(raw: IRoadmapApiItem): IRoadmapItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description || '',
    moreInfoLink: raw.moreInfoLink || undefined,
    publicDisclosureAvailabilityDate: raw.publicDisclosureAvailabilityDate || '',
    publicPreviewDate: raw.publicPreviewDate || '',
    created: raw.created || '',
    modified: raw.modified || '',
    status: raw.status || 'In development',
    products: mapTagNames(raw.tagsContainer?.products),
    cloudInstances: mapTagNames(raw.tagsContainer?.cloudInstances),
    releasePhase: mapTagNames(raw.tagsContainer?.releasePhase),
    platforms: mapTagNames(raw.tagsContainer?.platforms)
  };
}
