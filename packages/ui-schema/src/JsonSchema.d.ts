export interface Schemas {
    all: {
        readOnly?: boolean
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
}

export type JsonSchema =
    Schemas['string']
    | Schemas['array']
    | Schemas['object']
    | Schemas['number']
    | Schemas['boolean']
    | Schemas['null']
    & Schemas['all']
