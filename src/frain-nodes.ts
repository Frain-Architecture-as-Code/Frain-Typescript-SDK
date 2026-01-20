import { FrainRelation } from "./frain-relation";

export abstract class FrainNode {
    private id: string;

    private name: string;
    private description: string;
    private technology: string;

    private relations: FrainRelation[];

    constructor(name: string, description: string, technology: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.technology = technology;

        this.relations = [];
    }

    private use(
        target: FrainNode,
        description: string,
        technology: string,
    ): FrainRelation {
        const relation = new FrainRelation(
            this.id,
            target.id,
            description,
            technology,
        );
        this.relations.push(relation);
        return relation;
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
