import React from 'react'
import IconButton from '@mui/material/IconButton'
import { InvertColors as InvertColorsIcon } from '@mui/icons-material'
import GithubLogo from '../asset/GithubLogo'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import useTheme from '@mui/material/styles/useTheme'
import IcSearch from '@mui/icons-material/Search'
import { AccessTooltipIcon } from '@control-ui/kit/Tooltip'
import Typography from '@mui/material/Typography'
import { LinkIconButton } from '@control-ui/kit/Link/LinkIconButton'
import { Header } from '@control-ui/app/Header'
import { useSwitchTheme } from '@control-ui/app/AppTheme'
import { Drawer } from '@control-ui/app/Drawer'
import { useDrawer } from '@control-ui/app/DrawerProvider'
import { ListItemLink } from '@control-ui/kit/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Logo } from '../asset/logo'
import { schemas } from '../schemas/_list'
import ListItemText from '@mui/material/ListItemText'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Divider, List, Collapse } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import { NavListNested } from '@control-ui/kit/NavList'
import { routesCore, routesFurtherAddOns, routesFurtherDesignSystem } from '../content/docs'
import { useConsent } from '@bemit/consent-ui-react'
// import {ConsentUiBoxDialog, dialogPositions} from '@bemit/consent-ui-mui'
import { Layout, LayoutProps } from '@control-ui/app/Layout'
import Loadable from 'react-loadable'
import { LoadingCircular } from '@control-ui/kit/Loading/LoadingCircular'
import { RouteCascade } from '@control-ui/routes/RouteCascade'
import { useSearch } from '@control-ui/docs/DocsSearchProvider'
import { SearchBox } from './SearchBox'

const title = '0.3.0 & 0.4.0-alpha.x'
export const CustomHeader: React.ComponentType = () => {
    const {switchTheme} = useSwitchTheme()
    const {setOpen} = useSearch()
    return <Header>
        <RouterLink to={'/'}>
            <Logo width={26} style={{marginLeft: 6, display: 'block'}}/>
        </RouterLink>

        {title ? <Typography component="p" variant="h6" style={{flexShrink: 0, margin: '0 auto 0 8px'}}>
            {title}
        </Typography> : null}

        <IconButton color="inherit" onClick={() => setOpen(true)} style={{marginLeft: 'auto'}}>
            <AccessTooltipIcon title={'search'}>
                <IcSearch/>
            </AccessTooltipIcon>
        </IconButton>

        <LinkIconButton size={'medium'} to={'https://github.com/ui-schema/ui-schema'} color="inherit" style={{color: 'inherit'}}>
            <GithubLogo fill="currentColor"/>
            <span className={'sr-only'}>To Github</span>
        </LinkIconButton>

        <IconButton color="inherit" onClick={() => switchTheme()}>
            <AccessTooltipIcon title={'Switch Theme'}>
                <InvertColorsIcon/>
            </AccessTooltipIcon>
        </IconButton>
    </Header>
}

const CollapseDrawer: React.ComponentType<React.PropsWithChildren<{
    toggle: string | React.ReactElement
    icon?: React.ReactElement
    dense?: boolean
    initialOpen?: boolean
    style?: React.CSSProperties
}>> = (
    {
        toggle, icon,
        children,
        dense, initialOpen = true, style,
    },
) => {
    const [open, setOpen] = React.useState(initialOpen)
    return <React.Fragment>
        <ListItem button onClick={() => setOpen(o => !o)} dense={dense} style={style}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={toggle}/>
            {open ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
            {children}
        </Collapse>
    </React.Fragment>
}

const PageNotFound: React.ComponentType = Loadable({
    loader: () => import('../page/PageNotFound'),
    // eslint-disable-next-line react/display-name
    loading: () => <LoadingCircular title={'Not Found'}/>,
})

const RoutingBase: LayoutProps['Content'] = (p) =>
// @ts-ignore
    <RouteCascade routeId={'content'} childProps={p} Fallback={PageNotFound}/>
export const Routing: LayoutProps['Content'] = React.memo(RoutingBase)

export const CustomLayout = () => {
    const location = useLocation()
    // @ts-ignore
    // eslint-disable-next-line
    const {ready, hasChosen, showUi} = useConsent()
    // @ts-ignore
    // eslint-disable-next-line
    const [showDetails, setShowDetails] = React.useState(Boolean(hasChosen))
    return <>
        {/* @ts-ignore */}
        <Layout
            Header={CustomHeader}
            Drawer={CustomDrawer}
            Content={Routing}
            mainContentStyle={{position: 'relative'}}
            locationPath={location.pathname}
        >
            <SearchBox/>
        </Layout>

        {/*<ConsentUiBoxDialog
            layout={'dense'}
            //showSelectEssential
            open={Boolean(ready && (!hasChosen || showUi))}
            showDetails={Boolean(showDetails || (showUi && hasChosen))}
            setShowDetails={showDetails || (ready && hasChosen && showUi) ? undefined : setShowDetails}
            showSelectEssential={showDetails}
            fullWidthDetails
            maxWidthDetails={'md'}
            maxWidth={'sm'}
            dialogPosition={dialogPositions.bottom}
            labels={{
                btnOnlyEssential: 'only essential',
                btnAcceptDefault: 'accept all',
                btnAcceptSave: 'save selected',
                detailsHide: 'hide details',
                detailsShow: 'more',
                serviceActive: 'service active',
                servicesActive: 'services active',
                //detailsTitle: 'Details',
                policyLabel: 'Privacy',
                servicePolicyLabel: 'Service Policy',
                serviceStores: 'Stores:',
                serviceReceives: 'Receives:',
            }}
        />*/}
    </>
}

export const CustomDrawer: React.ComponentType = () => {
    const {toggleUi} = useConsent()
    const {setOpen} = useDrawer()
    const {breakpoints} = useTheme()
    const closeOnClick = React.useCallback(() => {
        if (breakpoints.values.md > window.innerWidth) {
            setOpen(false)
        }
    }, [breakpoints, setOpen])
    return <Drawer drawerWidth={260}>
        <List>
            <ListItemLink to={'/'} primary={'Home'} dense disableNavLink={false} exact onClick={closeOnClick}/>
            <ListItemLink to={'/quick-start'} primary={'Quick-Start'} dense disableNavLink={false} onClick={closeOnClick}/>
            <ListItemLink to={'/examples'} primary={'Live Editor'} dense disableNavLink={false} onClick={closeOnClick}/>
            <Divider/>
            <NavListNested
                // @ts-ignore
                routes={routesCore}
                dense
                filter={() => true}
                onClick={closeOnClick}
            />
            <ListItemLink to={'/updates'} primary={'Updates & Migration'} dense disableNavLink={false} onClick={closeOnClick}/>
            <Divider/>
            <NavListNested
                // @ts-ignore
                routes={routesFurtherDesignSystem}
                dense
                filter={() => true}
                onClick={closeOnClick}
            />
            <Divider/>
            <NavListNested
                routes={routesFurtherAddOns}
                dense
                filter={() => true}
                onClick={closeOnClick}
            />

            <CollapseDrawer toggle={'Schema Examples'} dense initialOpen={false}>
                <List component="div" disablePadding style={{overflow: 'auto'}}>
                    {schemas.map((schema, i) => (
                        <ListItemLink
                            // @ts-ignore
                            key={i} to={'/examples/' + (schemas[i][0].split(' ').join('-'))}
                            // @ts-ignore
                            primary={schema[0]} style={{paddingLeft: 24}} dense disableNavLink={false} onClick={closeOnClick}/>
                    ))}
                </List>
            </CollapseDrawer>
            <Divider/>
            <ListItemLink to={'/impress'} primary={'Impress'} dense disableNavLink={false} onClick={closeOnClick}/>
            <ListItemLink to={'/privacy'} primary={'Privacy Policy'} dense disableNavLink={false} onClick={closeOnClick}/>
            <ListItem button onClick={() => toggleUi()} dense>
                <ListItemText primary={'Privacy Settings'} primaryTypographyProps={{variant: 'body2'}}/>
            </ListItem>
            <Divider/>
        </List>
    </Drawer>
}
