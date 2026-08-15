/**
 * Raw shape returned by the Microsoft 365 Release Communications API
 * (https://www.microsoft.com/releasecommunications/api/v1/m365).
 */
export interface IRoadmapApiTag {
  tagName: string;
}

export interface IRoadmapApiTagsContainer {
  products?: IRoadmapApiTag[];
  cloudInstances?: IRoadmapApiTag[];
  releasePhase?: IRoadmapApiTag[];
  platforms?: IRoadmapApiTag[];
}

export interface IRoadmapApiItem {
  id: number;
  title: string;
  description: string;
  moreInfoLink: string | undefined;
  publicDisclosureAvailabilityDate: string;
  publicPreviewDate: string;
  created: string;
  publicRoadmapStatus: string;
  status: string;
  modified: string;
  locale: string | undefined;
  tags?: IRoadmapApiTag[];
  tagsContainer?: IRoadmapApiTagsContainer;
}
