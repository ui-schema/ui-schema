import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CuiMarkdown, { ExtraProps } from 'react-markdown'
import { renderers as baseRenderers } from '@control-ui/md/MarkdownRenderers'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { MdInlineCode } from '@control-ui/md/MdInlineCode'
import { MdLink } from '@control-ui/md/MdLink'
import { LinkableHeadline } from '@control-ui/docs/LinkableHeadline'
import { useTheme } from '@mui/material/styles'
import Code from './MarkdownCode'

//const Code = () => <LoadingCircular title={'Loading Web-IDE'}/>
//const Code = () => <CircularProgress component={'span'}/>

const LinkInternalLocale = (p) => {
    return <MdLink {...p} currentDomain={window.location.protocol + '//' + window.location.host}/>
}
const MdList: React.ComponentType<React.PropsWithChildren & ExtraProps & {
    dense?: boolean
}> = (
    {
        node, dense,
        children,
        ...p
    },
) => {
    const {spacing} = useTheme()
    const Comp = node?.tagName as 'ol' | 'ul' || 'ul'
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
// @ts-ignore
renderers.ul = p => <MdList {...p} dense/>
// @ts-ignore
renderers.ol = p => <MdList {...p} dense/>
// @ts-ignore
renderers.code = ({children, ...p}) => <MdInlineCode variant={'body1'} {...p} p={0.75}>{children}</MdInlineCode>
renderers.pre = ({node, ...p}) => {
    const codeChild = node?.children?.[0]
    if (!codeChild || codeChild.type !== 'element' || codeChild.tagName !== 'code') return <pre {...p}/>

    // @ts-ignore
    return <Code {...codeChild.properties} variant={'body2'}>{codeChild.children[0]?.value as string as any}</Code>
}
const MarkdownH = ({node, children, ...p}) => {
    const variant = node?.tagName
    const level = Number(variant.slice(1))
    return <Typography
        {...p}
        component={`h${level + 1}` as 'h2'}
        variant={`subtitle${level <= 2 ? level as 1 | 2 : 2}`}
        style={{textDecoration: 'underline', marginTop: 48 / level}}
        gutterBottom
    >{children}</Typography>
}
// @ts-ignore
renderers.h1 = renderers.h2 = renderers.h3 = renderers.h4 = renderers.h5 = renderers.h6 = MarkdownH
renderers.a = LinkInternalLocale
renderers.pre = ({children}) => <pre style={{margin: 0}}>{children}</pre>

const renderersContent = baseRenderers(false)
// @ts-ignore
renderersContent.code = ({children, ...p}) => <MdInlineCode variant={'body1'} {...p} p={0.75}>{children}</MdInlineCode>
renderersContent.pre = ({node, ...p}) => {
    const codeChild = node?.children?.[0]
    if (!codeChild || codeChild.type !== 'element' || codeChild.tagName !== 'code') return <pre {...p}/>

    // @ts-ignore
    return <Code {...codeChild.properties} variant={'body2'}>{codeChild.children[0]?.value as string}</Code>
}
// @ts-ignore
renderersContent.h1 = renderersContent.h3 = renderersContent.h4 = renderersContent.h5 = renderersContent.h6 = p => <LinkableHeadline level={Number(p.node?.tagName.slice(1))} levelOffset={0}>{p.children}</LinkableHeadline>
renderersContent.a = LinkInternalLocale

renderersContent.h2 = ({children, ...p}) => {
    return p.id === 'footnote-label' ?
        <Typography variant={'h2'} {...p}>Footnotes</Typography> :
        // @ts-ignore
        <LinkableHeadline level={Number(p.node?.tagName.slice(1))} levelOffset={0}>{children}</LinkableHeadline>
}

// @ts-ignore
renderersContent.section = p => {
    return p.className === 'footnotes' ?
        <Box mt={2}>
            {/* @ts-ignore */}
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
