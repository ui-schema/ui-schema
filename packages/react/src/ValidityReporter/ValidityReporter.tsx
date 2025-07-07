import React from 'react'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'

export const ValidityReporter: React.FC<WidgetPluginProps> = (props) => {
    const [customError, setCustomError] = React.useState(false)
    const {onChange, showValidity, storeKeys, valid, errors, Next} = props

    const errorsRef = useImmutable(errors)

    const realValid = !customError && valid

    React.useEffect(() => {
        // todo: this should use a more sophisticated state operation, which doesn't result in a rerender,
        //       when `errors` are not memoized here, this can lead to react update depth overflow.
        onChange({
            type: 'set',
            storeKeys: storeKeys,
            scopes: ['valid'],
            data: {
                valid: {
                    valid: realValid,
                    errors: errorsRef,
                },
            },
        })
    }, [realValid, errorsRef, onChange, storeKeys])

    React.useEffect(() => {
        // delete own validity state on component unmount
        //return () => onChange(storeKeysRef, ['valid'], () => ({valid: undefined}))
        return () =>
            onChange({
                type: 'set',
                storeKeys: storeKeys,
                scopes: ['valid'],
                data: {
                    valid: undefined,
                },
            })
        /*return () => onChange({
            type: 'element-delete',
            storeKeys: storeKeys,
            scopes: ['valid'],
        })*/
    }, [onChange, storeKeys])

    return <Next.Component
        {...props}
        valid={valid}
        showValidity={showValidity}
        setCustomError={setCustomError}
    />
}
