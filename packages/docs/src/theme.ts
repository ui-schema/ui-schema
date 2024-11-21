import { createTheme, Theme } from '@mui/material/styles'

const headingFont = 'Roboto Slab, Baskerville, Baskerville Old Face, Garamond, Times New Roman, serif'
const headingBody = 'IBM Plex Sans, Source Code Pro, Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif'

export type PartialTheme = { [K in keyof Theme]: Partial<Theme[K]> }

const universal: Pick<PartialTheme, 'palette' | 'typography' | 'shape' | 'breakpoints' | 'components'> = {
    palette: {
        contrastThreshold: 4,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 840,
            md: 900,
            lg: 1460,
            xl: 1860,
        },
    },
    typography: {
        // fontSize: 14,
        fontFamily: headingBody,
        h1: {
            fontFamily: headingFont,
            fontSize: '2.35rem',
        },
        h2: {
            fontFamily: headingFont,
            fontSize: '1.95rem',
        },
        h3: {
            fontFamily: headingFont,
            fontSize: '1.65rem',
        },
        h4: {
            fontFamily: headingFont,
            fontSize: '1.4125rem',
        },
        h5: {
            fontFamily: headingFont,
            fontSize: '1.1475rem',
        },
        h6: {
            fontFamily: headingFont,
            fontSize: '1.025rem',
        },
        body1: {
            fontFamily: headingBody,
            fontSize: '0.93125rem',
            letterSpacing: '0.0067235em',
        },
        body2: {
            fontFamily: headingBody,
            fontSize: '0.875rem',
            letterSpacing: '0.004215em',
        },
        subtitle1: {
            fontFamily: headingFont,
            fontSize: '1.125rem',
        },
        subtitle2: {
            fontFamily: headingFont,
            fontSize: '1rem',
        },
        caption: {
            fontSize: '0.762rem',
        },
    },
    shape: {},
    // components: {
    //     MuiOutlinedInput: {
    //         styleOverrides: {
    //             root: {borderRadius: 4},
    //         },
    //     },
    // },
    /*components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontSize: '0.875rem',
                    lineHeight: 1.43,
                    letterSpacing: '0.01071em',
                },
            },
        },
    },*/
}

const themeDark = createTheme({
    ...universal,
    palette: {
        ...universal.palette,
        mode: 'dark',
        primary: {
            main: '#05aeca',
            dark: '#033944',
        },
        secondary: {
            // light: '#d8eed4',
            main: '#bd90e0',
            // dark: '#002634',
        },
        background: {
            // paper: '#111017',
            paper: '#121015',
            // default: '#070b13',
            default: '#06050d',
        },
        text: {
            // primary: '#abb8b9',
            primary: '#b0bebf',
            secondary: '#9b88ad',
        },
        action: {
            //hoverOpacity: 0.2,
        },
    },
    components: {
        ...universal.components,
        MuiPaper: {
            styleOverrides: {root: {backgroundImage: 'unset'}},
        },
        // MuiLink: {
        //     styleOverrides: {underlineAlways: {textDecoration: 'none'}},
        // },
    },
})

const themeLight = createTheme({
    ...universal,
    palette: {
        ...universal.palette,
        mode: 'light',
        primary: {
            main: '#0590a7',
            dark: '#033944',
        },
        secondary: {
            // light: '#d8eed4',
            main: '#bd90e0',
            // dark: '#002634',
        },
        background: {
            paper: '#fcfcfc',
            default: '#e7e7e8',
        },
        text: {
            primary: '#2f2f3d',
            secondary: '#6d388a',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
    components: {
        ...universal.components,
        // MuiLink: {
        //     styleOverrides: {underlineAlways: {textDecoration: 'none'}},
        // },
    },
})

export const themes = {
    dark: themeDark,
    light: themeLight,
}
