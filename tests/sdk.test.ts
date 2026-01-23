import { describe, expect, test } from "bun:test";
import { Frain } from "../src/frain";
import {
    Component,
    Container,
    ExternalSystem,
    Person,
    System,
} from "../src/frain-nodes";
import { NodeType } from "../src/types";

describe("Frain SDK Tests", () => {
    describe("Frain Class", () => {
        test("should initialize with valid config", async () => {
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "secret-key",
                title: "My Project",
                description: "Project Description",
            });
            expect(frain).toBeDefined();
            expect(frain.getViews()).toBeEmpty();
            const build = await frain.build();
            expect(build.title).toBe("My Project");
            expect(build.description).toBe("Project Description");
        });

        test("should throw error with invalid projectId", () => {
            expect(() => {
                new Frain({
                    projectId: "invalid-uuid",
                    apiKey: "secret-key",
                    title: "My Project",
                    description: "Project Description",
                });
            }).toThrow();
        });

        test("should throw error with empty apiKey", () => {
            expect(() => {
                new Frain({
                    projectId: "123e4567-e89b-12d3-a456-426614174000",
                    apiKey: "",
                    title: "My Project",
                    description: "Project Description",
                });
            }).toThrow();
        });

        test("should create different views", () => {
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "key",
                title: "Title",
                description: "Desc",
            });

            const context = frain.createContextView();
            expect(context).toBeDefined();

            const system = new System("Sys", "Desc");
            const container = frain.createContainerView(system);
            expect(container).toBeDefined();

            const contNode = new Container("Cont", "Desc", "Tech");
            const component = frain.createComponentView(contNode);
            expect(component).toBeDefined();

            expect(frain.getViews()).toHaveLength(3);
        });
    });

    describe("FrainNode & Subclasses", () => {
        test("should create Person node", () => {
            const person = new Person("Alice", "User");
            const json = person.toJson();
            expect(json.name).toBe("Alice");
            expect(json.type).toBe(NodeType.Person);
        });

        test("should create System node", () => {
            const sys = new System("Core", "Main System");
            const json = sys.toJson();
            expect(json.name).toBe("Core");
            expect(json.type).toBe(NodeType.System);
        });

        test("should create ExternalSystem node", () => {
            const ext = new ExternalSystem("Google", "Auth");
            const json = ext.toJson();
            expect(json.name).toBe("Google");
            expect(json.type).toBe(NodeType.ExternalSystem);
        });

        test("should create Container node", () => {
            const cont = new Container("API", "Backend", "Node");
            const json = cont.toJson();
            expect(json.name).toBe("API");
            expect(json.technology).toBe("Node");
            expect(json.type).toBe(NodeType.Container);
        });

        test("should create Component node", () => {
            const comp = new Component("AuthService", "Logic", "Class");
            const json = comp.toJson();
            expect(json.name).toBe("AuthService");
            expect(json.type).toBe(NodeType.Component);
        });

        test("should validate empty name", () => {
            expect(() => new Person("", "Desc")).toThrow();
        });

        test("should change type using setType", () => {
            const db = new Container("DB", "Data", "SQL");
            expect(db.toJson().type).toBe(NodeType.Container);

            db.setType(NodeType.Database);
            expect(db.toJson().type).toBe(NodeType.Database);
        });

        test("should create relations using use()", () => {
            const p = new Person("P", "D");
            const s = new System("S", "D");

            const rel = p.use(s, "Uses", "HTTP");
            expect(rel).toBeDefined();
            expect(rel.getSourceId()).toBe(p.getId());
            expect(rel.getTargetId()).toBe(s.getId());

            const rels = p.getRelations();
            expect(rels).toHaveLength(1);
            expect(rels[0]).toBe(rel);
        });
    });

    describe("View Logic & Relation Filtering", () => {
        test("ContextView should add context nodes", () => {
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "k",
                title: "t",
                description: "d",
            });
            const view = frain.createContextView();

            view.addPerson({ name: "P", description: "D" });
            view.addSystem({ name: "S", description: "D" });
            view.addExternalSystem({ name: "E", description: "D" });

            expect(view.getNodes()).toHaveLength(3);
            const json = view.toJson();
            expect(json.nodes).toHaveLength(3);
        });

        test("ContainerView should add containers", () => {
            const sys = new System("S", "D");
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "k",
                title: "t",
                description: "d",
            });
            const view = frain.createContainerView(sys);

            view.addContainer({
                name: "C1",
                description: "D",
                technology: "T",
            });
            expect(view.getNodes()).toHaveLength(1);

            const json = view.toJson();
            expect(json.container).toEqual({
                name: "S",
                description: "D",
                technology: "System",
            });
        });

        test("ComponentView should add components", () => {
            const cont = new Container("C", "D", "T");
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "k",
                title: "t",
                description: "d",
            });
            const view = frain.createComponentView(cont);

            view.addComponent({
                name: "Comp1",
                description: "D",
                technology: "T",
            });
            expect(view.getNodes()).toHaveLength(1);

            const json = view.toJson();
            expect(json.container).toEqual({
                name: "C",
                description: "D",
                technology: "T",
            });
        });

        test("should only include relations where target is in view", () => {
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "k",
                title: "t",
                description: "d",
            });
            const view = frain.createContextView();

            const p1 = new Person("P1", "D");
            const s1 = new System("S1", "D");
            const s2 = new System("S2", "Hidden"); // Not added to view

            // Relation 1: P1 -> S1 (Both in view)
            p1.use(s1, "Uses", "HTTP");

            // Relation 2: S1 -> S2 (Target NOT in view)
            s1.use(s2, "Hidden Call", "RPC");

            view.addNodes([p1, s1]);

            const json = view.toJson();

            // Should only have 1 relation (P1 -> S1)
            expect(json.relations).toHaveLength(1);

            // Find the ID of S1 in the generated JSON
            const s1JsonId = [...json.nodes, ...json.externalNodes].find(
                (n) => n.name === "S1",
            )?.id;
            expect(s1JsonId).toBeDefined();
            expect(json.relations[0].targetId).toBe(s1JsonId!);
        });

        test("should include relations added via addNodes from external context", () => {
            // Example: In a Container View, we add a Person from Context to show they use the container
            const sys = new System("S", "D");
            const frain = new Frain({
                projectId: "123e4567-e89b-12d3-a456-426614174000",
                apiKey: "k",
                title: "t",
                description: "d",
            });
            const view = frain.createContainerView(sys);

            const user = new Person("User", "D");
            const webApp = view.addContainer({
                name: "Web",
                description: "D",
                technology: "React",
            });

            user.use(webApp, "Clicks", "Mouse");

            // Initially only webApp is in view
            expect(view.toJson().relations).toHaveLength(0);

            // Add user to view
            view.addNodes([user]);

            // Now relation should be visible
            const json = view.toJson();
            expect(json.relations).toHaveLength(1);

            const userJsonId = [...json.nodes, ...json.externalNodes].find(
                (n) => n.name === "User",
            )?.id;
            const webAppJsonId = [...json.nodes, ...json.externalNodes].find(
                (n) => n.name === "Web",
            )?.id;

            expect(userJsonId).toBeDefined();
            expect(webAppJsonId).toBeDefined();

            expect(json.relations[0].sourceId).toBe(userJsonId!);
            expect(json.relations[0].targetId).toBe(webAppJsonId!);
        });
    });
});
