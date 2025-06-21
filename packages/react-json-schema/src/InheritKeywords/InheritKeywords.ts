import { WithValidatorErrors, WithValuePlain } from '@ui-schema/system/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/system/Widget'
import { OrderedMap } from 'immutable'

export const InheritKeywords =
    <TProps extends WidgetPayload>(
        keywords: (string | (string[]))[],
        should?: (props: Partial<TProps> & WithValuePlain & WithValidatorErrors) => boolean,
    ) => ({
        handle: (props: Partial<TProps> & WithValuePlain & WithValidatorErrors) => {
            if (should && !should(props)) return null

            const {parentSchema, schema} = props
            let newSchema = schema

            if (parentSchema) {
                keywords.forEach(keyword => {
                    const foundKeyword = Array.isArray(keyword) ?
                        parentSchema.getIn(keyword) :
                        parentSchema.get(keyword)
                    if (foundKeyword !== undefined) {
                        newSchema ||= OrderedMap()

                        newSchema = Array.isArray(keyword) ?
                            newSchema.setIn(keyword, foundKeyword) :
                            newSchema.set(keyword, foundKeyword)
                    }
                })
            }

            return {schema: newSchema}
        },
    })
