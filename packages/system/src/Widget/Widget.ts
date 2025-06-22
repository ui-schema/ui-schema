import { SomeSchema } from '@ui-schema/system/CommonTypings'
import { ValidateFn } from '@ui-schema/system/Validate'
import { ValidationErrorsImmutable } from '@ui-schema/system/ValidatorOutput'
import { StoreKeys } from '@ui-schema/system/ValueStore'

/**
 * Base widget props which are expected to exist no matter which data "type" the widget is for
 * - for only-scalar widgets add `WithScalarValue`
 * - for any-value-type widgets add `WithValue` and use the HOC `extractValue`
 * - `C` = custom `UIMetaContext` definition
 */
export interface WidgetPayload extends WidgetFieldLocationProps, WidgetFieldSchemaProps {
    // `required` is created inside validator plugin
    required?: boolean

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

export interface WidgetFieldLocationProps {
    /**
     * All properties and indices to the value location.
     */
    storeKeys: StoreKeys
}

export interface WidgetFieldSchemaProps {
    /**
     * the current schema level
     *
     * @todo wrong reliance, `/system` should not depend on `/json-schema`
     *       either move WidgetPayload out or make generic?
     */
    schema: SomeSchema

    /**
     * `parentSchema` will only be `undefined` in the root level of a schema
     *
     * @todo wrong reliance, `/system` should not depend on `/json-schema`
     *       either move WidgetPayload out or make generic?
     *       > better with SomeSchema, but
     */
    parentSchema?: SomeSchema | undefined
}
