import { FrainRelation } from "./frain-relation";
import { NodeType, type FrainNodeJSON } from "./types";
import { creationFrainNodeSchema } from "./validators";

export abstract class FrainNode {
    private id: string;
    private type: NodeType; // This property is for styling.

    private name: string;
    private description: string;
    private technology: string;

    private relations: FrainRelation[];

    constructor(
        name: string,
        description: string,
        technology: string,
        type: NodeType,
    ) {
        creationFrainNodeSchema.parse({
            name,
            description,
            technology,
            type,
        });

        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.technology = technology;
        this.type = type;

        this.relations = [];
    }

    public use(
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

    public getRelations(): FrainRelation[] {
        return this.relations;
    }
    public getId(): string {
        return this.id;
    }
    public toJson(): FrainNodeJSON {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            technology: this.technology,
        };
    }
    public setType(type: NodeType): void {
        this.type = type;
    }
}

export class Person extends FrainNode {
    constructor(name: string, description: string) {
        super(name, description, "Person", NodeType.Person);
    }
}

export class System extends FrainNode {
    constructor(name: string, description: string) {
        super(name, description, "System", NodeType.System);
    }
}

export class ExternalSystem extends FrainNode {
    constructor(name: string, description: string) {
        super(name, description, "ExternalSystem", NodeType.ExternalSystem);
    }
}

export class Container extends FrainNode {
    constructor(name: string, description: string, technology: string) {
        super(name, description, technology, NodeType.Container);
    }
}

export class Component extends FrainNode {
    constructor(name: string, description: string, technology: string) {
        super(name, description, technology, NodeType.Component);
    }
}
