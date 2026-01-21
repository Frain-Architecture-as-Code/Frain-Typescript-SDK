import type { FrainNode } from "./frain-nodes";
import type { FrainViewJSON, ViewType } from "./types";

export abstract class View {
    protected nodes: FrainNode[];
    protected type: ViewType;

    constructor(type: ViewType) {
        this.nodes = [];
        this.type = type;
    }

    protected addNode(element: FrainNode): void {
        this.nodes.push(element);
    }

    public addNodes(nodes: FrainNode[]): void {
        this.nodes.push(...nodes);
    }

    public getNodes(): FrainNode[] {
        return this.nodes;
    }

    abstract toJson(): FrainViewJSON;
}
