import { SchemaPlugin, WithValidatorErrors, WithValuePlain } from '@ui-schema/system/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/system/Widget'

export const SchemaPluginStack = <TProps extends WidgetPayload>(
    props: TProps & WithValuePlain & WithValidatorErrors,
    schemaPlugins: SchemaPlugin<TProps>[],
) => {
    if (schemaPlugins && Array.isArray(schemaPlugins)) {
        schemaPlugins.forEach(propsPlugin => {
            if (typeof propsPlugin.handle !== 'function') {
                return
            }

            // eslint-disable-next-line @typescript-eslint/no-deprecated
            if (typeof propsPlugin.should === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                if (!propsPlugin.should(props)) {
                    // eslint-disable-next-line @typescript-eslint/no-deprecated
                    if (typeof propsPlugin.noHandle === 'function') {
                        // eslint-disable-next-line @typescript-eslint/no-deprecated
                        props = {...props, ...propsPlugin.noHandle(props)}
                    }
                    return
                }
            }

            const partialProps = propsPlugin.handle(props)
            if (partialProps) {
                props = {...props, ...partialProps}
            }
        })
    }

    return props
}
