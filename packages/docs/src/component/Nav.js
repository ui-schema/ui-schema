import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import React from 'react';
import {Link} from '@control-ui/kit/Link';

export default () => {
    return <React.Fragment>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Live Icon'}>🔴</span> <Link to={'/examples'} primary={'Live-Editor + Examples'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Quick Start Icon'}>⚡</span> <Link to={'/quick-start'} primary={'Quick-Start'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Kraken Icon'}>💎</span> <Link to={'/docs/overview#widget-list'} primary={'Widget List'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Professional service Icon'}>🔥</span> Professional service available, <MuiLink href={'https://bemit.codes/get-quote'}>reach out now!</MuiLink>
        </Typography>
    </React.Fragment>
};
