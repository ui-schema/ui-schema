import React from "react";
import {Typography,} from "@material-ui/core";
import Loadable from "react-loadable";
import {Markdown as MarkdownBase, allowHtml} from '@control-ui/docs/es/Markdown/Markdown'
import {renderers as baseRenderers} from '@control-ui/docs/es/Markdown/MarkdownRenderers'
import {MdInlineCode} from "@control-ui/docs/es/Markdown/InlineCode";
import {MdLink} from "@control-ui/docs/es/Markdown/Link";
import {LinkableHeadline} from "@control-ui/docs/es";
import {LoadingCircular} from "@control-ui/core/es/LoadingCircular";
import {useTranslation} from "@control-ui/core/es/Provider/I18n";

const Code = Loadable({
    loader: () => import('./MarkdownCode'),
    loading: () => <LoadingCircular title={'Loading Web-IDE'}/>,
});

const LinkInternalLocale = (p) => {
    const {i18n} = useTranslation();
    return <MdLink {...p} href={0 !== p.href.indexOf('#') && -1 === p.href.indexOf('https://') && -1 === p.href.indexOf('http://') ? i18n.language + p.href : p.href}/>
};

// see: https://github.com/rexxars/react-markdown#node-types
const renderers = baseRenderers(true);
renderers.paragraph = p => <Typography {...p} component={'p'} variant={'body2'} gutterBottom/>;
renderers.inlineCode = p => <MdInlineCode variant={'body1'} {...p}/>;
renderers.code = p => <Code variant={'body2'} {...p}/>;
renderers.heading = ({level, ...p}) => <Typography {...p} component={'h' + (level + 1)} variant={'subtitle' + (level)} style={{textDecoration: 'underline', marginTop: 48 / level}} gutterBottom/>;
renderers.listItem = p => <Typography component={'li'} variant={'body2'} style={{fontWeight: 'bold'}}><span style={{fontWeight: 'normal', display: 'block'}}>{p.children}</span></Typography>;
renderers.link = LinkInternalLocale;

const renderersContent = baseRenderers(false);
renderersContent.code = p => <Code variant={'body1'} {...p}/>;
renderersContent.inlineCode = p => <MdInlineCode variant={'body1'} {...p}/>;
renderersContent.heading = LinkableHeadline;
renderersContent.link = LinkInternalLocale;

const astPlugins = [allowHtml()];
const Markdown = ({source, content = false}) =>
    <MarkdownBase source={source} astPlugins={astPlugins} renderers={content ? renderersContent : renderers}/>;

export {Markdown}
