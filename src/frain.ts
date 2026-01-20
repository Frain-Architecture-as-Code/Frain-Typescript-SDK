import { ContainerView } from "./container-view";
import { ContextView } from "./context-view";
import type { System } from "./frain-nodes";
import type { FrainConfig } from "./types";
import type { View } from "./views";

export class Frain {
    private projectId: string;
    private apiKey: string;

    private views: View[];

    constructor({ projectId, apiKey }: FrainConfig) {
        this.projectId = projectId;
        this.apiKey = apiKey;
        this.views = [];
    }

    public createContextView(): ContextView {
        const context = new ContextView();
        this.views.push(context);

        return context;
    }

    public createContainerView(system: System): ContainerView {
        const container = new ContainerView(system);
        this.views.push(container);

        return container;
    }

    public build() {
        // TODO: Implement build method
    }

    public deploy() {
        // TODO: Implement deploy method
    }
}
