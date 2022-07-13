import React from 'react'

export interface DebounceValue<T> {
    // must be `true` when this was a manual update from within this client, will be `false|undefined` when e.g. through a background update
    changed?: boolean
    value: T | undefined
}

export const useDebounceValue = <T>(
    value: T | undefined,
    debounceTime: number,
    setter: (val: T | undefined) => void,
): {
    // directly set/update the current comp value towards global
    bubbleBounce: (currentVal: T | undefined) => void
    bounceVal: DebounceValue<T>
    setBounceVal: React.Dispatch<React.SetStateAction<DebounceValue<T>>>
    changeBounceVal: (value: T | undefined) => void
} => {
    const timer = React.useRef<undefined | number>(undefined)
    const [bounceVal, setBounceVal] = React.useState<DebounceValue<T>>({changed: false, value: undefined})
    React.useEffect(() => {
        window.clearTimeout(timer.current)
        setBounceVal({changed: false, value: value as T})
    }, [value, timer])

    React.useEffect(() => {
        if (typeof bounceVal.value === 'undefined' || !bounceVal.changed) return
        timer.current = window.setTimeout(() => {
            setter(bounceVal.value)
        }, debounceTime)
        return () => window.clearTimeout(timer.current)
    }, [
        bounceVal, setBounceVal,
        debounceTime, timer, setter,
    ])

    const bubbleBounce = React.useCallback((currentVal) => {
        if (bounceVal.value === currentVal) return
        window.clearTimeout(timer.current)
        setter(bounceVal.value)
    }, [setter, bounceVal])

    const changeBounceVal = React.useCallback((nextVal) => {
        setBounceVal({changed: true, value: nextVal})
    }, [setBounceVal])

    return {
        bubbleBounce: bubbleBounce,
        bounceVal: bounceVal,
        setBounceVal: setBounceVal,
        changeBounceVal: changeBounceVal,
    }
}
