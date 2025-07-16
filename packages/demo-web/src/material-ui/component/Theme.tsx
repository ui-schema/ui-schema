import React, { PropsWithChildren } from 'react'
import { StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles'

const store_item = 'theme'

const ThemerContext = React.createContext<() => void>(() => undefined)

const useThemer = () => React.useContext(ThemerContext)

let chosen_theme = window.localStorage.getItem(store_item)

const ThemerProvider = ({themes, initial, children}: PropsWithChildren<{ initial?: string, themes: { [theme: string]: Theme } }>) => {
    const [theme, setTheme] = React.useState(chosen_theme || initial || 'dark')

    const switchTheme = React.useCallback(() => {
        const themeSort = Object.keys(themes)
        themeSort.forEach((theme_id, index) => {
            if (theme_id === theme) {
                if (index < (themeSort.length - 1)) {
                    chosen_theme = themeSort[index + 1]
                } else {
                    chosen_theme = themeSort[0]
                }
                window.localStorage.setItem(store_item, chosen_theme)
                setTheme(chosen_theme)
            }
        })
    }, [theme, setTheme, themes])

    return <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes && themes[theme] ? themes[theme] : {}}>
            <ThemerContext.Provider value={switchTheme}>
                {children}
            </ThemerContext.Provider>
        </ThemeProvider>
    </StyledEngineProvider>
}

export {
    ThemerProvider,
    useThemer,
}
