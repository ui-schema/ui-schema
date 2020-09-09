import React from "react";
import {RootRenderer, GroupRenderer} from "./Grid";
import {pluginStack} from "./pluginStack";
import {validators} from '@ui-schema/ui-schema';

const MyFallbackComponent = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
);

export const widgetsBase = {
    ErrorFallback: MyFallbackComponent,
    RootRenderer,  // wraps the whole editor
    GroupRenderer, // wraps any `object` that has no custom widget
    pluginStack,   // widget plugin system
    validators,    // validator functions
    types: {/* define native JSON-schema type widgets */},
    custom: {/* define custom widgets */},
};
