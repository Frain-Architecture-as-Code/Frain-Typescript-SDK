import { describe, expect, test } from "bun:test";
import { Frain } from "../src/frain";
import { NodeType } from "../src/types";
import { frainOutputSchema } from "../src/validators";

describe("Frain SDK Generation", () => {
    test("should generate a valid JSON structure with relations", () => {
        // Setup
        const frain = new Frain({
            apiKey: "test-api-key",
            projectId: "123e4567-e89b-12d3-a456-426614174000",
            title: "Test Architecture",
            description: "Testing the Frain SDK",
        });

        // Context View
        const context = frain.createContextView();

        const user = context.addPerson({
            name: "User",
            description: "A regular user",
        });

        const system = context.addSystem({
            name: "My System",
            description: "The main system",
        });

        const external = context.addExternalSystem({
            name: "External API",
            description: "3rd party provider",
        });

        // Relations in Context
        user.use(system, "Uses", "HTTPS");
        system.use(external, "Calls", "JSON/REST");

        // Container View
        const containerView = frain.createContainerView(system);

        const webApp = containerView.addContainer({
            name: "Web App",
            description: "Frontend",
            technology: "React",
        });

        const api = containerView.addContainer({
            name: "Backend API",
            description: "Backend",
            technology: "Node.js",
        });

        const db = containerView.addContainer({
            name: "Database",
            description: "Primary DB",
            technology: "PostgreSQL",
        });

        db.setType(NodeType.Database);

        // Relations in Container
        webApp.use(api, "API Calls", "HTTPS");
        api.use(db, "Reads/Writes", "TCP");
        api.use(external, "Syncs with", "REST");
        
        // Add external nodes to view to make relations visible
        containerView.addNodes([user, external]);
        user.use(webApp, "Visits", "Browser");

        // Component View
        const componentView = frain.createComponentView(api);
        
        const controller = componentView.addComponent({
            name: "UserController",
            description: "Handles user requests",
            technology: "Express",
        });
        
        const service = componentView.addComponent({
            name: "UserService",
            description: "Business logic",
            technology: "Service Class",
        });

        controller.use(service, "Delegates to", "Method Call");
        
        // Build
        const result = frain.build();

        // Validation
        const validationResult = frainOutputSchema.safeParse(result);

        if (!validationResult.success) {
            console.error("Validation Error:", JSON.stringify(validationResult.error.format(), null, 2));
        }

        expect(validationResult.success).toBe(true);
        if (validationResult.success) {
             const data = validationResult.data;
             expect(data.title).toBe("Test Architecture");
             expect(data.views).toHaveLength(3);
             
             // Check Context View Relations
             const contextView = data.views.find(v => v.type === "CONTEXT");
             expect(contextView).toBeDefined();
             // User -> System, System -> External
             expect(contextView?.relations).toHaveLength(2);

             // Check Container View Relations
             const contView = data.views.find(v => v.type === "CONTAINER");
             expect(contView).toBeDefined();
             // WebApp -> API, API -> DB, API -> External, User -> WebApp
             expect(contView?.relations).toHaveLength(4);
        }
    });
});
