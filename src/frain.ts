import type z from "zod";
import { ComponentView } from "./component-view";
import { ContainerView } from "./container-view";
import { ContextView } from "./context-view";
import type { Component, System } from "./frain-nodes";
import { frainConfigSchema } from "./validators";
import type { View } from "./views";

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

    public createContextView(): ContextView {
        const context = new ContextView();
        this.views.push(context);

        return context;
    }

    public createContainerView(system: System): ContainerView {
        const container = new ContainerView(system);
        this.views.push(container);

        return container;
    }

    public createComponentView(component: Component): ComponentView {
        const componentView = new ComponentView(component);
        this.views.push(componentView);

        return componentView;
    }

    public getViews(): View[] {
        return this.views;
    }

    public build() {
        return {
            title: this.title,
            description: this.description,
            views: this.views.map((view) => view.toJson()),
        };
    }

    public deploy() {
        // Implement deployment logic here
    }
}
