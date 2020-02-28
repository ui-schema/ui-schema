import React from "react";
import {List} from "immutable";
import {extractValue, withEditor,} from "./EditorStore";
import {WidgetStackRenderer} from "./EditorWidgetStack";
import {memo} from "../Utils/memo";

let ValueWidgetRenderer = ({
                               parentSchema, storeKeys, ...props
                           }) => {
    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    return <WidgetStackRenderer
        current={0}
        // all others are getting pushed to Widget
        {...props}
        ownKey={storeKeys.get(storeKeys.count() - 1)}
        storeKeys={storeKeys}
        required={required}
        parentSchema={parentSchema}
    />;
};
ValueWidgetRenderer = withEditor(extractValue(memo(ValueWidgetRenderer)));

export {ValueWidgetRenderer}
