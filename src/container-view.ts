import { Container, type System } from "./frain-nodes";
import { View } from "./views";

export class ContainerView extends View {
    private system: System;

    constructor(system: System) {
        super();
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
        this.addElement(container);
        return container;
    }
}
