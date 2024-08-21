import React from 'react'
import { SchemaValidatorContext, SchemaPluginStack } from '@ui-schema/system/SchemaPluginStack'
import { DecoratorPropsNext, ReactBaseDecorator } from '@ui-schema/react/WidgetDecorator'
import { WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

export interface SchemaPluginsAdapterProps {
    schemaPlugins?: SchemaPlugin[]
}

export const SchemaPluginsAdapter = <P extends DecoratorPropsNext & WidgetProps & WithValue>(props: P & SchemaPluginsAdapterProps): React.ReactElement<P & SchemaValidatorContext> => {
    const Next = props.next(props.decoIndex + 1) as ReactBaseDecorator<P & SchemaValidatorContext>
    const nextProps: P & SchemaValidatorContext = {
        ...props,
        errors: createValidatorErrors(),
        valid: true,
    }
    return <Next
        {...(props.schemaPlugins ? SchemaPluginStack(nextProps, props.schemaPlugins) : nextProps)}
        decoIndex={props.decoIndex + 1}
    />
}
