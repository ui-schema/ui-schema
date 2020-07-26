import React from 'react';
import {List} from 'immutable';
import {useEditor, useSchemaStore} from "../EditorStore";
import {WidgetRenderer} from "../WidgetRenderer";
import {memo} from "../Utils/memo";

/**
 * @type {function({rootRenderer: *, ...}): *}
 */
let DumpRootRenderer = ({rootRenderer: RootRenderer, ...props}) => {
    return <RootRenderer>
        <WidgetRenderer {...props}/>
    </RootRenderer>;
};
DumpRootRenderer = memo(DumpRootRenderer);

const mustBeSet = name => {
    console.error(name + ' must be set');
    return null;
};

/**
 * Initial rendering of root container and invoking the first schema-group with the root-level-data of `schema`
 *
 * @return {null|*}
 */
export const SchemaRootRenderer = () => {
    const {
        // getting the root level schema, all other schemas within an editor are property calculated
        schema,
    } = useSchemaStore();
    const {widgets} = useEditor();

    if(!schema) {
        return mustBeSet('schema');
    }
    if(!widgets) {
        return mustBeSet('widgets');
    }

    const {RootRenderer} = widgets;

    if(!RootRenderer) {
        console.error('Widget RootRenderer not existing');
        return null;
    }

    return <DumpRootRenderer rootRenderer={RootRenderer} schema={schema} storeKeys={List([])}/>;
};
