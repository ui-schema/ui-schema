import React from 'react';
import {ThemeProvider as MuiThemeProvider} from "@material-ui/core/styles";

const store_item = 'theme';

const ThemeContext = React.createContext({});

const useThemer = () => React.useContext(ThemeContext);

let chosen_theme = window.localStorage.getItem(store_item);

const ThemeProvider = ({themes, initial, children} = {}) => {
    const [theme, setTheme] = React.useState(chosen_theme || initial || false);

    const switchTheme = React.useCallback(() => {
        let themeSort = Object.keys(themes);
        themeSort.forEach((theme_id, index) => {
            if(theme_id === theme) {
                if(index < (themeSort.length - 1)) {
                    window.localStorage.setItem(store_item, themeSort[index + 1]);
                    setTheme(themeSort[index + 1])
                } else {
                    window.localStorage.setItem(store_item, themeSort[0]);
                    setTheme(themeSort[0])
                }
            }
        });
    }, [theme, setTheme, themes]);

    return <ThemeContext.Provider value={switchTheme}>
        <MuiThemeProvider theme={themes && themes[theme] ? themes[theme] : {}}>
            {children}
        </MuiThemeProvider>
    </ThemeContext.Provider>
};

export {
    ThemeProvider,
    useThemer,
};
