import { ExternalSystem, Person, System } from "./frain-nodes";
import { View } from "./views";

export class ContextView extends View {
    constructor() {
        super();
    }

    public addPerson({
        name,
        description,
    }: {
        name: string;
        description: string;
    }): Person {
        const person = new Person(name, description);
        this.addElement(person);
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
        this.addElement(system);
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
        this.addElement(externalSystem);
        return externalSystem;
    }
}
