import type { FrainNode } from "./frain-nodes";

export abstract class View {
    private elements: FrainNode[];

    constructor() {
        this.elements = [];
    }

    protected addElement(element: FrainNode): void {
        this.elements.push(element);
    }

    protected addElements(elements: FrainNode[]): void {
        this.elements.push(...elements);
    }
}
