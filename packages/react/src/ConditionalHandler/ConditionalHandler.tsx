/* eslint-disable @typescript-eslint/no-deprecated */
import type { FC } from 'react'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { handleIfElseThen } from './handleIfElseThen.js'

/**
 * @deprecated use new validatorPlugin instead
 */
export const ConditionalHandler: FC<WidgetPluginProps> = (props) => {
    const {value, validate, Next} = props
    let {schema} = props

    const keyIf = schema.get('if')

    if (keyIf && validate) {
        schema = handleIfElseThen(schema, value, schema, {validate: validate})
    }

    return <Next.Component {...props} schema={schema}/>
}
