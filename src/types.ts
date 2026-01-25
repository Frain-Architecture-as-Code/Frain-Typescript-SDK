export interface FrainConfig {
    projectId: string;
    apiKey: string;
    title: string;
    description: string;
}

export enum ViewType {
    Context = "CONTEXT",
    Container = "CONTAINER",
    Component = "COMPONENT",
}

export enum NodeType {
    Person = "PERSON",
    System = "SYSTEM",
    ExternalSystem = "EXTERNAL_SYSTEM",

    Database = "DATABASE",
    WebApp = "WEB_APP",
    Container = "CONTAINER",
    Component = "COMPONENT",
}

export interface FrainNodeJSON {
    id: string;
    type: NodeType;
    name: string;
    description: string;
    technology: string;
    viewId: string | null;
    x: number;
    y: number;
}

export interface FrainRelationJSON {
    sourceId: string;
    targetId: string;
    description: string;
    technology: string;
}

export interface FrainViewJSON {
    id: string;
    type: ViewType;
    container?: {
        name: string;
        description: string;
        technology: string;
    };
    name: string;
    nodes: FrainNodeJSON[];
    externalNodes: FrainNodeJSON[];
    relations: FrainRelationJSON[];
}
