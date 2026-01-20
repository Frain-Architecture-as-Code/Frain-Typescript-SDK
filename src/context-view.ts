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
    }) {
        const person = new Person(name, description);
        this.addElement(person);
    }

    public addSystem({
        name,
        description,
    }: {
        name: string;
        description: string;
    }) {
        const system = new System(name, description);
        this.addElement(system);
    }

    public addExternalSystem({
        name,
        description,
    }: {
        name: string;
        description: string;
    }) {
        const externalSystem = new ExternalSystem(name, description);
        this.addElement(externalSystem);
    }
}
