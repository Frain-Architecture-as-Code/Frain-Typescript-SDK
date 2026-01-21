import type { Frain } from "./frain";
import type { FrainNode } from "./frain-nodes";
import type { View } from "./views";

export class FrainBuilder {
    private nodes: Map<string, FrainNode>;

    constructor() {
        this.nodes = new Map<string, FrainNode>();
    }

    public buildFrom(frain: Frain) {
        // Get all nodes from all views
        const views = frain.getViews();

        views.forEach((view) => {
            this.getNodesFromView(view);
        });
    }

    protected getNodesFromView(view: View) {
        const viewNodes = view.getNodes();

        viewNodes.forEach((node) => {
            this.nodes.set(node.getId(), node);
        });
    }
}
