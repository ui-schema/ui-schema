import React from 'react'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import Typography from '@mui/material/Typography'
import makeStyles from "@mui/styles/makeStyles"
import { ElementMapping } from '@ui-schema/material-slate/SlateElements/ElementMapper'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles<Theme>(theme => ({
    quote: {
        padding: theme.spacing(1) + ' ' + theme.spacing(2) + ' ' + theme.spacing(0.5) + ' ' + theme.spacing(2),
        position: 'relative',
        borderLeft: '0 solid ' + theme.palette.divider,
        '&:before': {
            content: '"“"',
            fontSize: '4em',
            position: 'relative',
            left: -theme.spacing(1),
            //paddingRight: theme.spacing(1),
            lineHeight: 0,
            verticalAlign: 'bottom',
            pointerEvents: 'none',
        },
    },
}))

export const mappingBasic: ElementMapping = {
    // eslint-disable-next-line react/display-name
    [pluginOptions.h1.type]: ({attributes, children}) => <Typography
        variant={'h1'} component={'h1'}
        {...attributes}
        style={{fontSize: '2.7rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.h2.type]: ({attributes, children}) => <Typography
        variant={'h2'} component={'h2'}
        {...attributes}
        style={{fontSize: '2.3rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.h3.type]: ({attributes, children}) => <Typography
        variant={'h3'} component={'h3'}
        {...attributes}
        style={{fontSize: '2.1rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.h4.type]: ({attributes, children}) => <Typography
        variant={'h4'} component={'h4'}
        {...attributes}
        style={{fontSize: '1.75rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.h5.type]: ({attributes, children}) => <Typography
        variant={'h5'} component={'h5'}
        {...attributes}
        style={{fontSize: '1.5rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.h6.type]: ({attributes, children}) => <Typography
        variant={'h6'} component={'h6'}
        {...attributes}
        style={{fontSize: '1.25rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.p.type]: ({attributes, children}) => <Typography
        variant={'body1'} component={'p'}
        {...attributes}
        style={{lineHeight: 'normal'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    [pluginOptions.blockquote.type]: ({attributes, children}) => {
        const classes = useStyles()
        return <Typography
            variant={'body1'} component={'blockquote'}
            {...attributes}
            className={classes.quote}
            gutterBottom
        >{children}</Typography>
    },
    // eslint-disable-next-line react/display-name
    [pluginOptions.code_block.type]: ({attributes, children}) => <pre {...attributes}><code>{children}</code></pre>,
}
