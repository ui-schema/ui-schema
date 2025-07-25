/* eslint-disable @typescript-eslint/no-deprecated */
import * as React from 'react'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaCombine } from '@ui-schema/react/CombiningHandler'

/**
 * @deprecated use new validatorPlugin instead
 */
export const CombiningHandler: React.FC<WidgetPluginProps> = ({Next, ...props}) => {
    const {schema: baseSchema, value} = props
    const schema = useSchemaCombine(props.validate, baseSchema, value)
    return <Next.Component {...props} schema={schema}/>
}
