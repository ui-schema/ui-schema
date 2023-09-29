import { UISchemaMap } from '@ui-schema/system/Definitions'

export const getSchemaId = (schema: UISchemaMap): string | undefined => {
    // till draft-06, no `$`, hashtag in id
    return schema?.get('$id') || schema?.get('id')
}
