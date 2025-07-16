import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import React from 'react'
import { Link } from '@control-ui/kit/Link'
import GithubIcon from '../asset/GithubLogo'

export default function Nav() {
    return <React.Fragment>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Live Icon'}>🕹️</span> <Link to={'/examples'} primary={'Live-Editor + Examples'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Quick Start Icon'}>⚡</span> <Link to={'/quick-start'} primary={'Quick-Start'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Widget Icon'}>💎</span> <Link to={'/docs/overview#widget-list'} primary={'Widget List'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Github Icon'}><GithubIcon/></span> <MuiLink href={'https://github.com/ui-schema/ui-schema/releases'} style={{display: 'inline-block'}}>Changelog / Release Notes at Github</MuiLink>
        </Typography>
    </React.Fragment>
}
