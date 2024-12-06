import { ValidateFn } from '@ui-schema/system/Validate'
import { ValidationErrorsImmutable } from '@ui-schema/system/ValidatorOutput'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetPayload {
    /**
     * the current schema level
     *
     * @todo wrong reliance, `/system` should not depend on `/json-schema`
     *       either move WidgetPayload out or make generic?
     */
    schema: UISchemaMap
    /**
     * `parentSchema` will only be `undefined` in the root level of a schema
     *
     * @todo wrong reliance, `/system` should not depend on `/json-schema`
     *       either move WidgetPayload out or make generic?
     */
    parentSchema?: UISchemaMap | undefined

    /**
     * all indices of the current widget
     */
    storeKeys: StoreKeys
    /**
     * all indices of the currently *resolved* position in the schema
     *
     * @experimental
     */
    schemaKeys?: StoreKeys

    // `required` is created inside validator plugin
    required: boolean

    // todo: extract to validator typings, extend here
    // `errors` and `valid` are created inside validator plugins
    errors?: ValidationErrorsImmutable
    valid?: boolean

    // overridable store value:
    showValidity?: boolean

    /**
     * @todo move into UIMeta context (and typing)?
     */
    validate?: ValidateFn

    // contains the value for non-scalar items, for objects/array it is undefined
    // use typing `WithScalarValue` for those, otherwise for `array`/`object` checkout the HOC: `extractValue` and typing `WithValue`
}