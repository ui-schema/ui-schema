import React from 'react';
import {List} from 'immutable';
import {memo} from '@ui-schema/ui-schema/Utils/memo';
import {getSchemaId} from '@ui-schema/ui-schema/Utils/getSchema';
import {useUIMeta} from '@ui-schema/ui-schema/UIMeta/UIMetaProvider';
import {isRootSchema, SchemaRootProvider} from '@ui-schema/ui-schema/SchemaRootProvider';
import {createValidatorErrors} from '@ui-schema/ui-schema/ValidatorErrors';

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

// `extractValue` has moved to own plugin `ExtractStorePlugin` since `0.3.0`
// `withUIMeta` and `mema` are not needed for performance optimizing since `0.3.0` at this position
export const PluginStack = (props) => {
    const {widgets, ...meta} = useUIMeta()
    const {
        level = 0, parentSchema,
        storeKeys, schema,
        widgets: customWidgets,
    } = props;
    const activeWidgets = customWidgets ? customWidgets : widgets

    // till draft-06, no `$`, hashtag in id
    const id = getSchemaId(schema)
    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))
    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    const ErrorBoundary = activeWidgets.ErrorFallback ? PluginStackErrorBoundary : React.Fragment;

    const pluginTree = <NextPluginRenderer
        currentPluginIndex={-1}
        // all others are getting pushed to Widget
        {...meta}
        {...props}
        widgets={activeWidgets}
        level={level}
        ownKey={storeKeys.get(storeKeys.count() - 1)}
        requiredList={required}
        required={false}
        errors={createValidatorErrors()}
        isVirtual={isVirtual}
        valid
    />

    return props.schema ? <ErrorBoundary
        FallbackComponent={activeWidgets.ErrorFallback}
        type={schema.get('type')}
        widget={schema.get('widget')}
    >
        {isRootSchema(schema) ?
            // TODO: check spec. for: uses root `id`s only, those which are not in the same document/e.g. excludes $anchors from `$defs`
            // TODO: shouldn't this be after handling $ref?
            <SchemaRootProvider id={id} schema={schema}>
                {pluginTree}
            </SchemaRootProvider> :
            pluginTree}
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
