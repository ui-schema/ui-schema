/* eslint-disable @typescript-eslint/no-deprecated */
import React from 'react'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaCombine } from '@ui-schema/react-json-schema/CombiningHandler'
import { WithValue } from '@ui-schema/react/UIStore'

/**
 * @deprecated use new validatorPlugin instead
 */
export const CombiningHandler: React.FC<WidgetPluginProps & Partial<WithValue>> = (props) => {
    const {schema: baseSchema, value, currentPluginIndex} = props
    const schema = useSchemaCombine(props.validate, baseSchema, value)
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} schema={schema}/>
}
