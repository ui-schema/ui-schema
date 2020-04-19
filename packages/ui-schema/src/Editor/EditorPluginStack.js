import React from "react";
import {List} from "immutable";
import ErrorBoundary from "react-error-boundary";
import {memo} from "../Utils/memo";
import {ObjectRenderer} from "../Renderer/ObjectRenderer";

const MyFallbackComponent = ({componentStack, error, type, widget}) => (
    <div>
        <p><strong>Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
        <p><strong>Error:</strong> {error.toString()}</p>
        <p><strong>Stacktrace:</strong> {componentStack}</p>
    </div>
);

export const getPlugin = (current, pluginStack) => {
    return current < pluginStack.length ? pluginStack[current] : false;
};

export const PluginStackRenderer = ({current, ...props}) => {
    // plugin layer
    const {widgets, schema} = props;

    // first Plugin
    const Plugin = getPlugin(current, widgets.pluginStack);

    const FallbackComponent = React.useCallback(
        p => <MyFallbackComponent {...p} type={schema.get('type')} widget={schema.get('widget')}/>,
        [schema]
    );

    return <ErrorBoundary FallbackComponent={FallbackComponent}>
        {Plugin ? <Plugin {...props} valid errors={List()} current={current}/> : 'plugin-stack-error'}
    </ErrorBoundary>;
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

const NoWidget = ({scope, matching}) => <React.Fragment>missing-{scope}-{matching}</React.Fragment>;

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
