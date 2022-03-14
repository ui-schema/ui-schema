import React from 'react'
import { getNextPlugin } from '@ui-schema/ui-schema/PluginStack/PluginStack'
import { useSchemaCombine } from '@ui-schema/ui-schema/Plugins/CombiningHandler/useSchemaCombine'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack'
import { WithValue } from '@ui-schema/ui-schema/UIStore'

export const CombiningHandler: React.ComponentType<PluginProps & Partial<WithValue>> = (props) => {
    const {schema: baseSchema, value, currentPluginIndex} = props
    const schema = useSchemaCombine(baseSchema, value)
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} schema={schema}/>
}
