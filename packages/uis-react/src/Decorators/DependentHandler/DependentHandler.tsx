import React from 'react'
import { useUIStore } from '@ui-schema/react/UIStore'
import { mergeSchema } from '@ui-schema/system/Utils/mergeSchema'
import { List, Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { DecoratorPropsNext } from '@tactic-ui/react/Deco'

interface DependentRendererProps {
    dependencies?: List<string> | UISchemaMap
    dependentSchemas?: UISchemaMap
    dependentRequired?: List<string>
}

const DependentRenderer = <P extends WidgetProps & DecoratorPropsNext>(
    {dependencies, dependentSchemas, dependentRequired, ...props}: P & DependentRendererProps
) => {
    const {schema, storeKeys} = props
    const {store} = useUIStore()

    const currentValues = storeKeys.size ? store?.getValues()?.getIn(storeKeys) : store?.getValues()

    const parsedSchema = React.useMemo(() => {
        let parsedSchema = schema
        if (!currentValues) return parsedSchema
        currentValues.keySeq().forEach(key => {
            const key_dependencies = dependencies ? dependencies.get(key) : undefined
            const key_dependentSchemas = dependentSchemas ? dependentSchemas.get(key) : undefined
            const key_dependentRequired = dependentRequired ? dependentRequired.get(key) : undefined

            // todo: what if the `key`'s own schema should be dynamically changed?
            //   what to remove?
            //   what to keep? when keeping e.g. `const` it could destroy `enum`s

            // "if property is present", must not use "if correct type"
            if (typeof currentValues.get(key) !== 'undefined') {
                if (Map.isMap(key_dependencies) || Map.isMap(key_dependentSchemas)) {
                    // schema-dependencies
                    // value for dependency exist, so it should be used
                    if (Map.isMap(key_dependencies)) {
                        // @ts-ignore
                        parsedSchema = mergeSchema(parsedSchema, key_dependencies)
                    } else {
                        parsedSchema = mergeSchema(parsedSchema, key_dependentSchemas)
                    }
                }
                if (List.isList(key_dependencies) || List.isList(key_dependentRequired)) {
                    // property-dependencies
                    // value for dependency exist, so it should be used
                    const currentRequired = parsedSchema.get('required') || List()
                    if (List.isList(key_dependencies)) {
                        parsedSchema = parsedSchema.set('required', currentRequired.concat(key_dependencies))
                    } else {
                        parsedSchema = parsedSchema.set('required', currentRequired.concat(key_dependentRequired))
                    }
                }
            }
        })
        return parsedSchema
    }, [currentValues, schema, dependencies, dependentSchemas, dependentRequired])

    const Next = props.next(props.decoIndex + 1)
    return <Next {...props} schema={parsedSchema} decoIndex={props.decoIndex + 1}/>
}

export const DependentHandler = <P extends WidgetProps & DecoratorPropsNext>(props: P): React.ReactElement<P> => {
    const {schema} = props

    const dependencies = schema.get('dependencies')
    const dependentSchemas = schema.get('dependentSchemas')
    const dependentRequired = schema.get('dependentRequired')

    const Next = props.next(props.decoIndex + 1)
    return dependencies || dependentSchemas || dependentRequired ?
        <DependentRenderer
            dependencies={dependencies}
            dependentSchemas={dependentSchemas}
            dependentRequired={dependentRequired}
            {...props}
        /> :
        <Next {...props} decoIndex={props.decoIndex + 1}/>
}
