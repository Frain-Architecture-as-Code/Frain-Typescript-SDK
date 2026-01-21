import type { FrainNode } from "./frain-nodes";

export abstract class View {
    private elements: FrainNode[];

    constructor() {
        this.elements = [];
    }

    protected addNode(element: FrainNode): void {
        this.elements.push(element);
    }

    public addNodes(elements: FrainNode[]): void {
        this.elements.push(...elements);
    }
}
