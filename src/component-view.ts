import type { Container } from "./frain-nodes";
import { View } from "./views";

export class ComponentView extends View {
    private container: Container;
    constructor(container: Container) {
        super();
        this.container = container;
    }
}
