import React from 'react';
import {ObjectRenderer} from '@ui-schema/ui-schema/ObjectRenderer';
import {VirtualWidgetRenderer} from '@ui-schema/ui-schema/WidgetRenderer/VirtualWidgetRenderer';

const NoWidget = ({scope, matching}) => <>missing-{scope}-{matching}</>;

export const WidgetRenderer = ({
                                   // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
                                   value, internalValue,
                                   WidgetOverride,
                                   // we do not want `requiredList` to be passed to the final widget
                                   // eslint-disable-next-line no-unused-vars
                                   requiredList,
                                   // `props` contains all props accumulated in the PluginStack, UIRootRenderer, UIGeneratorNested etc.
                                   ...props
                               }) => {
    const {schema, widgets, isVirtual} = props;
    const type = schema.get('type');
    const widget_name = schema.get('widget');

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types
    let Widget = null;

    if(isVirtual) {
        Widget = VirtualWidgetRenderer
    } else if(WidgetOverride) {
        Widget = WidgetOverride
    } else if(widget_name && widgets.custom) {
        if(widgets.custom[widget_name]) {
            Widget = widgets.custom[widget_name];
        } else {
            Widget = () => <NoWidget scope={'custom'} matching={widget_name}/>;
            Widget.displayName = 'NoWidgetCustom'
        }
    } else if(type && widgets.types) {
        if(type === 'object') {
            Widget = ObjectRenderer;
        } else if(widgets.types[type]) {
            Widget = widgets.types[type];
        } else if(type === 'null') {
            Widget = null;
        } else {
            Widget = () => <NoWidget scope={'type'} matching={type}/>;
            Widget.displayName = 'NoWidgetType'
        }
    }

    const extractValue = !isVirtual && (type === 'array' || type === 'object')
    return Widget ?
        <Widget
            {...props}
            value={extractValue ? undefined : value}
            internalValue={extractValue ? undefined : internalValue}
            errors={errors}
        /> : null;
};
