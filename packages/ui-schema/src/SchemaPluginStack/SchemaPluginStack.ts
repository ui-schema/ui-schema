import { SchemaPlugin, SchemaPluginProps } from '@ui-schema/ui-schema/SchemaPlugin'

export const SchemaPluginStack = <TProps extends SchemaPluginProps>(
    props: TProps,
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
