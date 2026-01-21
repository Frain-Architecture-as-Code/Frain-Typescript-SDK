import { Component, Container } from "./frain-nodes";
import { View } from "./views";

export class ComponentView extends View {
    private container: Container;
    constructor(container: Container) {
        super();
        this.container = container;
    }

    private addComponent({
        name,
        description,
        technology,
    }: {
        name: string;
        description: string;
        technology: string;
    }): Component {
        const component = new Component(name, description, technology);
        this.addNode(component);
        return component;
    }
}
