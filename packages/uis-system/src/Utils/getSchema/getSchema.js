export const getSchemaId = (schema) => {
    // till draft-06, no `$`, hashtag in id
    return schema?.get('$id') || schema?.get('id')
}
