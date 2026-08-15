import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';
import type { SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';

import CopilotM365Roadmap from './components/CopilotM365Roadmap';
import type { ICopilotM365RoadmapProps } from './components/ICopilotM365RoadmapProps';
import type { ICopilotM365RoadmapCopilotComponentProperties } from './CopilotM365RoadmapCopilotComponentProperties';

import * as strings from 'CopilotM365RoadmapCopilotComponentStrings';

/**
 * SPFx Copilot Component that renders a searchable, filterable browser for
 * Microsoft 365 roadmap features sourced from the public Release
 * Communications API.
 *
 * - **Host context & theming** — reads `hostContext.theme` and
 *   `hostContext.displayMode` to adapt to the Copilot host environment.
 *
 * - **Bridge actions** — uses `openLinkAsync` to open roadmap detail links,
 *   and `requestDisplayModeAsync`/`requestSizeChangeAsync` to expand/resize.
 *
 * Lifecycle:
 *  1. `render()` — mounts the React tree into `this.context.domElement`.
 *     Re-invoked by the framework on host-context changes. Data fetching is
 *     owned by the React tree (`useRoadmapData`), not this lifecycle method.
 *  2. `onTeardown()` — unmounts React before the host tears down the iframe.
 */
export default class CopilotM365RoadmapCopilotComponent extends BaseCopilotComponent<ICopilotM365RoadmapCopilotComponentProperties> {
  protected render(): void {
    const props: ICopilotM365RoadmapProps = {
      hostContext: this.hostContext,
      bridge: this.context.copilotBridge,
      onRequestDisplayMode: async (mode: SPCopilotDisplayMode) => {
        await this.requestDisplayModeAsync(mode);
      },
      onRequestSizeChange: async (width: number, height: number) => {
        await this.requestSizeChangeAsync(width, height);
      },
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };

    ReactDOM.render(React.createElement(CopilotM365Roadmap, props), this.context.domElement);
  }

  protected async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
