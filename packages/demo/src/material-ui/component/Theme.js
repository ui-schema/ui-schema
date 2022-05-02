import React from 'react';
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';

const store_item = 'theme';

const ThemerContext = React.createContext(undefined);

/**
 * @return {() => void}
 */
const useThemer = () => React.useContext(ThemerContext);
const withThemer = Component => props => {
    const theme = useThemer();
    return <Component {...props} theme={theme}/>
};

let chosen_theme = window.localStorage.getItem(store_item);

const ThemerProvider = ({themes, initial, children} = {}) => {
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

    return <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes && themes[theme] ? themes[theme] : {}}>
            <ThemerContext.Provider value={switchTheme}>
                {children}
            </ThemerContext.Provider>
        </ThemeProvider>
    </StyledEngineProvider>
};

export {
    ThemerProvider,
    useThemer, withThemer,
};
