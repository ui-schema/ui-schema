import { FC } from 'react'
import { NextPluginRendererMemo, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { handleIfElseThen } from './handleIfElseThen.js'

/**
 * @deprecated use new validatorPlugin instead
 */
export const ConditionalHandler: FC<WidgetPluginProps> = (props) => {
    const {value, validate} = props
    let {schema} = props

    const keyIf = schema.get('if')

    if (keyIf && validate) {
        schema = handleIfElseThen(schema, value, schema, {validate: validate})
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>
}
