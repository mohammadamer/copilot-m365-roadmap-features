import type {
  ICopilotComponentHostContext,
  ISPCopilotBridge,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';

export interface ICopilotM365RoadmapStrings {
  ExpandButtonLabel: string;
  CompactButtonLabel: string;
  SearchPlaceholder: string;
  SearchAriaLabel: string;
  ClearSearchButtonLabel: string;
  StatusFilterLabel: string;
  ProductFilterLabel: string;
  AllProductsOptionLabel: string;
  ResultCountTemplate: string;
  LoadingMessage: string;
  ErrorRetryButtonLabel: string;
  EmptyStateMessage: string;
  OpenLinkButtonLabel: string;
  ViewOnRoadmapButtonLabel: string;
  PublicPreviewDateLabel: string;
  GeneralAvailabilityDateLabel: string;
  LastUpdatedLabel: string;
  PlatformsLabel: string;
  CloudInstancesLabel: string;
  ProductsLabel: string;
  NoValuePlaceholder: string;
  PaginationPreviousLabel: string;
  PaginationNextLabel: string;
  PaginationPageStatusTemplate: string;
}

export interface ICopilotM365RoadmapProps {
  /** Host context (theme, display mode) from the Copilot host. */
  hostContext: ICopilotComponentHostContext;
  /** Bridge to communicate with the Copilot host (public API surface). */
  bridge: ISPCopilotBridge;
  /** Request the host to change display mode (e.g. 'fullscreen'). */
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  /** Request the host to resize the component iframe. */
  onRequestSizeChange: (width: number, height: number) => Promise<void>;
  /**
   * Document the FluentProvider should inject its theme styles into. Pass
   * `domElement.ownerDocument` so Griffel writes CSS into the correct iframe
   * document rather than the top-level page.
   */
  targetDocument: Document | undefined;
  /** Localized strings for UI labels. */
  strings: ICopilotM365RoadmapStrings;
}
