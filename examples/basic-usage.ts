import { Frain } from "../src/frain";
import { NodeType } from "../src/types";

function main() {
    const frain = new Frain({
        apiKey: "asdasd",
        projectId: "asdasd",
        title: "ACME",
        description: "This is a sample application",
    });

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

    commonPerson.use(frainSystem, "uses", "");
    frainSystem.use(paypal, "uses", "As payment gateway");

    // Create a container view
    const container = frain.createContainerView(frainSystem);

    const webapp = container.addContainer({
        name: "Web App",
        description: "A web application",
        technology: "Next Js",
    });

    const api = container.addContainer({
        name: "API",
        description: "A Restfull API",
        technology: "Spring Boot - Java 25",
    });

    const db = container.addContainer({
        name: "Database",
        description: "A database",
        technology: "PostgreSQL",
    });

    webapp.use(api, "uses", "As API");
    api.use(db, "uses", "As database");
    api.use(paypal, "uses", "As payment gateway");

    commonPerson.use(webapp, "uses", "");

    // Styling
    db.setType(NodeType.Database);

    container.addNodes([commonPerson, paypal]);

    // Create a Component view
    const apiView = frain.createComponentView(api);

    const sharedKernel = apiView.addComponent({
        name: "Shared Kernel",
        description: "A shared kernel",
        technology: "Spring Boot - Java 25",
    });

    const payments = apiView.addComponent({
        name: "Payments",
        description: "A payments component",
        technology: "Spring Boot - Java 25",
    });

    payments.use(paypal, "uses", "As payment gateway");
    payments.use(sharedKernel, "uses", "As shared kernel");

    webapp.use(payments, "uses", "As payment gateway");

    apiView.addNodes([paypal, webapp]);
}

main();
