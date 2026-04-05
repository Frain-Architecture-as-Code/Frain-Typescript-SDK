import { Frain } from "../../src/frain";

function main() {
    const frain = new Frain({
        title: "Demo",
        description: "Some Description",
        apiKey: "frain_0b4a4b4d83f830584f63f613067eeca9970f2be923ae0560d3b3ddda97bf0668",
        projectId: "ef56b45f-0a6f-4120-aa69-13f898f64be8",
    });

    const context = frain.createContextView();
    const user = context.addPerson({ name: "User", description: "" });
    const developer = context.addPerson({ name: "Developer", description: "" });

    const system = context.addSystem({
        name: "System",
        description: "Some Detailed System",
    });

    const externalSystem = context.addExternalSystem({
        name: "External System",
        description: "Some External thing",
    });

    const cloudProvider = context.addExternalSystem({
        name: "Cloud Provider",
        description: "Some External thing",
    });

    [user, developer].forEach((p) => p.use(system, "Use", ""));
    [externalSystem, cloudProvider].forEach((p) => system.use(p, "Use", ""));

    frain.deploy();
}

main();
