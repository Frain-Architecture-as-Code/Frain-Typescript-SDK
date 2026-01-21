import type { FrainRelationJSON } from "./types";
import { frainRelationSchema } from "./validators";

export class FrainRelation {
    private sourceId: string;
    private targetId: string;
    private description: string;
    private technology: string;

    constructor(
        sourceId: string,
        targetId: string,
        description: string,
        technology: string,
    ) {
        frainRelationSchema.parse({
            sourceId,
            targetId,
            description,
            technology,
        });

        this.sourceId = sourceId;
        this.targetId = targetId;
        this.description = description;
        this.technology = technology;
    }

    public getSourceId(): string {
        return this.sourceId;
    }

    public getTargetId(): string {
        return this.targetId;
    }

    public toJson(): FrainRelationJSON {
        return {
            sourceId: this.sourceId,
            targetId: this.targetId,
            description: this.description,
            technology: this.technology,
        };
    }
}
