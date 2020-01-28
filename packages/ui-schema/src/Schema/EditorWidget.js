import React from "react";
import {List} from "immutable";
import {useSchemaEditor} from "./EditorStore";
import {WidgetStackRenderer} from "./EditorWidgetStack";

const DumpWidgetRenderer = React.memo(({Widget, widgetStack: widgetStack, ...props}) => {
    // abstraction layer that only pushes the to-rendering's values
    // thus no hook inside widget needed, widget and widget-plugins can be pure/dump for its scope

    return widgetStack ?
        <WidgetStackRenderer {...props} Widget={Widget} widgetStack={widgetStack} current={0}/> :
        <Widget {...props}/>;
});

const SchemaWidgetRenderer = ({schema, parentSchema, storeKeys, showValidity: showValidityOverride, ...props}) => {
    const {store, setData, widgets, showValidity, validity, onValidity, t} = useSchemaEditor();
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

    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    // todo: make it easy to to extend these properties with a widget
    return Widget ? <DumpWidgetRenderer
        Widget={Widget}// passed to FinalWidgetRenderer and WidgetStackRenderer
        widgetStack={widgetStack}// passed only to WidgetStackRenderer

        // all others are getting pushed to Widget
        t={t}
        {...props}
        showValidity={showValidity || showValidityOverride}
        validity={validity}
        onValidity={onValidity}
        value={store.getIn(storeKeys)}
        ownKey={storeKeys.get(storeKeys.count() - 1)}
        storeKeys={storeKeys}
        setData={setData}
        schema={schema}
        required={required}
        parentSchema={parentSchema}
    /> : null;
};

export {SchemaWidgetRenderer}
