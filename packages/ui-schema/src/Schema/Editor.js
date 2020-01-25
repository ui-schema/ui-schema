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

const getPlugin = (current, widgetStack) => {
    return current < widgetStack.length ? widgetStack[current] : false;
};

const WidgetStackRenderer = ({current, Widget, widgetStack, ...props}) => {
    // plugin layer

    // first Plugin
    const Plugin = getPlugin(current, widgetStack);

    return <ErrorBoundary FallbackComponent={MyFallbackComponent}>
        {Plugin ? <Plugin {...props} Widget={Widget} valid widgetStack={widgetStack} current={current}/> : 'plugin-stack-error'}
    </ErrorBoundary>;
};

const FinalWidgetRenderer = ({Widget, ...props}) => {
    return <Widget {...props}/>;
};

const NextPluginRenderer = ({current, Widget, widgetStack, ...props}) => {
    const next = current + 1;
    const Plugin = getPlugin(next, widgetStack);

    return next < widgetStack.length ?
        Plugin ? <Plugin {...props} Widget={Widget} widgetStack={widgetStack} current={next}/> : 'plugin-error' :
        <FinalWidgetRenderer {...props} Widget={Widget}/>;
};

const DumpWidgetRenderer = React.memo(({Widget, widgetStack: widgetStack, ...props}) => {
    // abstraction layer that only pushes the to-rendering's values
    // thus no hook inside widget needed, widget and widget-plugins can be pure/dump for its scope

    return <ErrorBoundary FallbackComponent={MyFallbackComponent}>
        {widgetStack ?
            <WidgetStackRenderer {...props} Widget={Widget} widgetStack={widgetStack} current={0}/> :
            <FinalWidgetRenderer {...props} Widget={Widget}/>}
    </ErrorBoundary>;
});

const SchemaWidgetRenderer = ({schema, required, storeKeys, level}) => {
    const {store, setData, widgets, showValidity, t} = useSchemaEditor();
    const {widgetStack} = widgets;
    const type = schema.get('type');
    const widget_name = schema.get('widget');

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types
    let Widget = null;

    if(widget_name && widgets.custom) {
        if(!widgets.custom[widget_name]) {
            return 'missing-custom-' + widget_name;
        }
        Widget = widgets.custom[widget_name];
    } else if(type && widgets.types) {
        if(!widgets.types[type]) {
            return 'missing-type-' + type;
        }
        Widget = widgets.types[type];
    }

    // todo: make it easy to to extend these properties with a widget
    return Widget ? <DumpWidgetRenderer
        Widget={Widget}// passed to FinalWidgetRenderer and WidgetStackRenderer
        widgetStack={widgetStack}// passed only to WidgetStackRenderer

        // all others are getting pushed to Widget
        t={t}
        showValidity={showValidity}
        value={store.getIn(storeKeys)}
        ownKey={storeKeys.get(storeKeys.count() - 1)}
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

    // todo: parentSchema is only pushed down to use e.g. `required` which is in this schema level but influences to child-schema, extracting such information here?

    return schema ?
        // split widget/native-types from pure-object
        <DumpSwitchingRenderer
            schema={schema} parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level}
            groupRenderer={GroupRenderer}
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
 * Simple nested-schema renderer, begins directly at `group`/`widget` level and reuses the context/hooks of the parent SchemaEditor
 *
 * @todo it should be possible to also attach on `onChange` of store
 * @todo it should be possible to overwrite parent `widgets`
 *
 * @param schema
 * @param parentSchema
 * @param storeKeys
 * @param level
 * @return {*}
 * @constructor
 */
const NestedSchemaEditor = ({schema, parentSchema, storeKeys, level = 0}) =>
    <SchemaEditorRenderer
        schema={schema}
        parentSchema={parentSchema}
        storeKeys={storeKeys}
        level={level}
    />;

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


export {SchemaEditor, NestedSchemaEditor, NextPluginRenderer};
