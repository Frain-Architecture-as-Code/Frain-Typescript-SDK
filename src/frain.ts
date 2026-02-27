import z from "zod";
import { ComponentView } from "./component-view";
import { ContainerView } from "./container-view";
import { ContextView } from "./context-view";
import type { Component, System } from "./frain-nodes";
import { frainConfigSchema } from "./validators";
import type { View } from "./view";
import axios from "axios";

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

    public async build() {
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

        console.log("Deploying...");
        console.log("Deploying to ", parsedUrl);

        const result = await axios.put(parsedUrl, payload, {
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
