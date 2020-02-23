import React from 'react';
import {List} from 'immutable';
import {
    EditorDataProvider, EditorTransProvider, EditorValidityProvider, EditorWidgetsProvider,
    useSchemaData, useSchemaValidity, useSchemaWidgets,
    withWidgets
} from "./EditorStore";
import {ValueWidgetRenderer} from "./EditorWidget";
import {memo} from "../Utils/memo";

let SchemaEditorRenderer = ({
                                schema, storeKeys = undefined, level = 0, ...props
                            }) => {
    if(!storeKeys) {
        // todo: check if it can be removed / defaults exists at every call
        storeKeys = List([]);
    }

    return schema ?
        <ValueWidgetRenderer
            {...props}
            schema={schema} storeKeys={storeKeys} level={level}
        /> : null;
};
SchemaEditorRenderer = withWidgets(memo(SchemaEditorRenderer));

/**
 * @type {function({rootRenderer: *, schema: *}): *}
 */
let DumpRootRenderer = ({rootRenderer: RootRenderer, schema}) => {
    return <RootRenderer>
        <SchemaEditorRenderer schema={schema}/>
    </RootRenderer>;
};
DumpRootRenderer = memo(DumpRootRenderer);

/**
 * Initial rendering of root container and invoking the first schema-group with the root-level-data of `schema`
 *
 * @return {null|*}
 */
const SchemaRootRenderer = () => {
    const {schema, store,} = useSchemaData();
    const {widgets} = useSchemaWidgets();

    // first root rendering check if needed props are existing
    if(!schema || typeof store === 'undefined' || !widgets) return null;

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
 * @param {{}} props
 * @return {*}
 * @constructor
 */
const NestedSchemaEditor = ({schema, parentSchema, storeKeys, showValidity, level = 0, ...props}) => {
    const validity = useSchemaValidity();

    return <EditorValidityProvider {...validity} showValidity={showValidity || validity.showValidity}>
        <SchemaEditorRenderer
            schema={schema}
            parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level}
            {...props}
        />
    </EditorValidityProvider>
};

/**
 * Main Component to create a schema based UI generator
 *
 * @param {*} children
 * @param {React.ReactNode} children
 * @param {OrderedMap} schema
 * @param {OrderedMap} store
 * @param {function(function): OrderedMap} onChange
 * @param {{}} widgets
 * @param {Map|undefined} validity
 * @param {boolean} showValidity
 * @param {function(function): Map} onValidity
 * @param {function(string, *): string|React.Component} t
 * @return {*}
 * @constructor
 */
let SchemaEditor = ({
                        children,
                        ...props
                    }) => (
    <SchemaEditorProvider {...props}>
        <SchemaRootRenderer/>
        {children}
        {/* providing a dynamic schema editor context and rendering the root renderer */}
    </SchemaEditorProvider>
);

let SchemaEditorProvider = ({
                                children,
                                schema,
                                store, onChange,
                                widgets, t,
                                validity, showValidity, onValidity,
                            }) => (
    <EditorWidgetsProvider widgets={widgets}>
        <EditorTransProvider t={t}>
            <EditorValidityProvider validity={validity} showValidity={showValidity} onValidity={onValidity}>
                <EditorDataProvider store={store} onChange={onChange} schema={schema}>
                    {children}
                </EditorDataProvider>
            </EditorValidityProvider>
        </EditorTransProvider>
    </EditorWidgetsProvider>
);


export {SchemaEditor, SchemaEditorProvider, NestedSchemaEditor, SchemaEditorRenderer, SchemaRootRenderer};
