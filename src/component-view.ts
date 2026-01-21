import { Component, Container } from "./frain-nodes";
import { ViewType, type FrainViewJSON } from "./types";
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

    override toJson(): FrainViewJSON {
        const { name: componentName, id } = this.container.toJson();
        const { nodes, relations, idMap } = this.processNodesAndRelations();

        return {
            type: this.type,
            name: componentName,
            mainNodeId: idMap.get(id) ?? id,
            nodes,
            relations,
        };
    }
}
