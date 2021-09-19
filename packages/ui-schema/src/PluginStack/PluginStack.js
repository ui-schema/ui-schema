import React from 'react';
import {List} from 'immutable';
import {memo} from '@ui-schema/ui-schema/Utils/memo';
import {useUIMeta} from '@ui-schema/ui-schema/UIMeta';
import {createValidatorErrors} from '@ui-schema/ui-schema/ValidatorErrors';
import {useUIConfig} from '@ui-schema/ui-schema/UIStore';
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable';

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
            // todo: multi type support #68
            return 'error-' + this.props.type + (this.props.widget ? '-' + this.props.widget : '')
        }
        return this.props.children;
    }
}

// `extractValue` has moved to own plugin `ExtractStorePlugin` since `0.3.0`
// `withUIMeta` and `mema` are not needed for performance optimizing since `0.3.0` at this position
export const PluginStack = (props) => {
    const {widgets, ...meta} = useUIMeta()
    const config = useUIConfig()
    const {
        level = 0, parentSchema,
        storeKeys, schema,
        widgets: customWidgets,
    } = props;
    // central reference integrity of `storeKeys` for all plugins and the receiving widget, otherwise `useImmutable` is needed more times, e.g. 3 times in plugins + 1x time in widget
    const currentStoreKeys = useImmutable(storeKeys)
    const activeWidgets = customWidgets || widgets

    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))
    let required = List([]);
    if(parentSchema) {
        // todo: resolving `required` here is wrong, must be done after merging schema / resolving referenced
        //      ! actual, it is correct here, as using `parentSchema`
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    const ErrorBoundary = activeWidgets?.ErrorFallback ? PluginStackErrorBoundary : React.Fragment;

    return props.schema ? <ErrorBoundary
        FallbackComponent={activeWidgets?.ErrorFallback}
        type={schema.get('type')}
        widget={schema.get('widget')}
    >
        <NextPluginRenderer
            {...meta}
            {...config}
            {...props}
            currentPluginIndex={-1}
            widgets={activeWidgets}
            level={level}
            storeKeys={currentStoreKeys}
            ownKey={storeKeys.get(storeKeys.count() - 1)}
            requiredList={required}
            required={false}
            errors={createValidatorErrors()}
            isVirtual={isVirtual}
            valid
        />
    </ErrorBoundary> : null;
};

export const getNextPlugin = (next, {pluginStack: ps, WidgetRenderer}) =>
    next < ps.length ?
        ps[next] || (() => 'plugin-error')
        : WidgetRenderer;


export const NextPluginRenderer = ({currentPluginIndex, ...props}) => {
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next}/>
};
export const NextPluginRendererMemo = memo(NextPluginRenderer);
