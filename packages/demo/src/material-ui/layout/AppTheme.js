import React from 'react';
import PropTypes from 'prop-types';
import Head from './Head';
import createTheme from '@mui/material/styles/createTheme';
import {ThemerProvider} from '../component/Theme';
import CssBaseline from '@mui/material/CssBaseline';

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
});

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
});

const themes = {
    dark: themeDark,
    light: themeLight,
};

export default function AppTheme(props) {
    const {children} = props;

    return (
        <ThemerProvider themes={themes} initial={
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }>
            <Head>
                <meta name="robots" content="noindex,nofollow"/>
            </Head>
            <CssBaseline/>
            {children}
        </ThemerProvider>
    );
}

AppTheme.propTypes = {
    children: PropTypes.element.isRequired,
};
