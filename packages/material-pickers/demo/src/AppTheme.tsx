import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles'

const themeDark = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#08b1d7',
            dark: '#055262',
        },
        secondary: {
            light: '#d8eed4',
            main: '#bbe1b4',
            dark: '#002634',
        },
        background: {
            paper: '#001f29',
            default: '#001820',
        },
        text: {
            primary: '#e8e8e8',
            secondary: '#acc9c5',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
})

const themeLight = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0599b2',
            dark: '#033944',
        },
        secondary: {
            light: '#d8eed4',
            main: '#37936c',
            dark: '#002634',
        },
        background: {
            paper: '#e8e8e8',
            default: '#dae7e5',
        },
        text: {
            primary: '#001f29',
            secondary: '#001820',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
})

const themes = {
    dark: themeDark,
    light: themeLight,
}

const store_item = 'theme'

const ThemerContext = React.createContext<() => void>(() => undefined)

export const useThemer = () => React.useContext(ThemerContext)

const chosen_theme = window.localStorage.getItem(store_item)

export const ThemerProvider = ({themes, initial, children}: React.PropsWithChildren<{ themes: { dark: Theme, light: Theme }, initial: string }>) => {
    const [theme, setTheme] = React.useState(chosen_theme || initial || 'dark')

    const switchTheme = React.useCallback(() => {
        const themeSort = Object.keys(themes)
        themeSort.forEach((theme_id, index) => {
            if (theme_id === theme) {
                if (index < (themeSort.length - 1)) {
                    window.localStorage.setItem(store_item, themeSort[index + 1])
                    setTheme(themeSort[index + 1])
                } else {
                    window.localStorage.setItem(store_item, themeSort[0])
                    setTheme(themeSort[0])
                }
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

export default function AppTheme(props: React.PropsWithChildren) {
    const {children} = props

    return (
        <ThemerProvider
            themes={themes}
            initial={
                window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            }
        >
            <CssBaseline/>
            {children}
        </ThemerProvider>
    )
}
