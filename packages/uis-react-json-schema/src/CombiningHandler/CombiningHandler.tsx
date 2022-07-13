import React from 'react'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaCombine } from '@ui-schema/react-json-schema/CombiningHandler'
import { WithValue } from '@ui-schema/react/UIStore'

export const CombiningHandler = <P extends WidgetPluginProps & Partial<WithValue>>(props: P): React.ReactElement => {
    const {schema: baseSchema, value, currentPluginIndex} = props
    const schema = useSchemaCombine(baseSchema, value)
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} schema={schema}/>
}
