import React from "react";
import {SchemaEditorRenderer} from "./Editor";
import {memo} from "../Utils/memo";

let ObjectRenderer = ({
                          GroupRenderer,// temporary: HOC in SchemaEditorRenderer
                          level, schema, storeKeys, ...props
                      }) => {
    const properties = schema.get('properties');

    if(!GroupRenderer) {
        console.error('Widget GroupRenderer not existing');
        return null;
    }

    return <GroupRenderer level={level} schema={schema}>
        {properties ? properties.map((childSchema, childKey) =>
            <SchemaEditorRenderer
                key={childKey}
                {...props}
                schema={childSchema} parentSchema={schema}
                storeKeys={storeKeys.push(childKey)} level={level + 1}
            />
        ).valueSeq() : null}
    </GroupRenderer>
};
ObjectRenderer = memo(ObjectRenderer);

export {ObjectRenderer}
