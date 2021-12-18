import React from 'react';
import {Typography} from '@material-ui/core';
import Loadable from 'react-loadable';
import {Markdown as CuiMarkdown} from '@control-ui/docs/Markdown/Markdown'
import {renderers as baseRenderers} from '@control-ui/docs/Markdown/MarkdownRenderers'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import {MdInlineCode} from '@control-ui/docs/Markdown/InlineCode';
import {MdLink} from '@control-ui/docs/Markdown/Link';
import {LinkableHeadline} from '@control-ui/docs/LinkableHeadline';
import {LoadingCircular} from '@control-ui/kit/Loading/LoadingCircular';

const Code = Loadable({
    loader: () => import('./MarkdownCode'),
    loading: () => <LoadingCircular title={'Loading Web-IDE'}/>,
});

//const Code = () => <LoadingCircular title={'Loading Web-IDE'}/>
//const Code = () => <CircularProgress component={'span'}/>

const LinkInternalLocale = (p) => {
    return <MdLink {...p} href={0 !== p.href.indexOf('#') && -1 === p.href.indexOf('https://') && -1 === p.href.indexOf('http://') ? p.href.slice(1) : p.href}/>
};

// see: https://github.com/rexxars/react-markdown#node-types
const renderers = baseRenderers(true);
renderers.p = p => <Typography {...p} component={'p'} variant={'body2'} gutterBottom/>;
renderers.code = ({inline, ...p}) => inline ? <MdInlineCode variant={'body1'} {...p}/> : <Code variant={'body2'} {...p}/>;
const MarkdownH = ({level, ...p}) => <Typography {...p} component={'h' + (level + 1)} variant={'subtitle' + (level)} style={{textDecoration: 'underline', marginTop: 48 / level}} gutterBottom/>
renderers.h1 = renderers.h2 = renderers.h3 = renderers.h4 = renderers.h5 = renderers.h6 = MarkdownH
renderers.li = p => <Typography component={'li'} variant={'body2'} style={{fontWeight: 'bold'}}><span style={{fontWeight: 'normal', display: 'block'}}>{p.children}</span></Typography>;
renderers.a = LinkInternalLocale;

const renderersContent = baseRenderers(false);
renderersContent.code = ({inline, ...p}) => inline ? <MdInlineCode variant={'body1'} {...p}/> : <Code variant={'body1'} {...p}/>;
renderersContent.h1 = renderersContent.h2 = renderersContent.h3 = renderersContent.h4 = renderersContent.h5 = renderersContent.h6 = LinkableHeadline;
renderersContent.a = LinkInternalLocale;

const rehypePlugins = [rehypeRaw]
const remarkPlugins = [remarkGfm]

export const Markdown = ({source}) => {
    return source ?
        <CuiMarkdown
            source={source}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            components={renderersContent}
        /> : null
}
