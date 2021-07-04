import {Map} from 'immutable';

export const relT = (schema, context, locale) => {
    if(Map.isMap(schema) && context && context.get('relative')) {
        const relSchema = locale ? schema.get(locale) : schema;
        if(relSchema) {
            const schemaT = relSchema.getIn(context.get('relative'));
            if(schemaT) return schemaT;
        }
    }

    return undefined;
};

export const relTranslator = (_text, context, schema = undefined) =>
    relT(schema, context)
