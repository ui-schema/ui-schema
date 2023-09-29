import React from 'react'
import { useSchemaCombine } from '@ui-schema/react/Decorators/CombiningHandler'
import { WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { DecoratorPropsNext } from '@tactic-ui/react/Deco'

export const CombiningHandler = <P extends WidgetProps & DecoratorPropsNext & WithValue>(props: P): React.ReactElement<P> => {
    const {schema: baseSchema, value} = props
    const schema = useSchemaCombine(baseSchema, value)
    const Next = props.next(props.decoIndex + 1)
    return <Next {...props} decoIndex={props.decoIndex + 1} schema={schema}/>
}
