import { UISchema } from "@ui-schema/ui-schema/UISchema"

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

export interface Schemas {
    root: {
        '$id': string
        '$schema': string
        '$ref'?: string
    }
    general: {
        readOnly?: boolean
        '$id'?: string
        '$schema'?: string
        '$ref'?: string
    }
    conditionals: {
        allOf: JsonSchema[] | {
            not: JsonSchema
        }[]
    }
    string: {
        type: 'string'
        minLength?: number
        maxLength?: number
    }
    boolean: {
        type: 'boolean'
    }
    array: {
        type: 'array'
        minItems?: number
        maxItems?: number
        items?: JsonSchema | JsonSchema[]
    }
    object: {
        type: 'object'
        minProperties?: number
        maxProperties?: number
        properties?: {
            [key: string]: JsonSchema
        }
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
    }
    number: {
        type: 'number' | 'integer'
        minimum?: number
        maximum?: number
        exclusiveMinimum?: number
        exclusiveMaximum?: number
        multipleOf?: number
    }
    null: {
        type: 'null'
    }
    hyper: {
        base?: string
    } | {
        base: string
        links: {
            rel: string | 'self' | 'collection' | 'item' | 'about'
            href: string
            contextUri?: string
            contextPointer?: string
            targetUri?: string
            targetSchema?: { '$ref': string }
            submissionSchema?: { '$ref': string }
            templateRequired?: string[]
            attachmentPointer?: string
        }[]
    }
}

export type JsonSchema =
    Schemas['string']
    | Schemas['array']
    | Schemas['object']
    | Schemas['number']
    | Schemas['boolean']
    | Schemas['null']
    | Schemas['conditionals']
    | Schemas['root']
    & Schemas['general']
    & UISchema
