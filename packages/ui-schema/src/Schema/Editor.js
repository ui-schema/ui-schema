import React from 'react';
import {List} from 'immutable';
import {
    EditorStoreProvider, EditorProvider, useEditor,
    useSchemaStore, EditorStore,
} from "./EditorStore";
import {WidgetRenderer} from "./EditorWidget";
import {memo} from "../Utils/memo";

const SchemaEditorRendererBase = ({
                                      schema, storeKeys, level = 0, ...props
                                  }) => {
    return schema ?
        <WidgetRenderer
            {...props}
            schema={schema} storeKeys={storeKeys} level={level}
        /> : null;
};
export const SchemaEditorRenderer = memo(SchemaEditorRendererBase);

/**
 * @type {function({rootRenderer: *, ...}): *}
 */
let DumpRootRenderer = ({rootRenderer: RootRenderer, ...props}) => {
    return <RootRenderer>
        <SchemaEditorRenderer {...props}/>
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

    const storeKeys = List([]);

    return <DumpRootRenderer rootRenderer={RootRenderer} schema={schema} storeKeys={storeKeys}/>;
};

/**
 * Simple nested-schema renderer, begins directly at `group`/`widget` level and reuses the context/hooks of the parent SchemaEditor
 *
 * @todo it should be possible to also attach on `onChange` of store
 */
export const NestedSchemaEditor = ({
                                       schema, parentSchema, storeKeys,
                                       showValidity, widgets, t,
                                       level = 0, ...props
                                   }) => {
    const editor = useEditor();

    return <EditorProvider
        {...editor}
        showValidity={showValidity || editor.showValidity}
        widgets={widgets || editor.widgets}
        t={t || editor.t}
    >
        <SchemaEditorRenderer
            schema={schema}
            parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level}
            {...props}
        />
    </EditorProvider>
};

/**
 * Main Component to create a schema based UI generator
 */
export const SchemaEditor = ({
                                 children,
                                 ...props
                             }) => (
    <SchemaEditorProvider {...props}>
        <SchemaRootRenderer/>
        {children}
        {/* providing a dynamic schema editor context and rendering the root renderer */}
    </SchemaEditorProvider>
);

export const SchemaEditorProvider = ({
                                         children,
                                         schema,
                                         store, onChange,
                                         widgets, t,
                                         showValidity,
                                     }) => {
    if(!(store instanceof EditorStore)) {
        console.error('given store must be a valid EditorStore')
        return null;
    }
    return <EditorProvider widgets={widgets} t={t} showValidity={showValidity}>
        <EditorStoreProvider store={store} onChange={onChange} schema={schema}>
            {children}
        </EditorStoreProvider>
    </EditorProvider>
};
