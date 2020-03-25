import {SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    ValidatorStack,
    ConditionalHandler, CombiningHandler,
} from "@ui-schema/ui-schema";

const pluginStack = [
    SchemaGridHandler,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    ValidatorStack,
    ValidityReporter,
];

export {pluginStack};
