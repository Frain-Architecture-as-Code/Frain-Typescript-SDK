import { Frain } from "../src/frain";

function main() {
    const frain = new Frain({ apiKey: "asdasd", projectId: "asdasd" });

    const context = frain.createContextView();

    const commonPerson = context.addPerson({
        name: "John Doe",
        description: "A person",
    });

    const frainSystem = context.addSystem({
        name: "Frain",
        description: "A system",
    });

    const paypal = context.addExternalSystem({
        name: "Paypal",
        description: "An external system",
    });

    // TODO: Add Relations

    // Create a container view
    const container = frain.createContainerView(frainSystem);

    container.addContainer({
        name: "Web App",
        description: "A web application",
        technology: "Next Js",
    });

    container.addContainer({
        name: "API",
        description: "A Restfull API",
        technology: "Spring Boot - Java 25",
    });

    container.addContainer({
        name: "Database",
        description: "A database",
        technology: "PostgreSQL",
    });
}

main();
