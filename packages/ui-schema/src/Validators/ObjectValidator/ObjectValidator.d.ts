import { List } from 'immutable'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export function validateObject(schema: StoreSchemaType, value: any): List<any>

export interface ObjectValidatorType extends ValidatorPlugin {
    should: ({schema}: Partial<EditorPluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: List<any>
        valid: boolean
    }
}

export const objectValidator: ObjectValidatorType
