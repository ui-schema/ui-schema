import React from "react";
import {List} from "immutable";
import {useSchemaEditor} from "./EditorStore";
import {SchemaWidgetRenderer} from "./EditorWidget";

/**
 * decided if a widget or another group should be rendered, a group is any object without a widget
 */
let DumpSwitchingRenderer = ({schema, storeKeys, level, groupRenderer: GroupRenderer, dependencies: ownDependencies, ...props}) => {
    const type = schema.get('type');
    const widget = schema.get('widget');
    const properties = schema.get('properties');
    const dependencies = schema.get('dependencies');

    // it is important here that props get destructed before other props, e.g. `parentSchema` may be overwritten
    return type !== 'object' || widget ?
        <SchemaWidgetRenderer
            {...props}
            schema={schema} storeKeys={storeKeys} level={level}
            dependencies={ownDependencies ? ownDependencies : undefined}
        /> :
        <GroupRenderer level={level} schema={schema}>
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
DumpSwitchingRenderer = React.memo(DumpSwitchingRenderer);

const SchemaEditorRenderer = ({schema, storeKeys = undefined, level = 0, ...props}) => {
    const {widgets} = useSchemaEditor();

    if(!storeKeys) {
        storeKeys = List();
    }

    const {GroupRenderer} = widgets;
    if(!GroupRenderer) {
        console.error('Widget GroupRenderer not existing');
        return null;
    }

    return schema ?
        // split widget/native-types from pure-object
        <DumpSwitchingRenderer
            {...props}
            schema={schema} storeKeys={storeKeys} level={level}
            groupRenderer={GroupRenderer}
        />
        : null;
};

export {SchemaEditorRenderer}
