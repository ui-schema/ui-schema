import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const universal = {
    typography: {
        fontSize: 14,
        h1: {
            fontSize: '2.7rem'
        },
        h2: {
            fontSize: '2.3rem'
        },
        h3: {
            fontSize: '2.1rem'
        },
        h4: {
            fontSize: '1.75rem'
        },
        h5: {
            fontSize: '1.75rem'
        },
        h6: {
            fontSize: '1.25rem'
        },
        body1: {
            letterSpacing: '0.0185em'
        },
        body2: {
            letterSpacing: '0.01em'
        }
    },
    shape: {
        borderRadius: 0,
    }
};

const themeDark = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#05aeca",
            dark: '#033944',
        },
        secondary: {
            light: '#d8eed4',
            main: '#bbe1b4',
            dark: "#002634",
        },
        background: {
            paper: '#04252f',
            default: '#001820',
        },
        text: {
            primary: '#c6c4c4',
            secondary: '#acc9c5',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
    ...universal,
});

const themeLight = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            main: "#0590a7",
            dark: '#033944',
        },
        secondary: {
            light: '#d8eed4',
            main: '#37936c',
            dark: "#002634",
        },
        background: {
            paper: '#e8e8e8',
            default: '#cecece',
        },
        text: {
            primary: '#001f29',
            secondary: '#001820',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
    ...universal,
});

export const themes = {
    dark: themeDark,
    light: themeLight,
};
