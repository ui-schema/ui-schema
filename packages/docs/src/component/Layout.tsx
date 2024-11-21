import React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InvertColorsIcon from '@mui/icons-material/InvertColors'
import { RouteComponentProps } from 'react-router'
import GithubLogo from '../asset/GithubLogo'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import IcSearch from '@mui/icons-material/Search'
import Typography from '@mui/material/Typography'
import { LinkIconButton } from '@control-ui/kit/Link'
import { Header } from '@control-ui/app/Header'
import { useSwitchTheme } from '@control-ui/app/AppTheme'
import { Logo } from '../asset/Logo'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useConsent } from '@bemit/consent-ui-react'
import { ConsentUiBoxDialog, dialogPositions } from '@bemit/consent-ui-mui'
import { Layout, LayoutProps } from '@control-ui/app/Layout'
import { RouteCascade } from '@control-ui/routes/RouteCascade'
import { useSearch } from '@control-ui/docs/DocsSearchProvider'
import { getUserCtrlKey, getUserPlatform } from '@control-ui/kit/Helper'
import PageNotFound from '../page/PageNotFound'
import { SearchBox } from './SearchBox'
import { LayoutDrawer } from './LayoutDrawer'

const title = '0.5.x-alpha'
export const CustomHeaderBase: React.ComponentType = () => {
    const {switchTheme} = useSwitchTheme()
    const {setOpen} = useSearch()
    const {breakpoints} = useTheme()
    const isSm = useMediaQuery(breakpoints.up('sm'))
    const platform = getUserPlatform()
    return <Header>
        <RouterLink to={'/'} style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', marginRight: 8}}>
            <Logo width={26} style={{marginLeft: 6, display: 'block', flexShrink: 0}}/>
            {title ? <Typography component="p" variant="h6" style={{flexShrink: 0, margin: '0 auto 0 8px'}}>
                {title}
            </Typography> : null}
        </RouterLink>

        <Tooltip title={'search'}>
            <Button
                variant={'outlined'} color={'inherit'}
                onClick={() => setOpen(o => !o)}
                startIcon={<IcSearch/>}
                size={'small'}
                style={{
                    marginLeft: 'auto',
                    marginRight: 8,
                    borderRadius: 8,
                    flexShrink: 1,
                    flexGrow: isSm ? 0 : 1,
                    minWidth: 20,
                    maxWidth: isSm ? undefined : 85,
                }}
            >
                {isSm ?
                    <span style={{
                        textAlign: 'right', fontWeight: 'bold',
                        lineHeight: '0.965em', fontSize: '0.875rem',
                        opacity: 0.8,
                        marginLeft: 'auto',
                        paddingLeft: 6,
                        minWidth: 76,
                    }}>
                        {getUserCtrlKey(platform)}{' + K'}
                    </span> :
                    <span style={{marginLeft: 'auto'}}/>}
            </Button>
        </Tooltip>

        <LinkIconButton size={'medium'} to={'https://github.com/ui-schema/ui-schema'} color="inherit" style={{color: 'inherit'}}>
            <GithubLogo fill="currentColor"/>
            <span className={'sr-only'}>To Github</span>
        </LinkIconButton>

        <IconButton color="inherit" onClick={() => switchTheme()}>
            <Tooltip title={'Switch Theme'}>
                <InvertColorsIcon/>
            </Tooltip>
        </IconButton>
    </Header>
}
const CustomHeader = React.memo(CustomHeaderBase)

const RoutingBase: LayoutProps['Content'] = (p) =>
    <RouteCascade
        routeId={'content'}
        childProps={p}
        Fallback={PageNotFound as React.ComponentType<RouteComponentProps & { scrollContainer?: any }>}
    />
export const Routing: LayoutProps['Content'] = React.memo(RoutingBase)

export const CustomLayout = () => {
    const location = useLocation()
    const {ready, hasChosen, showUi} = useConsent()
    const [showDetails, setShowDetails] = React.useState(Boolean(hasChosen))
    return <>
        <Layout
            Header={CustomHeader}
            Drawer={LayoutDrawer}
            Content={Routing}
            mainContentStyle={{position: 'relative'}}
            locationPath={location.pathname}
        />
        <SearchBox/>

        <ConsentUiBoxDialog
            layout={'dense'}
            open={Boolean(ready && (!hasChosen || showUi))}
            showDetails={Boolean(showDetails || (showUi && hasChosen))}
            setShowDetails={showDetails || (ready && hasChosen && showUi) ? undefined : setShowDetails}
            showSelectEssential
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
                // todo: add labels
                serviceStoresFeature: '',
                serviceStoresName: '',
                serviceStoresExpires: '',
                serviceStoresDomain: '',
                serviceStoresIn: '',
                serviceStoresDescription: '',
            }}
        />
    </>
}
