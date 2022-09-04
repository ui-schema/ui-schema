import { UISchema } from '@ui-schema/json-schema/Definitions/UISchema'

export interface SchemasDraft04 {
    number: {
        exclusiveMinimum?: boolean
        exclusiveMaximum?: boolean
    } | {
        exclusiveMinimum: true
        minimum: number
    } | {
        exclusiveMaximum: true
        maximum: number
    }
}

export interface JsonSchemaGeneral {
    type: string | string[]
    readOnly?: boolean
    id?: string
    $id?: string
    $ref?: string
    version?: string
    $anchor?: string
    default?: any
    definitions?: {
        [key: string]: JsonSchema
    }
    $defs?: {
        [key: string]: JsonSchema
    }
    dependencies?: JsonSchemaGeneral['dependentSchemas'] | JsonSchemaGeneral['dependentRequired']
    dependentSchemas?: {
        [key: string]: JsonSchema
    }
    dependentRequired?: string[]
    'const'?: any | string | number
    'enum'?: any[]
    $comment?: string

    [key: string]: any
}

export interface JsonSchemaConditionals {
    if?: JsonSchema | {
        not: JsonSchema
    }
    else?: JsonSchema | {
        not: JsonSchema
    }
    then?: JsonSchema | {
        not: JsonSchema
    }
    allOf?: JsonSchema[] | {
        not: JsonSchema
    }[]
    oneOf?: JsonSchema[] | {
        not: JsonSchema
    }[]
}

export interface JsonSchemaObject extends JsonSchemaConditionals, JsonSchemaGeneral {
    type: 'object'
    minProperties?: number
    maxProperties?: number
    properties?: {
        [key: string]: JsonSchema
    }
    required?: string[]
    additionalProperties?: boolean
    propertyNames?: JsonSchema
}

export interface JsonSchemaRoot extends JsonSchemaConditionals, JsonSchemaGeneral {
    id?: string
    $id?: string
    $schema?: string
    $ref?: string
}

export interface JsonSchemaString extends JsonSchemaGeneral {
    type: 'string'
    minLength?: number
    maxLength?: number
    pattern?: string
}

export interface JsonSchemaBoolean extends JsonSchemaGeneral {
    type: 'boolean'
}

export type JsonSchemaItemsSchema = JsonSchema | JsonSchema[]

export interface JsonSchemaArray extends JsonSchemaGeneral {
    type: 'array'
    minItems?: number
    maxItems?: number
    items?: JsonSchemaItemsSchema
    uniqueItems?: boolean
    maxContains?: number
    minContains?: number
    contains?: JsonSchema
    additionalItems?: boolean
}

export interface JsonSchemaNumber extends JsonSchemaGeneral {
    type: 'number' | 'integer'
    minimum?: number
    maximum?: number
    exclusiveMinimum?: number
    exclusiveMaximum?: number
    multipleOf?: number
}

export interface JsonSchemaNull extends JsonSchemaGeneral {
    type: 'null'
}

export type JsonSchemaPure =
    JsonSchemaString |
    JsonSchemaArray |
    JsonSchemaObject |
    JsonSchemaNumber |
    JsonSchemaBoolean |
    JsonSchemaNull |
    JsonSchemaConditionals |
    JsonSchemaRoot

export type JsonSchemaPureAny =
    Partial<JsonSchemaString> &
    Partial<JsonSchemaArray> &
    Partial<JsonSchemaObject> &
    Partial<JsonSchemaNumber> &
    Partial<JsonSchemaBoolean> &
    Partial<JsonSchemaNull> &
    Partial<JsonSchemaConditionals> &
    Partial<JsonSchemaRoot>

// todo: this export breaks the build in external pure tsc (not babel/webpack) builds
//       m.b. note: like in the [private] orbiter-publish app
//export type JsonSchemaKeyValue<K> =
//    JsonSchemaString[K] |
//     JsonSchemaArray[K] |
//     JsonSchemaObject[K] |
//     JsonSchemaNumber[K] |
//     JsonSchemaBoolean[K] |
//     JsonSchemaNull[K] //|
// todo: somehow those two crash the `K` to value typing resolution for the IDE
// JsonSchemaConditionals[K] //|
// JsonSchemaRoot[K]

export type JsonSchemaKeys =
    keyof JsonSchemaString |
    keyof JsonSchemaArray |
    keyof JsonSchemaObject |
    keyof JsonSchemaNumber |
    keyof JsonSchemaBoolean |
    keyof JsonSchemaNull |
    keyof JsonSchemaConditionals |
    keyof JsonSchemaGeneral |
    keyof UISchema |
    keyof JsonSchemaRoot

//
// The two main typings for json schema & ui schema
//

/**
 * @todo switch from `JsonSchemaPureAny` to `JsonSchemaPure` again for stricter in-js typings,
 *       `PureAny` atm. is needed that e.g. `contains` nested schemas work with the new nested OrderedMap typing
 */
export type JsonSchema = JsonSchemaPureAny & UISchema
