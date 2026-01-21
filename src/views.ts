import type { FrainNode } from "./frain-nodes";
import type { ViewType } from "./types";

export abstract class View {
    private elements: FrainNode[];
    private tag: ViewType;

    constructor(tag: ViewType) {
        this.elements = [];
        this.tag = tag;
    }

    protected addNode(element: FrainNode): void {
        this.elements.push(element);
    }

    public addNodes(elements: FrainNode[]): void {
        this.elements.push(...elements);
    }

    public getNodes(): FrainNode[] {
        return this.elements;
    }

    abstract toJson(): any;
}
