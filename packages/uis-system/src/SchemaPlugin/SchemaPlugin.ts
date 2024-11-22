import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'
import { WidgetPayload } from '@ui-schema/system/Widget'

/**
 * @todo normalize with `WithValue` once finalized stricter widget/plugin props overall
 */
export interface WithValuePlain {
    value: unknown
}

export interface WithValidatorErrors {
    errors: ValidatorErrorsType
}

/**
 * @todo refine `WidgetPayload` usage, including the Partial,
 *       e.g. `storeKeys` should be always available, yet not every plugin requires it,
 *       thus in tests would be often unnecessary
 *       - `noHandle` should not mutate errors, so don't pass down?
 *       - `should` doesn't need to get errors, as plugins may not rely on `errors` to decide if they should run
 */
export interface SchemaPlugin<TProps extends WidgetPayload = WidgetPayload> {
    handle: (props: Partial<TProps> & WithValuePlain & WithValidatorErrors) => Partial<TProps & WithValuePlain & WithValidatorErrors>
    noHandle?: (props: Partial<TProps> & WithValuePlain & WithValidatorErrors) => Partial<TProps & WithValuePlain & WithValidatorErrors>
    should?: (props: Partial<TProps> & WithValuePlain & WithValidatorErrors) => boolean
}
