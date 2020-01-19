import React from 'react';
import {List} from "immutable";
import {SchemaEditorProvider, useSchemaEditor} from "./EditorStore";
import ErrorBoundary from "react-error-boundary";

const MyFallbackComponent = ({componentStack, error}) => (
    <div>
        <p><strong>Oops! An error occured!</strong></p>
        <p>Here’s what we know…</p>
        <p><strong>Error:</strong> {error.toString()}</p>
        <p><strong>Stacktrace:</strong> {componentStack}</p>
    </div>
);

const DumpWidgetRenderer = React.memo(({renderer: Renderer, widgetRenderer: WidgetRenderer, ...props}) => {
    // abstraction layer that only pushes the to-rendering's values
    // thus no hook inside widget needed, widget can be pure/dump for its scope
    return <ErrorBoundary FallbackComponent={MyFallbackComponent}>
        {WidgetRenderer ? <WidgetRenderer {...props}><Renderer {...props}/></WidgetRenderer> : <Renderer {...props}/>}
    </ErrorBoundary>;
});

let SchemaWidgetRenderer = ({schema, required, storeKeys, level}) => {
    const {store, setData, widgets} = useSchemaEditor();
    const {WidgetRenderer} = widgets;
    const type = schema.get('type');
    const widget = schema.get('widget');

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types
    let renderer = null;

    if(widget && widgets.custom) {
        if(!widgets.custom[widget]) {
            return 'custom-' + widget;
        }
        renderer = widgets.custom[widget];
    } else if(type && widgets.types) {
        if(!widgets.types[type]) {
            return 'type-' + type;
        }
        renderer = widgets.types[type];
    }

    // todo: make it easy to to extend these properties with a widget
    return renderer ? <DumpWidgetRenderer
        renderer={renderer}
        widgetRenderer={WidgetRenderer}
        value={store.getIn(storeKeys)}
        lastKey={storeKeys.get(storeKeys.count() - 1)}
        storeKeys={storeKeys}
        setData={setData}
        level={level}
        schema={schema}
        required={required}
    /> : null;
};

/**
 * decided if a widget or another group should be rendered, a group is any object without a widget
 */
let DumpSwitchingRenderer = ({schema, storeKeys, level, parentSchema, groupRenderer: GroupRenderer}) => {
    const type = schema.get('type');
    const widget = schema.get('widget');
    const properties = schema.get('properties');

    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    return type !== 'object' || widget ?
        <SchemaWidgetRenderer schema={schema} storeKeys={storeKeys} level={level} required={required}/> :
        <GroupRenderer level={level} schema={schema}>
            {/*<PropertiesRenderer properties={properties} storeKeys={storeKeys} level={level}/>*/}
            {properties ? properties.map((childSchema, childKey) =>
                <SchemaEditorRenderer key={childKey} schema={childSchema} parentSchema={schema} storeKeys={storeKeys.push(childKey)} level={level + 1}/>
            ).valueSeq() : null}
        </GroupRenderer>
};
DumpSwitchingRenderer = React.memo(DumpSwitchingRenderer);

const SchemaEditorRenderer = ({schema, parentSchema, storeKeys = undefined, level = 0}) => {
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
            schema={schema} parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level} groupRenderer={GroupRenderer}
        />
        : null;
};

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
    const {schema, store, widgets} = useSchemaEditor();

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

export {SchemaEditor};
