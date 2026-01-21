import type { FrainNode } from "./frain-nodes";
import type { FrainRelationJSON, FrainViewJSON, ViewType } from "./types";
import { viewTypeSchema } from "./validators";

export abstract class View {
    protected nodes: FrainNode[];
    protected type: ViewType;

    constructor(type: ViewType) {
        viewTypeSchema.parse(type);
        this.nodes = [];
        this.type = type;
    }

    protected addNode(element: FrainNode): void {
        this.nodes.push(element);
    }

    public addNodes(nodes: FrainNode[]): void {
        this.nodes.push(...nodes);
    }

    public getNodes(): FrainNode[] {
        return this.nodes;
    }

    protected getRelationsJSON(): FrainRelationJSON[] {
        const nodeIds = new Set(this.nodes.map((node) => node.getId()));
        const relations: FrainRelationJSON[] = [];

        for (const node of this.nodes) {
            for (const relation of node.getRelations()) {
                if (nodeIds.has(relation.getTargetId())) {
                    relations.push(relation.toJson());
                }
            }
        }
        return relations;
    }

    abstract toJson(): FrainViewJSON;
}
