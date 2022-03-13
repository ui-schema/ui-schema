import React from 'react';
import {useImmutable} from '@ui-schema/ui-schema/Utils';
import {widgetMatcher} from '@ui-schema/ui-schema/widgetMatcher';
import {List} from 'immutable';

export const WidgetRenderer = (
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        value, internalValue,
        WidgetOverride,
        errors,
        onErrors,
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
    const currentErrors = useImmutable(errors)

    React.useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    const schemaType = schema.get('type');
    const widgetName = schema.get('widget');
    const Widget = widgetMatcher({
        isVirtual: isVirtual,
        WidgetOverride: WidgetOverride,
        widgetName: widgetName,
        schemaType: schemaType,
        widgets: widgets,
    });

    const noExtractValue = !isVirtual && (
        schemaType === 'array' || schemaType === 'object' ||
        (
            List.isList(schemaType) && (
                schemaType.indexOf('array') !== -1 ||
                schemaType.indexOf('object') !== -1
            )
        )
    )
    return Widget ?
        <Widget
            {...props}
            value={noExtractValue ? undefined : value}
            internalValue={noExtractValue ? undefined : internalValue}
            errors={currentErrors}
        /> : null;
};
