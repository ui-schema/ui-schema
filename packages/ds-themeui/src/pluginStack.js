import {SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    Validator,
    ConditionalHandler, CombiningHandler,
} from "@ui-schema/ui-schema";

const pluginStack = [
    SchemaGridHandler,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    Validator,
    ValidityReporter,
];

export {pluginStack};
