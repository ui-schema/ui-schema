import React from "react";
import {SchemaEditorRenderer} from "./Editor";

let ObjectRenderer = ({
                          GroupRenderer,// temporary: HOC in SchemaEditorRenderer
                          level, schema, storeKeys, ...props
                      }) => {
    const properties = schema.get('properties');
    const dependencies = schema.get('dependencies');

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
                dependencies={dependencies ? dependencies.get(childKey) : undefined}
                storeKeys={storeKeys.push(childKey)} level={level + 1}
            />
        ).valueSeq() : null}
    </GroupRenderer>
};
ObjectRenderer = React.memo(ObjectRenderer);

export {ObjectRenderer}
