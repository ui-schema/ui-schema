import React from 'react'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'

export const ValidityReporter: React.FC<WidgetPluginProps> = (props) => {
    const [customError, setCustomError] = React.useState(false)
    const {onChange, showValidity, storeKeys, valid, Next} = props

    const storeKeysRef = useImmutable(storeKeys)

    const realValid = !customError && valid

    React.useEffect(() => {
        // todo: use `errors` instead of `valid`, but only if not `valid` and `hasErrors`
        // todo: this will run on each mount, check if necessary
        onChange({
            type: 'set',
            storeKeys: storeKeysRef,
            scopes: ['valid'],
            data: {
                valid: realValid,
            },
        })
    }, [realValid, onChange, storeKeysRef])

    React.useEffect(() => {
        // delete own validity state on component unmount
        //return () => onChange(storeKeysRef, ['valid'], () => ({valid: undefined}))
        return () =>
            onChange({
                type: 'set',
                storeKeys: storeKeysRef,
                scopes: ['valid'],
                data: {
                    valid: undefined,
                },
            })
        /*return () => onChange({
            type: 'element-delete',
            storeKeys: storeKeysRef,
            scopes: ['valid'],
        })*/
    }, [onChange, storeKeysRef])

    return <Next.Component
        {...props}
        valid={valid}
        showValidity={showValidity}
        setCustomError={setCustomError}
    />
}
