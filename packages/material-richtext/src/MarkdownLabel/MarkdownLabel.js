import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import {useEditorStyles} from "../styles";

const MarkdownIcon = React.forwardRef(({color}, ref) => <svg
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" ref={ref}
    fill={color}
    style={{width: '20px', display: 'block', opacity: 0.6}}
>
    <g transform="translate(-71.09-24.1)">
        <path d="m10.509 2.01c-5.82 0-10.509 4.689-10.509 10.509v102.96c0 5.82 4.689 10.509 10.509 10.509h186.98c5.82 0 10.509-4.689 10.509-10.509v-102.96c0-5.82-4.689-10.509-10.509-10.509h-186.98m15.764 26.27h20.992l21.02 26.27 21.02-26.27h20.992v71.43h-20.992v-40.971l-21.02 26.27-21.02-26.27v40.971h-20.992v-71.43m120.8 0h20.992v36.756h21.02l-31.501 34.676-31.528-34.676h21.02v-36.756" stroke="none" transform="matrix(.06731 0 0 .06731 72.08 27.814)"/>
    </g>
</svg>);

const MarkdownLink = React.forwardRef((props, ref) => <Link
    style={{textDecoration: 'underline'}}
    href='https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet'
    target='_blank' rel='noopener noreferrer'
    {...props}
    ref={ref}
/>);

let MarkdownLabel = ({focus, setFocus}) => {
    const classes = useEditorStyles();

    return <div className={classes.markdown}>
        <IconButton
            component={MarkdownLink}
            style={{position: 'relative'}} color={'primary'}
            onMouseEnter={() => setFocus(true)}
            onMouseLeave={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            size={'small'}>

            <MarkdownIcon color={'currentColor'}/>

            {focus ? <Typography
                component={'span'} variant={'caption'}
                className={classes.markdownLabel}
            >MarkDown Enabled</Typography> : null}
        </IconButton>
    </div>
};
MarkdownLabel = React.memo(MarkdownLabel)

export {MarkdownLabel}
