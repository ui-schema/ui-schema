import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'

export type ValidateStateNested = {
    validate: ValidateFn
    /**
     * @todo implement root schema/context
     * @todo move into params? as `params` is often passed down in nested contexts, yet not `state` itself
     * @todo for full support of resolving embedded templates, it must not be a simple schema, but more like a registry
     */
    root?: any
    resource?: {
        findRef: (canonicalRef: string) => { value: () => any } | undefined
    }
}

export type ValidateStateOutput = {
    output: ValidatorOutput
}

export type ValidateState =
    ValidateStateNested &
    ValidateStateOutput

export type ValidateLocationParams = {
    instanceLocation: (number | string)[]
    /**
     * The keyword location, including by-reference applicators.
     * Used for building the `keywordLocation`.
     * @see {@link https://json-schema.org/draft/2020-12/json-schema-core#section-12.3.1}
     */
    keywordLocation: (number | string)[]
    /**
     * The current instance own key, or undefined for the root.
     */
    instanceKey?: number | string

    /**
     * The keyword location, dereferenced.
     * Used for building the `absoluteKeywordLocation`.
     * @todo implement
     * @see {@link https://json-schema.org/draft/2020-12/json-schema-core#section-12.3.2}
     */
    absoluteKeywordLocation?: (number | string)[]
    /**
     * The current canonical uri of the schema resource, it's base uri.
     * Used for building the `absoluteKeywordLocation`.
     * @todo implement
     */
    canonicalUri?: string

    /**
     * Especially for compatibility with `<=0.4.x` `required` validation.
     */
    parentSchema?: any
}

export type ValidateControlParams = {
    /**
     * @todo implement? for that which uses `found`?!
     */
    failFast?: boolean
    /**
     * Controls if all levels are validated or only the current instance.
     *
     * Recursive enables validation of:
     * - for object: `properties`
     * - for array: `items`
     */
    recursive?: boolean
}

export type ValidateParams =
    ValidateLocationParams &
    ValidateControlParams

export type ValidateFn = <TData = unknown>(
    schema: any,
    value: unknown,
    params?: ValidateParams,
    state?: Partial<ValidateState>,
) =>
    ({ valid: true, value: TData, errors?: never } & ValidationDetails) |
    ({ valid: false, errors: ValidatorOutput['errors'] } & ValidationDetails)

export interface ValidationDetails {
    applied?: any[]
    context?: {
        evaluatedProperties?: string[]
    }
}
