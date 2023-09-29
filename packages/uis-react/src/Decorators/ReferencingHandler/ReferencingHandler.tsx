import React from 'react'
import { Translate } from '@ui-schema/react/Translate'
import {
    SchemaRootContext, SchemaRootProvider,
    isRootSchema, useSchemaRoot,
} from '@ui-schema/react/SchemaRootProvider'
import { useSchemaRef } from '@ui-schema/react/Decorators/ReferencingHandler'
import { getSchemaId } from '@ui-schema/system/Utils/getSchema'
import { DecoratorPropsNext } from '@tactic-ui/react/Deco'
import { WidgetProps } from '@ui-schema/react/Widgets'

export interface ReferencingHandlerProps {
    rootContext?: { [k: string]: any }
}

export const ReferencingHandler = <P extends WidgetProps & DecoratorPropsNext>(
    {rootContext, ...props}: P & ReferencingHandlerProps,
): React.ReactElement<P> => {
    const {schema: baseSchema, isVirtual} = props
    const {schema: maybeRootSchema, definitions: maybeDefinitions, ...nestedRootProps} = useSchemaRoot()
    const isRoot = Boolean(isRootSchema(baseSchema) || rootContext || baseSchema.get('definitions') || baseSchema.get('$defs'))
    const definitions = (isRoot ? baseSchema.get('definitions') || baseSchema.get('$defs') : maybeDefinitions) as SchemaRootContext['definitions']
    const {schema, refsPending} = useSchemaRef(
        maybeRootSchema, definitions, isRoot, baseSchema,
    )

    const Next = props.next(props.decoIndex + 1)

    return (
        refsPending && refsPending.size > 0 ?
            isVirtual ? null : <Translate text={'labels.loading'} fallback={'Loading'}/> :
            isRoot ?
                <SchemaRootProvider {...nestedRootProps} {...(rootContext || {})} id={getSchemaId(schema)} schema={schema} definitions={definitions}>
                    <Next {...props} schema={schema} decoIndex={props.decoIndex + 1}/>
                </SchemaRootProvider> :
                <Next {...props} schema={schema} decoIndex={props.decoIndex + 1}/>
    ) as unknown as React.ReactElement
}
