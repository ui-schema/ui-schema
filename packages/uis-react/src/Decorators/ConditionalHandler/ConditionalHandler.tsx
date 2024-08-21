import React from 'react'
import { handleIfElseThen } from './handleIfElseThen'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { DecoratorPropsNext } from '@ui-schema/react/WidgetDecorator'
import { WithValue } from '@ui-schema/react/UIStore'

export const ConditionalHandler = <P extends WidgetProps & DecoratorPropsNext & WithValue>(props: P): React.ReactElement<P> => {
    const {value} = props
    let {schema} = props

    const keyIf = schema.get('if')

    if (keyIf) {
        schema = handleIfElseThen(schema, value, schema)
    }

    const Next = props.next(props.decoIndex + 1)

    return <Next {...props} schema={schema} decoIndex={props.decoIndex + 1}/>
}
