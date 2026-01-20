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
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.description = description;
        this.technology = technology;
    }
}
