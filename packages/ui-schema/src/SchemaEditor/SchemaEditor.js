import React from 'react';
import {EditorStoreProvider, EditorProvider, EditorStore,} from "../EditorStore";
import {SchemaRootRenderer} from "../SchemaRootRenderer";

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
