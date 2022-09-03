import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const getSchemaId = (schema: UISchemaMap): string | undefined => {
    // till draft-06, no `$`, hashtag in id
    return schema?.get('$id') || schema?.get('id')
}
