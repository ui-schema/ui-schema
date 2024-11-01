import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Loadable from 'react-loadable'
import CuiMarkdown from 'react-markdown'
import { renderers as baseRenderers } from '@control-ui/md/MarkdownRenderers'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { MdInlineCode } from '@control-ui/md/MdInlineCode'
import { MdLink } from '@control-ui/md/MdLink'
import { LinkableHeadline } from '@control-ui/docs/LinkableHeadline'
import { LoadingCircular } from '@control-ui/kit/Loading'
import { OrderedListProps, UnorderedListProps } from 'react-markdown/lib/ast-to-react'
import { useTheme } from '@mui/material/styles'

const Code = Loadable({
    loader: () => import('./MarkdownCode'),
    loading: () => <LoadingCircular title={'Loading Web-IDE'}/>,
})

//const Code = () => <LoadingCircular title={'Loading Web-IDE'}/>
//const Code = () => <CircularProgress component={'span'}/>

const LinkInternalLocale = (p) => {
    return <MdLink {...p} currentDomain={window.location.protocol + '//' + window.location.host}/>
}
const MdList: React.ComponentType<(UnorderedListProps | OrderedListProps) & {
    dense?: boolean
}> = (
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node, dense,
        ordered,
        children,
        ...p
    },
) => {
    const {spacing} = useTheme()
    const Comp = ordered ? 'ol' : 'ul'
    return <Comp
        {...p}
        style={{
            margin: spacing(dense ? 1 : 2) + ' 0 ' + spacing(dense ? 1 : 2) + ' ' + spacing(dense ? 1 : 2),
            paddingLeft: spacing(2),
        }}
    >{children}</Comp>
}

// see: https://github.com/rexxars/react-markdown#node-types
const renderers = baseRenderers(true)
renderers.ul = p => <MdList {...p} dense/>
renderers.ol = p => <MdList {...p} dense/>
// @ts-ignore
renderers.code = ({inline, ...p}) => inline ? <MdInlineCode variant={'body1'} {...p} p={0.75}/> : <Code variant={'body2'} {...p}/>
// @ts-ignore
const MarkdownH = ({level, ...p}) => <Typography {...p} component={'h' + (level + 1)} variant={'subtitle' + (level)} style={{textDecoration: 'underline', marginTop: 48 / level}} gutterBottom/>
renderers.h1 = renderers.h2 = renderers.h3 = renderers.h4 = renderers.h5 = renderers.h6 = MarkdownH
renderers.a = LinkInternalLocale
renderers.pre = ({children}) => <pre style={{margin: 0}}>{children}</pre>

const renderersContent = baseRenderers(false)
// @ts-ignore
renderersContent.code = ({inline, ...p}) => inline ? <MdInlineCode variant={'body1'} {...p} p={0.75}/> : <Code variant={'body1'} {...p}/>
// @ts-ignore
renderersContent.h1 = renderersContent.h3 = renderersContent.h4 = renderersContent.h5 = renderersContent.h6 = LinkableHeadline
renderersContent.a = LinkInternalLocale

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
// @ts-ignore
renderersContent.ul = MdList
// @ts-ignore
renderersContent.ol = MdList

const rehypePlugins = [rehypeRaw]
const remarkPlugins = [remarkGfm]

export const MarkdownBase = ({source}) => {
    return source ?
        <CuiMarkdown
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            components={renderersContent}
        >{source}</CuiMarkdown> : null
}
export const Markdown = React.memo(MarkdownBase)
