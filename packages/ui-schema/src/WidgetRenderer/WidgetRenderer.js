import React from 'react';
import {useImmutable} from '@ui-schema/ui-schema/Utils';
import {widgetMatcher} from '@ui-schema/ui-schema/widgetMatcher';

export const WidgetRenderer = (
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        value, internalValue,
        WidgetOverride,
        errors,
        onErrors,
        // todo: concept in validation
        // we do not want `parentSchema` to be passed to the final widget for performance reasons
        // eslint-disable-next-line no-unused-vars
        //parentSchema,
        // we do not want `requiredList` to be passed to the final widget for performance reasons
        // eslint-disable-next-line no-unused-vars
        requiredList,
        // eslint-disable-next-line no-unused-vars
        currentPluginIndex,
        // `props` contains all props accumulated in the PluginStack, UIRootRenderer etc.
        ...props
    },
) => {
    const {schema, widgets, isVirtual} = props;
    const type = schema.get('type');
    const widgetName = schema.get('widget');
    const currentErrors = useImmutable(errors)

    React.useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    let Widget = widgetMatcher({
        isVirtual,
        WidgetOverride,
        widgetName: widgetName,
        schemaType: type,
        widgets,
    });

    const extractValue = !isVirtual && (type === 'array' || type === 'object')
    return Widget ?
        <Widget
            {...props}
            value={extractValue ? undefined : value}
            internalValue={extractValue ? undefined : internalValue}
            errors={currentErrors}
        /> : null;
};
