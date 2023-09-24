import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

/**
 * @todo refactor and remove from usages where possible, maybe use `@tactic-ui/engine/Deco` (not ReactDeco) here in the future?
 */
export interface SchemaValidatorContext {
    errors: ValidatorErrorsType
    valid: boolean
}

export const SchemaPluginStack = <P extends WidgetProps & WithValue & SchemaValidatorContext>(props: P, schemaPlugins: SchemaPlugin[]): P => {
    if (schemaPlugins && Array.isArray(schemaPlugins)) {
        schemaPlugins.forEach(schemaPlugin => {
            if (typeof schemaPlugin.handle !== 'function') {
                return
            }

            if (typeof schemaPlugin.should === 'function') {
                if (!schemaPlugin.should(props)) {
                    if (typeof schemaPlugin.noHandle === 'function') {
                        props = {...props, ...schemaPlugin.noHandle(props)}
                    }
                    return
                }
            }

            props = {...props, ...schemaPlugin.handle(props)}
        })
    }

    return props
}
