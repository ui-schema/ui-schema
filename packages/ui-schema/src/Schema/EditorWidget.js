import React from "react";
import {List} from "immutable";
import {useSchemaData, useSchemaWidgets} from "./EditorStore";
import {WidgetStackRenderer} from "./EditorWidgetStack";
import {memo} from "../Utils/memo";

let DumpWidgetRenderer = ({Widget, widgetStack: widgetStack, ...props}) => {
    return widgetStack ?
        <WidgetStackRenderer {...props} Widget={Widget} widgetStack={widgetStack} current={0}/> :
        <Widget {...props}/>;
};
DumpWidgetRenderer = memo(DumpWidgetRenderer);

let ValueWidgetRenderer = ({schema, parentSchema, storeKeys, ...props}) => {
    const {store, onChange,} = useSchemaData();
    const {widgets,} = useSchemaWidgets();
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

    return Widget ? <ValuelessWidgetRenderer
        Widget={Widget}// passed to FinalWidgetRenderer and WidgetStackRenderer
        widgetStack={widgetStack}// passed only to WidgetStackRenderer

        {...props}
        schema={schema}
        parentSchema={parentSchema}
        storeKeys={storeKeys}
        value={store.getIn(storeKeys)}
        onChange={onChange}
    /> : null;
};

let ValuelessWidgetRenderer = ({
                                   Widget, widgetStack,
                                   schema, parentSchema, storeKeys, ...props
                               }) => {
    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    return <DumpWidgetRenderer
        Widget={Widget}// passed to FinalWidgetRenderer and WidgetStackRenderer
        widgetStack={widgetStack}// passed only to WidgetStackRenderer

        // all others are getting pushed to Widget
        {...props}
        ownKey={storeKeys.get(storeKeys.count() - 1)}
        storeKeys={storeKeys}
        schema={schema}
        required={required}
        parentSchema={parentSchema}
    />;
};
ValuelessWidgetRenderer = memo(ValuelessWidgetRenderer);

export {ValueWidgetRenderer, ValuelessWidgetRenderer}
