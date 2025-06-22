/* eslint-disable @typescript-eslint/no-deprecated */
import React from 'react'
import { Translate } from '@ui-schema/react/Translate'
import {
    SchemaRootContext, SchemaRootProvider,
    isRootSchema, useSchemaRoot,
} from '@ui-schema/react-json-schema/SchemaRootProvider'
import { useSchemaRef } from '@ui-schema/react-json-schema/ReferencingHandler'
import { NextPluginRendererMemo, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { getSchemaId } from '@ui-schema/ui-schema/Utils/getSchema'

/**
 * @deprecated use new validatorPlugin with SchemaResource instead
 */
export const ReferencingHandler: React.FC<WidgetPluginProps & { rootContext?: { [k: string]: any } }> = ({rootContext, ...props}) => {
    const {schema: baseSchema, isVirtual} = props
    const {schema: maybeRootSchema, definitions: maybeDefinitions, ...nestedRootProps} = useSchemaRoot()
    const isRoot = Boolean(isRootSchema(baseSchema) || rootContext || baseSchema.get('definitions') || baseSchema.get('$defs'))
    const definitions = (isRoot ? baseSchema.get('definitions') || baseSchema.get('$defs') : maybeDefinitions) as SchemaRootContext['definitions']
    const {schema, refsPending} = useSchemaRef(
        maybeRootSchema, definitions, isRoot, baseSchema,
    )

    return (
        refsPending && refsPending.size > 0 ?
            isVirtual ? null : <Translate text={'labels.loading'} fallback={'Loading'}/> :
            isRoot ?
                <SchemaRootProvider {...nestedRootProps} {...(rootContext || {})} id={getSchemaId(schema)} schema={schema} definitions={definitions}>
                    <NextPluginRendererMemo {...props} schema={schema}/>
                </SchemaRootProvider> :
                <NextPluginRendererMemo {...props} schema={schema}/>
    ) as unknown as React.ReactElement
}
