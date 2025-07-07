import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import { WidgetPayloadFieldLocation, WidgetPayloadFieldSchema } from '@ui-schema/ui-schema/Widget'

/**
 * @todo should it be the actual state class? now only added from within the validator schema plugin
 */
export interface WithValidatorErrors {
    errors?: ValidationErrorsImmutable
}

export interface SchemaPluginProps extends WidgetPayloadFieldLocation, WidgetPayloadFieldSchema, WithValidatorErrors {
}

/**
 * @todo refine `WidgetPayload*` usage,
 *       e.g. `storeKeys` should be always available, yet not every plugin requires it,
 *       thus in tests would be often unnecessary
 */
export interface SchemaPlugin<TProps extends SchemaPluginProps, TResult extends Partial<TProps> | null = Partial<TProps> | null> {
    handle: (props: TProps) => TResult
    /**
     * @deprecated no replacement, move logic into `handle`
     */
    noHandle?: (props: TProps) => TResult
    /**
     * @deprecated no replacement, move logic into `handle`
     */
    should?: (props: TProps) => boolean
}
