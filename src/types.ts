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
