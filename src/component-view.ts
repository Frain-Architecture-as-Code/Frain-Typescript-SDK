import { Component, Container } from "./frain-nodes";
import { ViewType } from "./types";
import { View } from "./views";

export class ComponentView extends View {
    private container: Container;

    constructor(container: Container) {
        super(ViewType.Component);
        this.container = container;
    }

    public addComponent({
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

    override toJson() {}
}
