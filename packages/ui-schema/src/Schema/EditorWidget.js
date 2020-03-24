import React from "react";
import {List} from "immutable";
import {extractValue, withEditor,} from "./EditorStore";
import {PluginStackRenderer} from "./EditorPluginStack";
import {memo} from "../Utils/memo";

const WidgetRendererBase = ({
                                parentSchema, storeKeys, ...props
                            }) => {
    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    return <PluginStackRenderer
        current={0}
        // all others are getting pushed to Widget
        {...props}
        ownKey={storeKeys.get(storeKeys.count() - 1)}
        storeKeys={storeKeys}
        required={required}
        parentSchema={parentSchema}
    />;
};
export const WidgetRenderer = withEditor(extractValue(memo(WidgetRendererBase)));
