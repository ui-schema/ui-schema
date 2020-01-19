import React from 'react';
import {MuiThemeProvider} from "@material-ui/core";

const store_item = 'theme';

const ThemerContext = React.createContext({});

const useThemer = () => React.useContext(ThemerContext);
const withThemer = Component => props => {
    const theme = useThemer();
    return <Component {...props} theme={theme}/>
};

let choosen_theme = window.localStorage.getItem(store_item);

const ThemerProvider = ({themes, initial, children} = {}) => {
    const [theme, setTheme] = React.useState(choosen_theme || initial || false);

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

    return <ThemerContext.Provider value={{switchTheme}}>
        <MuiThemeProvider theme={themes && themes[theme] ? themes[theme] : {}}>
            {children}
        </MuiThemeProvider>
    </ThemerContext.Provider>
};

export {
    ThemerProvider,
    useThemer, withThemer,
};
