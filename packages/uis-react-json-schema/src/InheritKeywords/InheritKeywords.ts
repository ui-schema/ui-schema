import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack'

export const InheritKeywords = (
    keywords: (string | (string[]))[],
    should?: PluginSimple['should'],
): PluginSimple => ({
    should: should,
    handle: ({parentSchema, schema}: any) => {
        let newSchema = schema

        if(parentSchema) {
            keywords.forEach(keyword => {
                const foundKeyword = Array.isArray(keyword) ?
                    parentSchema.getIn(keyword) :
                    parentSchema.get(keyword)
                if(foundKeyword !== undefined) {
                    newSchema = Array.isArray(keyword) ?
                        newSchema.setIn(keyword, foundKeyword) :
                        newSchema.set(keyword, foundKeyword)
                }
            })
        }
        return {schema: newSchema}
    },
})
