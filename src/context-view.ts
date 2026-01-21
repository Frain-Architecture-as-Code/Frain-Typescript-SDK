import { ExternalSystem, Person, System } from "./frain-nodes";
import { ViewType, type FrainViewJSON } from "./types";
import { View } from "./views";

export class ContextView extends View {
    constructor() {
        super(ViewType.Context);
    }

    public addPerson({
        name,
        description,
    }: {
        name: string;
        description: string;
    }): Person {
        const person = new Person(name, description);
        this.addNode(person);
        return person;
    }

    public addSystem({
        name,
        description,
    }: {
        name: string;
        description: string;
    }): System {
        const system = new System(name, description);
        this.addNode(system);
        return system;
    }

    public addExternalSystem({
        name,
        description,
    }: {
        name: string;
        description: string;
    }): ExternalSystem {
        const externalSystem = new ExternalSystem(name, description);
        this.addNode(externalSystem);
        return externalSystem;
    }

    override toJson(): FrainViewJSON {
        return {
            type: this.type,
            mainNodeId: "",
            name: "",
            nodes: this.nodes.map((node) => node.toJson()),
        };
    }
}
