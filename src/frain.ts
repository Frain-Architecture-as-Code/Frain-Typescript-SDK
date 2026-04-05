import z from "zod";
import { ComponentView } from "./component-view";
import { ContainerView } from "./container-view";
import { ContextView } from "./context-view";
import type { Component, System } from "./frain-nodes";
import { frainConfigSchema } from "./validators";
import type { View } from "./view";
import axios from "axios";
import type {
    BackendModel,
    FrainNodeJSON,
    FrainRelationJSON,
    FrainViewJSON,
    SdkPayload,
} from "./types";

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            console.error(
                "Response body:",
                JSON.stringify(error.response?.data, null, 4),
            );
        }
        return { status: error.response?.status ?? 500 };
    },
);

export class Frain {
    private projectId: string;
    private apiKey: string;
    private frainApiUrl: string;

    private title: string;
    private description: string;

    private views: View[];

    constructor(config: z.infer<typeof frainConfigSchema>) {
        const validated = frainConfigSchema.parse(config);

        this.projectId = validated.projectId;
        this.apiKey = validated.apiKey;
        this.description = validated.description;
        this.title = validated.title;
        this.frainApiUrl =
            validated.frainApiUrl ?? "https://frain-api.vercel.app";

        this.views = [];
    }

    private async writePayload(result: any) {
        const content = JSON.stringify(result, null, 4);

        if (typeof (globalThis as any).Bun !== "undefined") {
            await (globalThis as any).Bun.write("output.json", content);
        } else {
            const { writeFile } = await import("fs/promises");
            await writeFile("output.json", content, "utf-8");
        }
    }

    private async mergeC4Model(
        currentModel: SdkPayload,
        backendModel: SdkPayload | null,
    ): Promise<SdkPayload> {
        if (backendModel === null) {
            console.log("No backend model found, returning current model");
            return currentModel;
        }

        const updatedViews = currentModel.views.map((incomingView) => {
            const existingView = backendModel.views.find(
                (v) =>
                    v.name === incomingView.name &&
                    v.type === incomingView.type,
            );

            const viewId = existingView ? existingView.id : incomingView.id;
            const nodeIdTranslationMap = new Map<string, string>();

            const processNodes = (
                incomingNodes: FrainNodeJSON[],
                existingNodes: FrainNodeJSON[] = [],
            ): FrainNodeJSON[] => {
                return incomingNodes.map((incomingNode) => {
                    const existingNode = existingNodes.find(
                        (n) =>
                            n.name === incomingNode.name &&
                            n.type === incomingNode.type,
                    );

                    let nodeId = incomingNode.id;

                    const finalX = existingNode
                        ? existingNode.x
                        : (incomingNode.x ?? 0);
                    const finalY = existingNode
                        ? existingNode.y
                        : (incomingNode.y ?? 0);

                    if (existingNode) {
                        nodeId = existingNode.id;
                    }

                    nodeIdTranslationMap.set(incomingNode.id, nodeId);

                    return {
                        id: nodeId,
                        type: incomingNode.type,
                        name: incomingNode.name,
                        description: incomingNode.description,
                        technology: incomingNode.technology,
                        viewId,
                        x: finalX,
                        y: finalY,
                    } as FrainNodeJSON;
                });
            };

            const updatedNodes = processNodes(
                incomingView.nodes,
                existingView?.nodes,
            );
            const updatedExternalNodes = processNodes(
                incomingView.externalNodes,
                existingView?.externalNodes,
            );

            const updatedRelations = incomingView.relations.map(
                (incomingRel) => {
                    const resolvedSourceId =
                        nodeIdTranslationMap.get(incomingRel.sourceId) ||
                        incomingRel.sourceId;
                    const resolvedTargetId =
                        nodeIdTranslationMap.get(incomingRel.targetId) ||
                        incomingRel.targetId;

                    return {
                        sourceId: resolvedSourceId,
                        targetId: resolvedTargetId,
                        description: incomingRel.description,
                        technology: incomingRel.technology,
                    } as FrainRelationJSON;
                },
            );

            return {
                id: viewId,
                type: incomingView.type,
                container: incomingView.container,
                name: incomingView.name,
                nodes: updatedNodes,
                externalNodes: updatedExternalNodes,
                relations: updatedRelations,
            } as FrainViewJSON;
        });

        console.log("✅ Model merged");

        return {
            title: currentModel.title,
            description: currentModel.description,
            updatedAt: currentModel.updatedAt,
            views: updatedViews,
        } as SdkPayload;
    }

    public async fetchModelFromBackend(): Promise<SdkPayload> {
        console.log("Fetching model from backend...");
        const response = await axios.get<BackendModel>(
            `${this.frainApiUrl}/api/v1/c4models/projects/${this.projectId}`,
            {
                headers: {
                    "Frain-Api-Key": this.apiKey,
                },
            },
        );
        console.log("Backend model fetched");

        return response.data.c4Model;
    }

    public createContextView(): ContextView {
        const context = new ContextView();
        this.views.push(context);
        return context;
    }

    public createContainerView(system: System): ContainerView {
        const containerView = new ContainerView(system);
        this.views.push(containerView);

        system.setViewId(containerView.getId());

        return containerView;
    }

    public createComponentView(component: Component): ComponentView {
        const componentView = new ComponentView(component);
        this.views.push(componentView);

        component.setViewId(componentView.getId());
        return componentView;
    }

    public getViews(): View[] {
        return this.views;
    }

    public async build(): Promise<SdkPayload> {
        console.log("Building...");

        const payload = {
            title: this.title,
            description: this.description,
            updatedAt: new Date(),
            views: this.views.map((view) => {
                const viewJson = view.toJson();
                console.log(
                    "Building: ",
                    viewJson.name ? viewJson.name : "Context View",
                );
                return viewJson;
            }),
        };

        await this.writePayload(payload);

        console.log("✅ Build completed");
        return payload;
    }

    public async deploy() {
        const payload = await this.build();
        const parsedUrl = `${this.frainApiUrl}/api/v1/c4models/projects/${this.projectId}/sdk`;

        const backendModel = await this.fetchModelFromBackend();

        const mergedModel = await this.mergeC4Model(payload, backendModel);

        console.log("Deploying...");
        console.log("Deploying to ", parsedUrl);

        const result = await axios.put(parsedUrl, mergedModel, {
            headers: {
                "Frain-Api-Key": this.apiKey,
                "Content-Type": "application/json",
            },
        });

        if (result.status === 200) {
            console.log("🚀 Deployment successful");
        } else {
            console.error(`❌ Deployment failed with status ${result.status}`);
        }

        return result;
    }
}
