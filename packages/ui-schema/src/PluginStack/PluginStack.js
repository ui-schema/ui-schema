import React from 'react';
import { List } from 'immutable';
import { memo } from '@ui-schema/ui-schema/Utils/memo';
import { useUIMeta } from '@ui-schema/ui-schema/UIMeta';
import { createValidatorErrors } from '@ui-schema/ui-schema/ValidatorErrors';
import { useUIConfig } from '@ui-schema/ui-schema/UIStore';
import { useImmutable } from '@ui-schema/ui-schema/Utils/useImmutable';
import { PluginStackErrorBoundary } from '@ui-schema/ui-schema/PluginStack';
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap';
import { checkUISchema } from '@ui-schema/ui-schema/UISchema';

const errorContainer = createValidatorErrors()

// `extractValue` has moved to own plugin `ExtractStorePlugin` since `0.3.0`
// `withUIMeta` and `mema` are not needed for performance optimizing since `0.3.0` at this position
export const PluginStack = ({ StackWrapper, wrapperProps, ...props }) => {
    const { widgets, ...meta } = useUIMeta()
    const config = useUIConfig()
    const {
        level = 0, parentSchema,
        storeKeys = List([]),
        schemaKeys = List([]),
        widgets: customWidgets,
    } = props;

    //Inherite uiSchema from parent schema element
    let {
        uiSchema = createOrderedMap(),
    } = props.schema;

    if (parentSchema) {
        let _name = storeKeys.last()
        if (typeof _name == "number") {
            _name = "items"
        }
        uiSchema = uiSchema.mergeDeep(parentSchema.get("uiSchema", createOrderedMap()).get(_name, createOrderedMap()));
    }
    props.schema = props.schema.set("uiSchema", uiSchema);

    let schemaExtract = checkUISchema(uiSchema);
    if (schemaExtract.size > 0) {
        props.schema = props.schema.mergeDeep(schemaExtract);
    }

    //Update oneOf uiSchema with parent uiSchema and apply finally
    if (props.schema.has("oneOf")) {
        let oneOf = props.schema.get("oneOf");
        for (let [i, one] of oneOf.entries()) {
            let _uiSchema = one.get("uiSchema", createOrderedMap()).mergeDeep(uiSchema.get(one.get("title", null), createOrderedMap()));
            let schemaExtract = checkUISchema(_uiSchema);
            if (schemaExtract.size > 0) {
                oneOf = oneOf.set(i, one.mergeDeep(one, schemaExtract));
            }
        }
        props.schema = props.schema.set("oneOf", oneOf);
    }

    const schema = props.schema
    // central reference integrity of `storeKeys` for all plugins and the receiving widget, otherwise `useImmutable` is needed more times, e.g. 3 times in plugins + 1x time in widget
    const currentStoreKeys = useImmutable(storeKeys)
    const currentSchemaKeys = useImmutable(schemaKeys)
    const activeWidgets = customWidgets || widgets

    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))
    let required = List([]);
    if (parentSchema) {
        // todo: resolving `required` here is wrong, must be done after merging schema / resolving referenced
        //      ! actual, it is correct here, as using `parentSchema`
        let tmp_required = parentSchema.get('required');
        if (tmp_required) {
            required = tmp_required;
        }
    }

    const stack = <NextPluginRenderer
        {...meta}
        {...config}
        {...props}
        currentPluginIndex={-1}
        widgets={activeWidgets}
        level={level}
        storeKeys={currentStoreKeys}
        schemaKeys={currentSchemaKeys}
        // todo: remove `ownKey` with `0.5.0`
        ownKey={storeKeys.last()}
        requiredList={required}
        required={false}
        errors={errorContainer}
        isVirtual={isVirtual}
        valid
    />;

    const wrappedStack = StackWrapper && !isVirtual ?
        <StackWrapper
            schema={schema}
            storeKeys={currentStoreKeys}
            schemaKeys={currentSchemaKeys}
            {...(wrapperProps || {})}
        >{stack}</StackWrapper> :
        stack

    return props.schema ?
        activeWidgets?.ErrorFallback ?
            <PluginStackErrorBoundary
                FallbackComponent={activeWidgets.ErrorFallback}
                type={schema.get('type')}
                widget={schema.get('widget')}
                storeKeys={currentStoreKeys}
            >
                {wrappedStack}
            </PluginStackErrorBoundary> :
            wrappedStack :
        null
};

export const getNextPlugin = (next, { pluginStack: ps, WidgetRenderer }) =>
    next < ps.length ?
        ps[next] || (() => 'plugin-error')
        : WidgetRenderer;

export const NextPluginRenderer = ({ currentPluginIndex, ...props }) => {
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} />
};
export const NextPluginRendererMemo = memo(NextPluginRenderer);
