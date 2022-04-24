import React from 'react'
import { getNextPlugin, PluginProps } from '@ui-schema/ui-schema/PluginStack'
import { useSchemaCombine } from '@ui-schema/ui-schema/Plugins/CombiningHandler/useSchemaCombine'
import { WithValue } from '@ui-schema/ui-schema/UIStore'

export const CombiningHandler: React.ComponentType<PluginProps & Partial<WithValue>> = (props) => {
    const {schema: baseSchema, value, currentPluginIndex} = props
    const schema = useSchemaCombine(baseSchema, value)
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} schema={schema}/>
}
