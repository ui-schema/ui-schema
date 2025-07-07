import React from 'react'

export const useToggle = () => {
    const [toggles, setToggle] = React.useState<{ [k: string]: boolean }>({})

    const toggleDummy = React.useCallback((id: string) => {
        setToggle((toggles) => ({
            ...toggles,
            [id]: !toggles[id],
        }))
    }, [])
    const isSet = (id: string) => {
        return Boolean(toggles[id])
    }

    return [toggleDummy, isSet] as [typeof toggleDummy, typeof isSet]
}
