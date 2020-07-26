import React from "react";
import {memo} from "../Utils/memo";
import {ObjectRenderer} from "../ObjectRenderer";

export const getPlugin = (current, pluginStack) => {
    return current < pluginStack.length ? pluginStack[current] : false;
};

export const NextPluginRenderer = ({current, ...props}) => {
    const {widgets} = props;
    const next = current + 1;
    const Plugin = getPlugin(next, widgets.pluginStack);

    return next < widgets.pluginStack.length ?
        Plugin ? <Plugin {...props} current={next}/> : 'plugin-error' :
        <FinalWidgetRenderer {...props}/>;
};
export const NextPluginRendererMemo = memo(NextPluginRenderer);

const NoWidget = ({scope, matching}) => <>missing-{scope}-{matching}</>;

export const FinalWidgetRenderer = ({value, ...props}) => {
    const {schema, widgets} = props;
    const type = schema.get('type');
    const widget_name = schema.get('widget');

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types
    let Widget = null;

    if(widget_name && widgets.custom) {
        if(widgets.custom[widget_name]) {
            Widget = widgets.custom[widget_name];
        } else {
            Widget = () => <NoWidget scope={'custom'} matching={widget_name}/>;
        }
    } else if(type && widgets.types) {
        if(type === 'object') {
            Widget = ObjectRenderer;
        } else if(widgets.types[type]) {
            Widget = widgets.types[type];
        } else {
            Widget = () => <NoWidget scope={'type'} matching={type}/>;
        }
    }

    return Widget ? <Widget {...props} value={type === 'array' || type === 'object' ? undefined : value}/> : null;
};
