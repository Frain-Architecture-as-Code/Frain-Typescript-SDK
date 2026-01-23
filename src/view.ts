import type { FrainNode } from "./frain-nodes";
import type {
    FrainNodeJSON,
    FrainRelationJSON,
    FrainViewJSON,
    ViewType,
} from "./types";
import { viewTypeSchema } from "./validators";

export abstract class View {
    protected nodes: FrainNode[];
    protected externalNodes: FrainNode[];
    protected type: ViewType;

    constructor(type: ViewType) {
        viewTypeSchema.parse(type);
        this.nodes = [];
        this.externalNodes = [];
        this.type = type;
    }

    protected addNode(element: FrainNode): void {
        this.nodes.push(element);
    }

    public addNodes(nodes: FrainNode[]): void {
        this.externalNodes.push(...nodes);
    }

    public getNodes(): FrainNode[] {
        return [...this.nodes, ...this.externalNodes];
    }

    public getInternalNodes(): FrainNode[] {
        return this.nodes;
    }

    public getExternalNodes(): FrainNode[] {
        return this.externalNodes;
    }

    protected processNodesAndRelations(): {
        nodes: FrainNodeJSON[];
        externalNodes: FrainNodeJSON[];
        relations: FrainRelationJSON[];
        idMap: Map<string, string>;
    } {
        const idMap = new Map<string, string>();
        const allNodes = [...this.nodes, ...this.externalNodes];

        for (const node of allNodes) {
            idMap.set(node.getId(), crypto.randomUUID());
        }

        const nodes = this.nodes.map((node) => {
            const json = node.toJson();
            json.id = idMap.get(node.getId())!;
            return json;
        });

        const externalNodes = this.externalNodes.map((node) => {
            const json = node.toJson();
            json.id = idMap.get(node.getId())!;
            return json;
        });

        const relations: FrainRelationJSON[] = [];

        for (const node of allNodes) {
            for (const relation of node.getRelations()) {
                if (idMap.has(relation.getTargetId())) {
                    const json = relation.toJson();
                    json.sourceId = idMap.get(node.getId())!;
                    json.targetId = idMap.get(relation.getTargetId())!;
                    relations.push(json);
                }
            }
        }
        return { nodes, externalNodes, relations, idMap };
    }

    abstract toJson(): FrainViewJSON;
}
