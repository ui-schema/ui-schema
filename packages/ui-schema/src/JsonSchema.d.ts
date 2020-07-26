export interface schemas {
    string: {
        type: 'string',
        minLength?: number,
        maxLength?: number
    },
    array: {
        type: 'array',
        minItems?: number,
        maxItems?: number
    },
    object: {
        type: 'object',
        minProperties?: number,
        maxProperties?: number
    },
    number: {
        type: 'number' | 'integer',
        minimum?: number,
        maximum?: number,
        exclusiveMinimum?: number,
        exclusiveMaximum?: number,
        multipleOf?: number
    }
}

export type JsonSchema = schemas['string'] | schemas['array'] | schemas['object'] | schemas['number'] | {
    type: 'null'
}
