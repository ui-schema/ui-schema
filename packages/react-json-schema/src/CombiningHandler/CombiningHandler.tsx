/* eslint-disable @typescript-eslint/no-deprecated */
import React from 'react'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useSchemaCombine } from '@ui-schema/react-json-schema/CombiningHandler'
import { WithValue } from '@ui-schema/react/UIStore'

/**
 * @deprecated use new validatorPlugin instead
 */
export const CombiningHandler: React.FC<WidgetPluginProps & Partial<WithValue>> = ({Next, ...props}) => {
    const {schema: baseSchema, value} = props
    const schema = useSchemaCombine(props.validate, baseSchema, value)
    return <Next.Component {...props} schema={schema}/>
}
