import React from 'react';
import {List} from 'immutable';
import {
    EditorDataProvider, EditorValidityProvider, EditorWidgetsProvider,
    useSchemaData, useSchemaValidity, useSchemaWidgets,
    withWidgets
} from "./EditorStore";
import {ValueWidgetRenderer, ValuelessWidgetRenderer} from "./EditorWidget";
import {ObjectRenderer} from "./EditorObject";

let SchemaEditorRenderer = ({
                                widgets,// widgets from HOC for performance reasons
                                schema, storeKeys = undefined, dependencies = undefined, level = 0, ...props
                            }) => {
    if(!storeKeys) {
        // todo: check if it can be removed / defaults exists at every call
        storeKeys = List([]);
    }

    const type = schema.get('type');
    const widget = schema.get('widget');
    const {GroupRenderer, widgetStack} = widgets;

    return schema ?
        type !== 'object' || widget ?
            <ValueWidgetRenderer
                {...props}
                schema={schema} storeKeys={storeKeys} level={level}
                dependencies={dependencies}
            />
            : <ValuelessWidgetRenderer
                {...props}
                GroupRenderer={GroupRenderer}
                Widget={ObjectRenderer} widgetStack={widgetStack}
                schema={schema} storeKeys={storeKeys} level={level}
                dependencies={dependencies}/>
        : null;
};
SchemaEditorRenderer = withWidgets(React.memo(SchemaEditorRenderer));

/**
 * @type {function({rootRenderer: *, schema: *}): *}
 */
let DumpRootRenderer = ({rootRenderer: RootRenderer, schema}) => {
    return <RootRenderer>
        <SchemaEditorRenderer schema={schema}/>
    </RootRenderer>;
};
DumpRootRenderer = React.memo(DumpRootRenderer);

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
 * @param {React.ReactNode} children
 * @param {OrderedMap} schema
 * @param {OrderedMap} store
 * @param {function(function): OrderedMap} onChange
 * @param {{}} widgets
 * @param {Map|undefined} validity
 * @param {boolean} showValidity
 * @param {function(function): Map} onValidity
 * @return {*}
 * @constructor
 */
let SchemaEditor = ({
                        children,
                        schema,
                        store, onChange,
                        widgets, // t,
                        validity, showValidity, onValidity,
                    }) => (
    <EditorWidgetsProvider widgets={widgets}>
        <EditorValidityProvider validity={validity} showValidity={showValidity} onValidity={onValidity}>
            <EditorDataProvider store={store} onChange={onChange} schema={schema}>
                <SchemaRootRenderer/>
                {children}
                {/* providing a dynamic schema editor context and rendering the root renderer */}
            </EditorDataProvider>
        </EditorValidityProvider>
    </EditorWidgetsProvider>
);


export {SchemaEditor, NestedSchemaEditor, SchemaEditorRenderer};
