import React from "react";
import {List} from "immutable";
import ErrorBoundary from "react-error-boundary";

const MyFallbackComponent = ({componentStack, error}) => (
    <div>
        <p><strong>Oops! An error occured!</strong></p>
        <p>Here’s what we know…</p>
        <p><strong>Error:</strong> {error.toString()}</p>
        <p><strong>Stacktrace:</strong> {componentStack}</p>
    </div>
);

const getPlugin = (current, widgetStack) => {
    return current < widgetStack.length ? widgetStack[current] : false;
};

const WidgetStackRenderer = ({current, Widget, widgetStack, ...props}) => {
    // plugin layer

    // first Plugin
    const Plugin = getPlugin(current, widgetStack);

    return <ErrorBoundary FallbackComponent={MyFallbackComponent}>
        {Plugin ? <Plugin {...props} Widget={Widget} valid errors={List()} widgetStack={widgetStack} current={current}/> : 'plugin-stack-error'}
    </ErrorBoundary>;
};

const NextPluginRenderer = ({current, Widget, widgetStack, ...props}) => {
    const next = current + 1;
    const Plugin = getPlugin(next, widgetStack);

    return next < widgetStack.length ?
        Plugin ? <Plugin {...props} Widget={Widget} widgetStack={widgetStack} current={next}/> : 'plugin-error' :
        <Widget {...props}/>;
};

export {NextPluginRenderer, WidgetStackRenderer}
