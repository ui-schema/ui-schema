export const InheritKeywords = (keywords: string[]) => ({
    should: () => true,
    handle: ({ parentSchema, schema }: any) => {
        let newSchema = schema

        if (parentSchema) {
            keywords.forEach(keyword => {
                let foundKeyword = parentSchema.get(keyword)
                if (foundKeyword !== undefined) {
                    newSchema = newSchema.set(keyword, foundKeyword)
                }
            });
        }
        return { schema: newSchema }
    }
});
