import * as React from 'react'

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' && typeof window.document !== 'undefined'
        ? React.useLayoutEffect
        : React.useEffect

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
    // directly set/update the current compare value towards global
    bubbleBounce: (currentVal: T | undefined) => void
    bounceVal: DebounceValue<T>
    setBounceVal: React.Dispatch<React.SetStateAction<DebounceValue<T>>>
    changeBounceVal: (value: T | undefined) => void
} => {
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const [bounceVal, setBounceVal] = React.useState<DebounceValue<T>>({changed: false, value: undefined})
    useIsomorphicLayoutEffect(() => {
        setBounceVal({changed: false, value: value as T})
        return () => clearTimeout(timer.current)
    }, [value, timer])

    React.useEffect(() => {
        if (typeof bounceVal.value === 'undefined' || !bounceVal.changed) return
        timer.current = setTimeout(() => {
            setter(bounceVal.value)
        }, debounceTime)
        return () => clearTimeout(timer.current)
    }, [
        bounceVal, setBounceVal,
        debounceTime, timer, setter,
    ])

    const bubbleBounce = React.useCallback((currentVal) => {
        if (bounceVal.value === currentVal) return
        clearTimeout(timer.current)
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
