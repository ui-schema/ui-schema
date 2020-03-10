import React from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import {InvertColors as InvertColorsIcon, Menu as MenuIcon} from '@material-ui/icons';
//import {I18nSwitch} from "../../lib/I18nSwitch";
import {AppDrawer, useDrawer} from "./Drawer";
import {useThemer} from "../../lib/Theme";
import Typography from "@material-ui/core/Typography";
import GithubLogo from "../GithubLogo";
import {Link as RouterLink} from "react-router-dom";
import {Box, Link} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {AccessTooltipIcon} from "../Tooltip";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {LoadingCircular} from "../LoadingCircular";
import Loadable from "react-loadable";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import LuxonAdapter from "@date-io/luxon";
import {Logo} from "../../logo";

const containerStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2, padding: 0,
        flexShrink: 0,
        [theme.breakpoints.up('md')]: {
            padding: 24,
        }
    }
}));

const RenderLink = React.forwardRef(({to, children, ...itemProps}, ref) =>
    -1 === to.indexOf('https://') ? <RouterLink {...itemProps} to={to} innerRef={ref} children={children}/> : <Link {...itemProps} href={to} innerRef={ref} children={children}/>
);

const LinkIconButton = ({children, to, color, style}) => {
    return <IconButton component={RenderLink} to={to} color={color} style={style}>
        {children}
    </IconButton>
};

const Header = ({title}) => {
    const classes = {};
    const switchTheme = useThemer();
    const [, setDrawerOpen] = useDrawer();

    return <AppBar position="static" style={{flexShrink: 0,}}>
        <Toolbar variant={'dense'}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setDrawerOpen(o => !o)}
                className={clsx(classes.menuButton)}
            >
                <AccessTooltipIcon title={'Toggle Menu'}>
                    <MenuIcon className={classes.badgeIcon}/>
                </AccessTooltipIcon>
            </IconButton>

            <RouterLink to={'/'}>
                <Logo width={26} style={{marginLeft: 6, display: 'block'}}/>
            </RouterLink>

            {title ? <Typography component="h1" variant="h6" style={{flexShrink: 0, margin: '0 auto'}}>
                {title}
            </Typography> : null}

            {/*<I18nSwitch style={{marginLeft: title ? 0 : 'auto'}}/>*/}

            <LinkIconButton to={'https://github.com/ui-schema/ui-schema'} color="inherit" style={{color: 'inherit', marginLeft: title ? 0 : 'auto'}}>
                {/*
                    somehow after build the link classes are mixed up
                    color inherit must be set multiple times
                    otherwise it will be (correct) header-inherit in dev but theme-default in prod
                */}
                <GithubLogo className={classes.badgeIcon} fill='currentColor'/>
                <span className={'sr-only'}>To Github</span>
            </LinkIconButton>

            <IconButton color="inherit" onClick={switchTheme}>
                <AccessTooltipIcon title={'Switch Theme'}>
                    <InvertColorsIcon className={classes.badgeIcon}/>
                </AccessTooltipIcon>
            </IconButton>
        </Toolbar>
    </AppBar>;
};

const Layout = ({Component, children, title}) => {
    const ref = React.useRef();
    const history = useHistory();

    const loc = history.location.pathname;
    React.useEffect(() => {
        // todo: if the page from where the user comes, is bigger then the page he changes to, and he is below the scroll point of the target page, it will not scroll up, strange bug,
        //    testable with loading Select widget docs, changing to Translation and scrolling down, menu click to Select widget again, is not at top of page
        //     but this code is executed, scrollTop is changed
        if(ref.current && ref.current.scrollTo) {
            ref.current.scrollTo(0, 0)
        }
    }, [loc, ref]);

    return <React.Fragment>
        <CssBaseline/>
        <Header title={title}/>
        <div style={{display: 'flex', overflow: 'auto', flexGrow: 1}}>
            <AppDrawer/>
            <div ref={ref} id={'main-content'} style={{display: 'flex', scrollBehavior: 'smooth', flexDirection: 'column', overflow: 'auto', flexGrow: 1}}>
                <MuiPickersUtilsProvider utils={LuxonAdapter}>
                    {Component ? <Component scrollContainer={ref}/> : children}
                </MuiPickersUtilsProvider>
            </div>
        </div>
    </React.Fragment>
};

const LoadingPageContent = ({title}) => <Layout>
    <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2,}}>
        <Paper style={{margin: 12, padding: '24px 12px', display: 'flex', flexDirection: 'column'}}>
            <LoadingCircular title={title}/>
        </Paper>
    </Container>
</Layout>;

const LoadingPageModule = ({title}) => <Box style={{margin: 0, padding: 24, display: 'flex', flexDirection: 'column'}}>
    <LoadingCircular title={title}/>
</Box>;

const PageLoader = (loader, title) => Loadable({
    loader,
    loading: () => <LoadingPageContent title={title}/>,
});

export {Layout, containerStyle, LoadingPageContent, PageLoader, LoadingPageModule}
