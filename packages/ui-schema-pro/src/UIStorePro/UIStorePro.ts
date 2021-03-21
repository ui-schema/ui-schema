import React from 'react'
import { List, Map, Record } from 'immutable'
import { createEmptyStore, onChangeHandler, storeUpdater, UIStoreType } from '@ui-schema/ui-schema'

export type redoHistory = (steps?: number) => void
export type undoHistory = (steps?: number) => void

// the time between change of content and writing to the history state
// during normal writing, the history state should not be updated constantly
const defaultDebounceTime: number = 380
// rate in which the store changes are saved to the history, e.g. `1` = every change, `4` = every 4th change
// works together with debouncing
// - if rate is e.g. `8` and someone made `5` changes within the debounce time, the last (5th) item is saved
// - thus nothing is lost, even when the rate was not fulfilled
const defaultUpdateRate: number = 6
// todo: implement
// maximum number of store changes in the history
// const defaultMaxItems: number = 200

export interface UIStoreProData {
    // index of the current active UIStore of the `list`
    activeIndex: number
    // always the current active UIStore
    current: UIStoreType
    // list of each changes to the UIStore
    list: List<UIStoreType>
    // for other setStore dependant infos
    opts: Map<string, any>
}

// @ts-ignore
class UIStorePro extends Record({
    activeIndex: 0,
    current: createEmptyStore('object'),
    list: List([createEmptyStore('object')]),
    opts: Map(),
}) implements UIStoreProData {
}

// @ts-ignore
export type UIStoreProType = Record<UIStoreProData> & UIStoreProData

export const makeStorePro = (type: string, initialStore: UIStoreType | any = undefined): UIStoreProType => {
    return new UIStorePro({
        activeIndex: 0,
        current: initialStore || createEmptyStore(type),
        list: List([initialStore || createEmptyStore(type)]),
    })
}

const initialChangeRater: { current: number, last: any } = {current: 0, last: undefined}

export interface UIStoreProOptions {
    debounceTime?: typeof defaultDebounceTime
    updateRate?: typeof defaultUpdateRate
    initialStore?: UIStoreType | any
    type: string
}

const defaultStoreOptions: UIStoreProOptions = {
    debounceTime: defaultDebounceTime,
    updateRate: defaultUpdateRate,
    initialStore: undefined,
    type: '',
}

export const toHistory = (prevStore: UIStoreProType, index: number): UIStoreProType => {
    if (index >= 0 && index < prevStore.list.size) {
        return prevStore
            .set('current', prevStore.list.get(index) as UIStoreType)
            .set('activeIndex', index)
    }
    return prevStore
}

export type setStorePro = React.Dispatch<React.SetStateAction<UIStoreProType>>

const doingValueSelector = ['opts', 'doingValue']

export const useStorePro = (
    {debounceTime = defaultDebounceTime, updateRate = defaultUpdateRate, type = defaultStoreOptions.type, initialStore = undefined}:
        UIStoreProOptions = defaultStoreOptions
): {
    reset: (type: string, initialStore?: UIStoreType) => void
    onChange: typeof onChangeHandler
    redoHistory: redoHistory
    undoHistory: undoHistory
    store: UIStoreProType
    setStore: setStorePro
} => {
    const timer = React.useRef<number | undefined>()
    const historyChangeRater = React.useRef(initialChangeRater)
    const historyDebounce = React.useRef<any[]>([])
    const [store, setStore] = React.useState<UIStoreProType>(() => makeStorePro(type, initialStore) as UIStoreProType)

    const onChange: typeof onChangeHandler = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        const doValue = scopes.indexOf('value') !== -1

        setStore((prevStore: UIStoreProType) => {
            let newStore = prevStore.set(
                'current',
                storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore.current)
            )

            if (!doValue) {
                // when no value was changed, the last history entry is updated, without adding another entry to the history
                // as e.g. `internals` must be preserved on undo/redo
                // but only as long as no new `doValue` was executed
                if (!newStore.getIn(doingValueSelector)) {
                    return newStore.setIn(['list', newStore.activeIndex], newStore.current)
                }
                return newStore
            }
            newStore = newStore.setIn(doingValueSelector, true)

            historyChangeRater.current.current = historyChangeRater.current.current > 1000 ?
                0 : historyChangeRater.current.current + 1
            historyChangeRater.current.last = newStore.current.setIn(doingValueSelector, false)
            let historyAdded = false
            if (historyChangeRater.current.current % updateRate === 0) {
                historyAdded = true
                historyDebounce.current.push(newStore.current.setIn(doingValueSelector, false))
            }
            window.clearTimeout(timer.current)
            timer.current = window.setTimeout(() => {
                if (!historyAdded && updateRate !== 1 && historyChangeRater.current.last) {
                    historyDebounce.current.push(historyChangeRater.current.last)
                }
                if (historyDebounce.current.length === 0) return

                setStore((prevStore: UIStoreProType) => {
                    const activeIndex = prevStore.activeIndex
                    let list = prevStore.list
                    if (activeIndex < (list.size - 1)) {
                        // if currently back in history, and the store is changed
                        // use current as new root and delete everything afterwards
                        list = list.splice(activeIndex + 1, list.size - activeIndex)
                    }
                    list = list.push(...historyDebounce.current)
                    historyDebounce.current = []
                    historyChangeRater.current = initialChangeRater
                    return prevStore
                        .set('list', list)
                        .set('activeIndex', list.size - 1)
                        .setIn(doingValueSelector, false)
                })
            }, debounceTime)
            return newStore
        })

        return () => window.clearTimeout(timer.current)
    }, [setStore, timer, historyDebounce, historyChangeRater, debounceTime, updateRate])

    const redoHistory: redoHistory = React.useCallback((steps = 1) => {
        setStore((prevStore: UIStoreProType) => {
            const nextIndex = prevStore.activeIndex + steps
            return toHistory(prevStore, nextIndex)
        })
    }, [setStore])

    const undoHistory: undoHistory = React.useCallback((steps = 1) => {
        setStore((prevStore: UIStoreProType) => {
            const nextIndex = prevStore.activeIndex - steps
            return toHistory(prevStore, nextIndex)
        })
    }, [setStore])

    const reset: (type: string, initialStore?: UIStoreType) => void = React.useCallback((type, initialStore) => {
        window.clearTimeout(timer.current)
        historyDebounce.current = []
        historyChangeRater.current = initialChangeRater
        setStore(makeStorePro(type, initialStore))
    }, [timer, historyDebounce, historyChangeRater, setStore])

    return {
        reset,
        onChange,
        redoHistory,
        undoHistory,
        store: store as UIStoreProType,
        setStore: setStore as setStorePro,
    }
}
