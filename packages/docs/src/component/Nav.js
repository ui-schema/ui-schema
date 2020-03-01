import Typography from "@material-ui/core/Typography";
import {Link} from "./Link";
import React from "react";
import {useTranslation} from "../lib/I18n";

export default () => {
    const {i18n} = useTranslation();
    return <React.Fragment>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Home Icon'}>🏠</span> <Link to={'/' + i18n.language} primary={'Home'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Live Icon'}>🔴</span> <Link to={'/' + i18n.language + '/examples'} primary={'Live-Editor + Examples'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Quick Start Icon'}>⚡</span> <Link to={'/' + i18n.language + '/quick-start'} primary={'Quick-Start'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Kraken Icon'}>💎</span> <Link to={'/' + i18n.language + '/docs/overview#widget-list'} primary={'Widget List'} style={{display: 'inline-block'}}/>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'p'} variant={'body1'}>
            <span role={'img'} aria-label={'Documentation Icon'}>📚</span> <Link to={'/' + i18n.language + '/docs'} primary={'Documentation'} style={{display: 'inline-block'}}/>
        </Typography>
    </React.Fragment>
};
