import React from 'react';
import {memo} from '../Utils/memo';
import {List} from 'immutable';
import {createValidatorErrors} from '@ui-schema/ui-schema/ValidatorStack';
import {extractValue, withUIMeta} from '@ui-schema/ui-schema/UIStore';
import {WidgetRenderer} from '@ui-schema/ui-schema/WidgetRenderer/WidgetRenderer';

class PluginStackErrorBoundary extends React.Component {
    state = {
        error: null,
    }

    static getDerivedStateFromError(error) {
        return {error: error};
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {
        if(this.state.error) {
            const FallbackComponent = this.props.FallbackComponent;
            if(FallbackComponent) {
                return <FallbackComponent error={this.state.error} type={this.props.type} widget={this.props.widget}/>;
            }
            return 'error-' + this.props.type + (this.props.widget ? '-' + this.props.widget : '')
        }
        return this.props.children;
    }
}

export const PluginStackBase = (props) => {
    const {
        level = 0, parentSchema,
        storeKeys, schema, widgets,
    } = props;

    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    const ErrorBoundary = widgets.ErrorFallback ? PluginStackErrorBoundary : React.Fragment;

    return props.schema ? <ErrorBoundary
        FallbackComponent={widgets.ErrorFallback}
        type={schema.get('type')}
        widget={schema.get('widget')}
    >
        <NextPluginRenderer
            current={-1}
            // all others are getting pushed to Widget
            {...props}
            level={level}
            ownKey={storeKeys.get(storeKeys.count() - 1)}
            requiredList={required}
            required={false}
            errors={createValidatorErrors()}
            valid
        />
    </ErrorBoundary> : null;
};
export const PluginStack = withUIMeta(extractValue(memo(PluginStackBase)));

export const getPlugin = (current, pluginStack) => {
    return current < pluginStack.length ? pluginStack[current] : undefined;
};

export const NextPluginRenderer = ({current, ...props}) => {
    const {widgets} = props;
    const next = current + 1;
    const Plugin = getPlugin(next, widgets.pluginStack);

    return next < widgets.pluginStack.length ?
        Plugin ? <Plugin {...props} current={next}/> : 'plugin-error' :
        <WidgetRenderer {...props}/>;
};
export const NextPluginRendererMemo = memo(NextPluginRenderer);
