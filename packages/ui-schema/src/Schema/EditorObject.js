import React from "react";
import {SchemaEditorRenderer} from "./Editor";
import {memo} from "../Utils/memo";

let ObjectRenderer = ({
                          widgets, level, schema, storeKeys, ...props
                      }) => {
    const properties = schema.get('properties');

    if(!widgets.GroupRenderer) {
        console.error('Widget GroupRenderer not existing');
        return null;
    }
    const GroupRenderer = widgets.GroupRenderer;

    // no-properties could come from
    //   e.g. combining/conditional schemas which are currently not applied (e.g. a condition fails)
    return properties ? <GroupRenderer level={level} schema={schema}>
        {properties.map((childSchema, childKey) =>
            <SchemaEditorRenderer
                key={childKey}
                {...props}
                schema={childSchema} parentSchema={schema}
                storeKeys={storeKeys.push(childKey)} level={level + 1}
            />
        ).valueSeq()}
    </GroupRenderer> : null
};
ObjectRenderer = memo(ObjectRenderer);

export {ObjectRenderer}
