import React from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { Translate } from '@ui-schema/react/Translate'

// eslint-disable-next-line react/display-name
const MarkdownIcon: React.ComponentType<{ color: string }> = React.forwardRef(({color}, ref) => <svg
    viewBox="0 0 16 16"
    fill={color}
    style={{width: '20px', display: 'block', opacity: 0.6}}
    // @ts-ignore
    ref={ref}
>
    <g transform="translate(-71.09-24.1)">
        <path d="m10.509 2.01c-5.82 0-10.509 4.689-10.509 10.509v102.96c0 5.82 4.689 10.509 10.509 10.509h186.98c5.82 0 10.509-4.689 10.509-10.509v-102.96c0-5.82-4.689-10.509-10.509-10.509h-186.98m15.764 26.27h20.992l21.02 26.27 21.02-26.27h20.992v71.43h-20.992v-40.971l-21.02 26.27-21.02-26.27v40.971h-20.992v-71.43m120.8 0h20.992v36.756h21.02l-31.501 34.676-31.528-34.676h21.02v-36.756" stroke="none" transform="matrix(.06731 0 0 .06731 72.08 27.814)"/>
    </g>
</svg>)

// eslint-disable-next-line react/display-name
const MarkdownLink = React.forwardRef((props, ref) => <a
    target="_blank" rel="noopener noreferrer"
    {...props}
    // @ts-ignore
    ref={ref}
/>)

const useMarkdownStyles = makeStyles<Theme, { top: number }>((theme) => ({
    markdown: {
        position: 'absolute',
        top: ({top}) => theme.spacing(top),
        right: '4px',
        zIndex: 1,
    },
    markdownLabel: {
        position: 'absolute',
        right: 0,
        bottom: '-50%',
        whiteSpace: 'pre',
    },
}))

let MarkdownLabel: React.ComponentType<{ href?: string, enableKeyboard?: boolean, parentFocused: boolean, top?: number }> = (
    {href, parentFocused, enableKeyboard, top = 0}
) => {
    const classes = useMarkdownStyles({top})
    const [focus, setFocus] = React.useState(false)
    return <div className={classes.markdown}>
        {/* @ts-ignore */}
        <IconButton
            component={MarkdownLink}
            href={href || 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet'}
            style={{position: 'relative'}}
            tabIndex={enableKeyboard ? undefined : -1}
            color={parentFocused ? 'primary' : 'inherit'}
            onMouseEnter={() => setFocus(true)}
            onMouseLeave={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            size={'small'}
        >
            <MarkdownIcon color={'currentColor'}/>

            {focus ? <Typography
                component={'span'} variant={'caption'}
                className={classes.markdownLabel}
            ><Translate text={'labels.rich-text-enabled-markdown'}/></Typography> : null}
        </IconButton>
    </div>
}
MarkdownLabel = React.memo(MarkdownLabel)

export { MarkdownLabel }
