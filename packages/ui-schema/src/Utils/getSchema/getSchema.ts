import { Map } from 'immutable'

export const getSchemaId = (schema: Map<unknown, unknown>): string | undefined => {
    // till draft-06, no `$`, hashtag in id
    const id = schema?.get('$id') || schema?.get('id')
    return typeof id === 'string' ? id : undefined
}
