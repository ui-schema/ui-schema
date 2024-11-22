import React from 'react'
import { NextPluginRendererMemo, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { handleIfElseThen } from './handleIfElseThen.js'

export const ConditionalHandler: React.FC<WidgetPluginProps> = (props) => {
    const {value} = props
    let {schema} = props

    const keyIf = schema.get('if')

    if (keyIf) {
        schema = handleIfElseThen(schema, value, schema)
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>
}
