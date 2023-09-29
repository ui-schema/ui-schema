import { UISchemaMap } from '@ui-schema/system/Definitions'

export const schemaRulesToNative = <K extends {}>(inputProps: K = {} as K, schema: UISchemaMap): K => {
    if (typeof schema.get('minLength') === 'number') {
        inputProps['minLength'] = schema.get('minLength')
    }
    if (typeof schema.get('maxLength') === 'number') {
        inputProps['maxLength'] = schema.get('maxLength')
    }
    if (typeof schema.get('minimum') === 'number') {
        // todo add exclusive
        inputProps['min'] = schema.get('minimum')
    }
    if (typeof schema.get('maximum') === 'number') {
        // todo add exclusive
        inputProps['max'] = schema.get('maximum')
    }
    if (typeof schema.get('multipleOf') === 'number') {
        inputProps['step'] = schema.get('multipleOf')
    }
    if (schema.get('pattern')) {
        inputProps['pattern'] = schema.get('pattern')
    }

    return inputProps
}
