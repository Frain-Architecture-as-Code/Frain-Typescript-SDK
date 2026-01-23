import { Container, type System } from "./frain-nodes";
import { ViewType, type FrainViewJSON } from "./types";
import { View } from "./views";

export class ContainerView extends View {
    private system: System;

    constructor(system: System) {
        super(ViewType.Container);
        this.system = system;
    }

    public addContainer({
        name,
        description,
        technology,
    }: {
        name: string;
        description: string;
        technology: string;
    }): Container {
        const container = new Container(name, description, technology);
        this.addNode(container);
        return container;
    }

    override toJson(): FrainViewJSON {
        const { name, description, technology } = this.system.toJson();
        const { nodes, relations } = this.processNodesAndRelations();

        return {
            type: this.type,
            container: {
                name,
                description,
                technology,
            },
            name,
            nodes,
            relations,
        };
    }
}
