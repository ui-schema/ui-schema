import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'

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
    /**
     * @todo refactor to a class with methods to easier add things?
     */
    context: {
        /**
         * @todo use a map with properties and their schemas or more information instead of just the schema?
         */
        evaluatedProperties?: Map<string, any[]>
        /**
         * @todo implement
         */
        evaluatedItems?: unknown
    }
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
    params?: ValidateParams & Partial<ValidateState>,
) => ValidateResult<TData>

/**
 * @todo unify with `ValidationResult` from `/ValidatorOutput`
 */
export type ValidateResult<TData = unknown> =
    ({ valid: true, value: TData, errors?: never } & ValidationDetails) |
    ({ valid: false, errors: ValidatorOutput['errors'] } & ValidationDetails)

export interface ValidationDetails {
    /**
     * A list of `schema` which are applied to the current field.
     *
     * @todo track the location of where the applied schema comes from,
     *       should contain, if possible, the absolute pointer and
     *       the relative pointer based on the current schema layer,
     *       while the first would be needed once the validation happens centrally,
     *       and the second for incremental rendering validation, where schemas could
     *       already been partially merged, e.g. `allOf` in properties, which for properties
     *       are merged once the property is rendered, and here some cleanup would be helpful,
     *       from performance optimization (due to less re-rendering, memo),
     *       or also preventing conflicting and recursive evaluation of already merged schemas.
     *       Thus the allOf for a property should be removed once merged,
     *       but also collect meta data like all applied $ref,
     *       and see if there (via `SchemaPluginsAdapter` or `Validator`) "on schema" callbacks can be added,
     *       to provide e.g. custom reduction logic, like deciding how to resolve conflicting keywords:
     *       "`hidden` keyword exists in n-applied schemas, any of the keyword values is `true`, then enable `hidden`"
     *       (this would prevent `false` from overwriting another active `true`).
     *       Tracking and running these reductions on keyword level could allow an
     *       easier integrated cleanup of those expected to be handled.
     *       ---
     *       For the moment, basic happy path reduction is hard coded in `@ui-schema/json-schema/validatorPlugin`,
     *       switch that plugin with your own implementation or use either schemaPlugins or WidgetPlugins to modify the merged schema.
     */
    applied?: any[]
}
