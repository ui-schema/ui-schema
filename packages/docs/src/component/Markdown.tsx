import React from 'react'
import { Box, Typography } from '@mui/material'
import Loadable from 'react-loadable'
import CuiMarkdown from 'react-markdown'
import { renderers as baseRenderers } from '@control-ui/md/MarkdownRenderers'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { MdInlineCode } from '@control-ui/md/MdInlineCode'
import { MdLink } from '@control-ui/md/MdLink'
import { LinkableHeadline } from '@control-ui/docs/LinkableHeadline'
import { LoadingCircular } from '@control-ui/kit/Loading/LoadingCircular'

const Code = Loadable({
    loader: () => import('./MarkdownCode'),
    loading: () => <LoadingCircular title={'Loading Web-IDE'}/>,
})

//const Code = () => <LoadingCircular title={'Loading Web-IDE'}/>
//const Code = () => <CircularProgress component={'span'}/>

const LinkInternalLocale = (p) => {
    return <MdLink {...p} currentDomain={window.location.protocol + '//' + window.location.host}/>
}

// see: https://github.com/rexxars/react-markdown#node-types
const renderers = baseRenderers(true)
renderers.p = (p) => {
    return <Typography {...p} component={'p'} variant={'body2'} gutterBottom/>
}
// @ts-ignore
renderers.code = ({inline, ...p}) => inline ? <MdInlineCode variant={'body1'} {...p}/> : <Code variant={'body2'} {...p}/>
// @ts-ignore
const MarkdownH = ({level, ...p}) => <Typography {...p} component={'h' + (level + 1)} variant={'subtitle' + (level)} style={{textDecoration: 'underline', marginTop: 48 / level}} gutterBottom/>
renderers.h1 = renderers.h2 = renderers.h3 = renderers.h4 = renderers.h5 = renderers.h6 = MarkdownH
renderers.li = p => <Typography component={'li'} variant={'body2'} style={{fontWeight: 'bold'}}>
    <span style={{fontWeight: 'normal', display: 'block', marginBottom: 2}}>{p.children}</span>
</Typography>
renderers.a = LinkInternalLocale
renderers.pre = ({children}) => <pre style={{margin: 0}}>{children}</pre>

const renderersContent = baseRenderers(false)
// @ts-ignore
renderersContent.code = ({inline, ...p}) => inline ? <MdInlineCode variant={'body1'} {...p}/> : <Code variant={'body1'} {...p}/>
renderersContent.p = (p) => {
    return <Typography {...p} component={'p'} variant={'body1'} gutterBottom/>
}
// @ts-ignore
renderersContent.h1 = renderersContent.h3 = renderersContent.h4 = renderersContent.h5 = renderersContent.h6 = LinkableHeadline
renderersContent.a = LinkInternalLocale

// eslint-disable-next-line @typescript-eslint/no-unused-vars
renderersContent.li = ({node, style = {}, ordered, children, ...p}) =>
    <Typography component={'li'} variant={'body1'} style={{fontWeight: 'bold', ...style}}{...p}>
        <span style={{fontWeight: 'normal', display: 'block', marginBottom: 2}}>{children}</span>
    </Typography>

renderersContent.h2 = ({children, ...p}) => {
    return p.id === 'footnote-label' ?
        <Typography variant={'h2'} {...p}>Footnotes</Typography> :
        <LinkableHeadline {...p}>{children}</LinkableHeadline>
}

// @ts-ignore
renderersContent.section = p => {
    return p.className === 'footnotes' ?
        <Box mt={2}>
            {p.children}
        </Box> : p.children
}

const rehypePlugins = [rehypeRaw]
const remarkPlugins = [remarkGfm]

export const Markdown = ({source}) => {
    return source ?
        <CuiMarkdown
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            components={renderersContent}
        >{source}</CuiMarkdown> : null
}
