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

    protected processNodesAndRelations(): {
        nodes: FrainNodeJSON[];
        relations: FrainRelationJSON[];
        idMap: Map<string, string>;
    } {
        const idMap = new Map<string, string>();
        for (const node of this.nodes) {
            idMap.set(node.getId(), crypto.randomUUID());
        }

        const nodes = this.nodes.map((node) => {
            const json = node.toJson();
            json.id = idMap.get(node.getId())!;
            return json;
        });

        const relations: FrainRelationJSON[] = [];

        for (const node of this.nodes) {
            for (const relation of node.getRelations()) {
                if (idMap.has(relation.getTargetId())) {
                    const json = relation.toJson();
                    json.sourceId = idMap.get(node.getId())!;
                    json.targetId = idMap.get(relation.getTargetId())!;
                    relations.push(json);
                }
            }
        }
        return { nodes, relations, idMap };
    }

    abstract toJson(): FrainViewJSON;
}
