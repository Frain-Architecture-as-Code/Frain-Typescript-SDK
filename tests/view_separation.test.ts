import { describe, expect, test } from "bun:test";
import { Frain } from "../src/frain";
import { Person, System } from "../src/frain-nodes";

describe("View Node Separation", () => {
    test("should separate internal and external nodes", () => {
        const frain = new Frain({
            projectId: "123e4567-e89b-12d3-a456-426614174000",
            apiKey: "key",
            title: "Test",
            description: "Desc",
        });

        const context = frain.createContextView();

        // Internal nodes (added via specific methods which call addNode)
        const user = context.addPerson({
            name: "User",
            description: "Internal User",
        });
        const system = context.addSystem({
            name: "System",
            description: "Internal System",
        });

        // External nodes (added via addNodes)
        const externalUser = new Person("External User", "Outside");
        context.addNodes([externalUser]);

        // Check counts
        expect(context.getInternalNodes()).toHaveLength(2);
        expect(context.getExternalNodes()).toHaveLength(1);
        expect(context.getNodes()).toHaveLength(3);

        // Verify content
        const internalNames = context
            .getInternalNodes()
            .map((n) => n.toJson().name);
        expect(internalNames).toContain("User");
        expect(internalNames).toContain("System");
        expect(internalNames).not.toContain("External User");

        const externalNames = context
            .getExternalNodes()
            .map((n) => n.toJson().name);
        expect(externalNames).toContain("External User");
        expect(externalNames).not.toContain("User");
    });

    test("should include separate nodes and externalNodes in JSON output", () => {
        const frain = new Frain({
            projectId: "123e4567-e89b-12d3-a456-426614174000",
            apiKey: "key",
            title: "Test",
            description: "Desc",
        });

        const context = frain.createContextView();
        const user = context.addPerson({
            name: "User",
            description: "Internal",
        });
        const external = new Person("External", "External");
        context.addNodes([external]);

        const json = context.toJson();
        expect(json.nodes).toHaveLength(1);
        expect(json.externalNodes).toHaveLength(1);

        const nodeNames = json.nodes.map((n) => n.name);
        expect(nodeNames).toContain("User");
        expect(nodeNames).not.toContain("External");

        const externalNodeNames = json.externalNodes.map((n) => n.name);
        expect(externalNodeNames).toContain("External");
        expect(externalNodeNames).not.toContain("User");
    });
});
