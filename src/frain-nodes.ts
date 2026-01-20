export abstract class FrainNode {
    private id: string;

    private name: string;
    private description: string;
    private technology: string;

    constructor(name: string, description: string, technology: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.technology = technology;
    }
}

export class Person extends FrainNode {
    constructor(name: string, description: string) {
        super(name, description, "Person");
    }
}

export class System extends FrainNode {
    constructor(name: string, description: string) {
        super(name, description, "System");
    }
}

export class ExternalSystem extends FrainNode {
    constructor(name: string, description: string) {
        super(name, description, "ExternalSystem");
    }
}

export class Container extends FrainNode {
    constructor(name: string, description: string, technology: string) {
        super(name, description, technology);
    }
}

export class Component extends FrainNode {
    constructor(name: string, description: string, technology: string) {
        super(name, description, technology);
    }
}
