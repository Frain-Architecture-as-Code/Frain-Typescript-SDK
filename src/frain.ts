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

    private title: string;
    private description: string;

    private views: View[];

    constructor(config: z.infer<typeof frainConfigSchema>) {
        const validated = frainConfigSchema.parse(config);

        this.projectId = validated.projectId;
        this.apiKey = validated.apiKey;
        this.description = validated.description;
        this.title = validated.title;

        this.views = [];
    }

    private getUrl() {
        const envVariable = process.env.FRAIN_API_URL;
        if (!envVariable) {
            throw new Error("FRAIN_API_URL environment variable is not set");
        }
        const result = z.url().safeParse(envVariable);
        if (!result.success) {
            throw new Error(`Invalid URL: ${result.error}`);
        }
        return result.data;
    }

    private async writePayload(result: any) {
        await Bun.write("output.json", JSON.stringify(result, null, 4));
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
            views: this.views.map((view) => view.toJson()),
        };

        await this.writePayload(payload);

        console.log("✅ Build completed");
        return payload;
    }

    public async deploy() {
        const payload = await this.build();
        const url = this.getUrl();
        const parsedUrl = `${url}/api/v1/c4/deployments`;

        const result = await axios.put(parsedUrl, payload, {
            headers: {
                "X-Frain-Api-Key": this.apiKey,
                "Content-Type": "application/json",
                "X-Frain-Project-Id": this.projectId,
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
