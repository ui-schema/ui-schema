import React from 'react';
import {EditorValidityProvider, SchemaEditorProvider, useSchemaData, useSchemaValidity, useSchemaWidgets} from "./EditorStore";
import {SchemaEditorRenderer} from "./EditorGroup";

/**
 * @type {React.NamedExoticComponent<{rootRenderer?: *, schema?: *}>}
 */
const DumpRootRenderer = React.memo(({rootRenderer: RootRenderer, schema}) => {
    return <RootRenderer>
        <SchemaEditorRenderer schema={schema}/>
    </RootRenderer>;
});

/**
 * Initial rendering of root container and invoking the first schema-group with the root-level-data of `schema`
 *
 * @return {null|*}
 */
const SchemaRootRenderer = () => {
    const {schema, store,} = useSchemaData();
    const {widgets} = useSchemaWidgets();

    // first root rendering check if needed props are existing
    if(!schema || !store || !widgets) return null;

    const {RootRenderer} = widgets;

    if(!RootRenderer) {
        console.error('Widget RootRenderer not existing');
        return null;
    }

    return <DumpRootRenderer rootRenderer={RootRenderer} schema={schema}/>;
};

/**
 * Simple nested-schema renderer, begins directly at `group`/`widget` level and reuses the context/hooks of the parent SchemaEditor
 *
 * @todo it should be possible to also attach on `onChange` of store
 * @todo it should be possible to overwrite parent `widgets`
 *
 * @param schema
 * @param parentSchema
 * @param storeKeys
 * @param level
 * @param showValidity
 * @return {*}
 * @constructor
 */
const NestedSchemaEditor = ({schema, parentSchema, storeKeys, showValidity, level = 0}) => {
    const validity = useSchemaValidity();

    return <EditorValidityProvider {...validity} showValidity={showValidity || validity.showValidity}>
        <SchemaEditorRenderer
            schema={schema}
            parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level}
        />
    </EditorValidityProvider>
};

/**
 * Main Component to create a schema based UI generator
 *
 * @param {*} children
 * @param {schema, data, widgets} props
 * @return {*}
 */
let SchemaEditor = ({children, ...props}) => (
    <SchemaEditorProvider {...props}>
        {/* providing a dynamic schema editor context and rendering the root renderer */}
        <SchemaRootRenderer/>
        {children}
    </SchemaEditorProvider>
);
SchemaEditor = React.memo(SchemaEditor);


export {SchemaEditor, NestedSchemaEditor};
