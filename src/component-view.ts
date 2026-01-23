import { Component, Container } from "./frain-nodes";
import { ViewType, type FrainViewJSON } from "./types";
import { View } from "./view";

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

    override toJson(): FrainViewJSON {
        const { name, description, technology } = this.container.toJson();
        const { nodes, externalNodes, relations } =
            this.processNodesAndRelations();

        return {
            type: this.type,
            container: {
                name,
                description,
                technology,
            },
            name,
            nodes,
            externalNodes,
            relations,
        };
    }
}
