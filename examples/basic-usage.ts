import { Frain } from "../src/frain";

function main() {
    const frain = new Frain({ apiKey: "asdasd", projectId: "asdasd" });

    const context = frain.createContextView();

    context.addPerson({
        name: "John Doe",
        description: "A person",
    });

    context.addSystem({
        name: "System A",
        description: "A system",
    });

    context.addExternalSystem({
        name: "External System A",
        description: "An external system",
    });
}

main();
