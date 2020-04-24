import React from 'react';
import {EditorProvider, useEditor,} from "../EditorStore";
import {WidgetRenderer} from "../WidgetRenderer";

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
        <WidgetRenderer
            schema={schema}
            parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level}
            {...props}
        />
    </EditorProvider>
};
