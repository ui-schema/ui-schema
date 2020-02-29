import React from "react";
import {withRouter} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Button, makeStyles, Paper} from '@material-ui/core';
import {Translate} from '@material-ui/icons'

/**
 * Change the current language, get the current url and url scheme, search for key `:lng` in pathscheme and use that index to manipulate history
 * @param lng
 * @param {i18n} i18n
 * @param history
 * @param match
 */
const changeLanguage = (lng, i18n, history, match) => {
    // todo: add dyn. path pos
    let cur_path = history.location.pathname.substr(1).split('/');
    let path_pos = 0;

    cur_path[path_pos] = lng;
    i18n.changeLanguage(lng).then(() => {
        history.push('/' + cur_path.join('/'));
    });
};

const useStyles = makeStyles(theme => ({
    i18nSwitchList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none'
    },
    i18nSwitchListItem: {
        '& button': {
            display: 'block',
            position: 'relative',
            paddingLeft: 36,
            minHeight: '32px',
            textAlign: 'left',
            width: '100%',
        },
        '& button:before': {
            content: '""',
            width: '5px',
            height: '5px',
            background: 'transparent',
            border: '1px solid ' + theme.palette.text.primary,
            position: 'absolute',
            left: 15,
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            transition: theme.palette.transitionTheming,
        },
        '& button:hover:before': {
            border: '1px solid ' + theme.palette.btnActionText,
        }
    },
    wrapperDrop: {
        position: 'absolute',
    },
}));

const WrapperDropDown = () => null

const I18nSwitch = withRouter(({style = {}, history, match}) => {
    const {i18n} = useTranslation('common');
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return <div style={{position: 'relative', ...style}}>
        <Button onClick={() => setOpen(!open)} style={{color: 'inherit', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}><Translate/></Button>
        <WrapperDropDown
            withParent={false}
            pose={open ? 'visible' : 'hidden'}
            style={open ? {
                padding: '0 3px 3px 3px',
                left: -3
            } : {}}
            className={classes.wrapperDrop}>
            <Paper square elevation={4}>
                <ul className={classes.i18nSwitchList}>
                    {i18n.options.allLanguages.map(lng => (
                        <li key={lng} className={classes.i18nSwitchListItem}><Button
                            variant={i18n.language === lng ? 'outlined' : 'text'}
                            onClick={() => {
                                changeLanguage(lng, i18n, history, match);
                                setOpen(false);
                            }}>{lng}</Button></li>
                    ))}
                </ul>
            </Paper>
        </WrapperDropDown>
    </div>
});

export {I18nSwitch}
