/**
 * @param {Map} schema
 * @param {Map} dyn_schema
 * @return {*}
 */
const mergeSchema = (schema, dyn_schema) => {
    if(dyn_schema.get('format')) {
        schema = schema.set('format', dyn_schema.get('format'));
    }

    if(dyn_schema.get('properties')) {
        if(schema.get('properties')) {
            schema = schema.set('properties', schema.get('properties').mergeDeep(dyn_schema.get('properties')));
        } else {
            schema = schema.set('properties', dyn_schema.get('properties'));
        }
    }

    if(dyn_schema.get('required')) {
        if(schema.get('required')) {
            schema = schema.set('required', schema.get('required').concat(dyn_schema.get('required')));
        } else {
            schema = schema.set('required', dyn_schema.get('required'));
        }
    }

    if(dyn_schema.get('widget')) {
        schema = schema.set('widget', dyn_schema.get('widget'));
    }
    if(dyn_schema.get('enum')) {
        schema = schema.set('enum', dyn_schema.get('enum'));
    }
    if(dyn_schema.get('const')) {
        schema = schema.set('const', dyn_schema.get('const'));
    }

    // todo: which more keywords of the matched `nestedSchema` should be merged into the `schema`?

    return schema;
};

export {mergeSchema}
