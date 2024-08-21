import React from 'react'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { DecoratorPropsNext, ReactBaseDecorator } from '@ui-schema/react/WidgetDecorator'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithValue } from '@ui-schema/react/UIStore'

export const ValidityReporter = <P extends DecoratorPropsNext & WidgetProps & WithValue>(
    props: P & { valid: boolean },
): React.ReactElement<P & { valid: boolean }> => {
    const [customError, setCustomError] = React.useState(false)
    const {onChange, showValidity, storeKeys, valid} = props
    const Next = props.next(props.decoIndex + 1) as ReactBaseDecorator<P & { valid: boolean }>

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

    return <Next
        {...props}
        valid={valid}
        showValidity={showValidity}
        setCustomError={setCustomError}
        decoIndex={props.decoIndex + 1}
    />
}
