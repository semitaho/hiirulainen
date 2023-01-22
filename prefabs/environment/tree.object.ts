import { EnvironmentObject } from "./environment.object";

export class TreeObject extends EnvironmentObject {

    constructor() {
        super("tree" + Math.random());
    }
}