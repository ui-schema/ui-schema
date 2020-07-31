/**
 * Merges schema `b` into `a`
 * @param {Map} aSchema
 * @param {Map} bSchema
 * @return {*}
 */
export const mergeSchema = (aSchema, bSchema) => {
    if(bSchema.get('type')) {
        aSchema = aSchema.set('type', bSchema.get('type'));
    }
    if(bSchema.get('format')) {
        aSchema = aSchema.set('format', bSchema.get('format'));
    }

    if(bSchema.get('properties')) {
        if(aSchema.get('properties')) {
            aSchema = aSchema.set('properties', aSchema.get('properties').mergeDeep(bSchema.get('properties')));
        } else {
            aSchema = aSchema.set('properties', bSchema.get('properties'));
        }
    }

    if(bSchema.get('required')) {
        if(aSchema.get('required')) {
            aSchema = aSchema.set('required', aSchema.get('required').concat(bSchema.get('required')));
        } else {
            aSchema = aSchema.set('required', bSchema.get('required'));
        }
    }

    if(bSchema.get('widget')) {
        aSchema = aSchema.set('widget', bSchema.get('widget'));
    }
    if(bSchema.get('enum')) {
        aSchema = aSchema.set('enum', bSchema.get('enum'));
    }
    if(bSchema.get('const')) {
        aSchema = aSchema.set('const', bSchema.get('const'));
    }
    if(bSchema.get('not')) {
        aSchema = aSchema.set('not', bSchema.get('not'));
    }

    // todo: should all of the current merged, like they are merged
    // todo: which more keywords of the matched `nestedSchema` should be merged into the `schema`?

    return aSchema;
};
