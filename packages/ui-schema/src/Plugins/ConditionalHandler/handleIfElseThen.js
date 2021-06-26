import {validateSchemaObject} from '@ui-schema/ui-schema/validateSchema';
import {mergeSchema} from '@ui-schema/ui-schema/Utils/mergeSchema';

export const handleIfElseThen = (schema, store, distSchema) => {
    const keyIf = schema.get('if');
    const keyThen = schema.get('then');
    const keyElse = schema.get('else');

    if(keyIf) {
        if(0 === validateSchemaObject(keyIf, store).errCount) {
            // no errors in schema found, `then` should be rendered
            if(keyThen) {
                distSchema = mergeSchema(distSchema, keyThen);
            }
        } else {
            // errors in schema found, `else` should be rendered
            if(keyElse) {
                distSchema = mergeSchema(distSchema, keyElse);
            }
        }
    }

    return distSchema;
};
