export const SchemaPluginStack = (props, schemaPlugins) => {
    if (schemaPlugins && Array.isArray(schemaPlugins)) {
        schemaPlugins.forEach(propsPlugin => {
            if (typeof propsPlugin.handle !== 'function') {
                return
            }

            if (typeof propsPlugin.should === 'function') {
                if (!propsPlugin.should(props)) {
                    if (typeof propsPlugin.noHandle === 'function') {
                        props = {...props, ...propsPlugin.noHandle(props)}
                    }
                    return
                }
            }

            props = {...props, ...propsPlugin.handle(props)}
        })
    }

    return props
}
