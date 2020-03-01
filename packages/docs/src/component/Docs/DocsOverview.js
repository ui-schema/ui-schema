import React from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {contentDocs, contentDocsWidgets} from '../../content/docs'
import {IconButton, Container, Paper,} from "@material-ui/core";
import {ArrowUpward} from "@material-ui/icons";
import DemoEditor from '../Schema/DemoEditor';
import {contentLoader} from "../ContentLoader";
import {LinkList, ListItemLink} from "../Link";
import {Markdown} from "../Markdown";
import {useTranslation} from "react-i18next";
import ErrorBoundary from "react-error-boundary";
import {containerStyle, Layout} from "../Layout/Layout";
import Head from "../Layout/Head";
import {LoadingCircular} from "../LoadingCircular";
import {HeadlineMenu} from "../LinkableHeadline";
import {AccessTooltipIcon} from "../Tooltip";

const DocDetails = ({scrollContainer, id, activeDoc}) => {
    const history = useHistory();
    const [loadedDoc, setLoadedDoc] = React.useState(0);

    const hash = history.location.hash;
    React.useEffect(() => {
        if(hash && loadedDoc && scrollContainer.current && scrollContainer.current.scrollTo) {
            const target = scrollContainer.current.querySelector(hash);
            if(target) {
                target.scrollIntoView();
            }
        }
    }, [hash, loadedDoc, scrollContainer]);

    React.useEffect(() => {
        setLoadedDoc(0);
        contentLoader('docs/' + id + '.md', (data, status) => {
            if(status === 200) {
                setLoadedDoc(data);
            } else {
                setLoadedDoc(false);
            }
        })
    }, [setLoadedDoc, id]);

    return <React.Fragment>
        <Paper style={{margin: 12, padding: '0 12px', display: 'flex', flexDirection: 'column', overflowX: 'auto', background: 'transparent'}} elevation={4} variant={'outlined'}>
            <HeadlineMenu/>
        </Paper>
        <Paper style={{margin: 12, padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
            <ErrorBoundary FallbackComponent={MyFallbackComponent}>
                {loadedDoc === 0 ?
                    <LoadingCircular title={'Loading Docs'}/> :
                    loadedDoc === false ?
                        'error' :
                        <React.Fragment>
                            <Markdown source={loadedDoc} content/>
                        </React.Fragment>}
            </ErrorBoundary>
        </Paper>
        {loadedDoc && activeDoc[2] && activeDoc[2].demoEditor ?
            <Paper style={{margin: 12, padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                <Markdown
                    source={`
## Demo Editor

Examples of this widget, using \`ds-material\`. Type in/change the input and check the data or change the schema (e.g. add specific keywords from above), the demo editors are showing invalid directly. 
`} content/>
                {activeDoc[2].demoEditor.map(([demoText, demoSchema], i) =>
                    <React.Fragment key={i}>
                        <Markdown source={demoText} content/>
                        <DemoEditor activeSchema={demoSchema} id={'i-' + i}/>
                    </React.Fragment>)}
            </Paper>
            : null}
    </React.Fragment>
};

const MyFallbackComponent = ({componentStack, error}) => (
    <div>
        <p><strong>An error occured!</strong></p>
        <p>Here’s what we know…</p>
        <p><strong>Error:</strong> {error.toString()}</p>
        <p><strong>Stacktrace:</strong> {componentStack}</p>
    </div>
);
const DocsOverview = () => {
    const {i18n} = useTranslation();
    const allContent = [...contentDocs, ...contentDocsWidgets];
    return <Paper style={{margin: 12, padding: 24}}>
        <LinkList>
            {allContent.map(([id, label], i) => <ListItemLink key={i} to={'/' + i18n.language + '/docs/' + id} primary={label}/>)}
        </LinkList>
    </Paper>
};

const ScrollUpButton = ({scrollContainer}) => {
    const [scrolledPages, setScrolledPage] = React.useState(0);

    const handleScroll = React.useCallback(() => {
        const scrolledPgs = (scrollContainer.current.scrollTop / scrollContainer.current.clientHeight).toFixed(1) * 1;
        if(scrolledPgs !== scrolledPages) {
            setScrolledPage(scrolledPgs);
        }
    }, [scrolledPages, scrollContainer]);

    React.useEffect(() => {
        const scrollCurrent = scrollContainer.current;
        scrollCurrent.addEventListener('scroll', handleScroll);
        return () => scrollCurrent.removeEventListener('scroll', handleScroll);
    }, [handleScroll, scrollContainer]);

    return <IconButton
        tabIndex="-1"
        style={{
            position: 'fixed', minWidth: 'auto', bottom: 20, right: 20, zIndex: 1000,
            pointerEvents: scrolledPages > 0.9 ? 'all' : 'none',
            opacity: scrolledPages > 0.9 ? 1 : 0,
            transition: 'opacity 0.25s ease-in-out',
        }}
        onClick={() => scrollContainer.current.scrollTo(0, 0)}>
        <AccessTooltipIcon title={'back to top of page'}>
            <ArrowUpward fontSize={'small'}/>
        </AccessTooltipIcon>
    </IconButton>;
};

const DocsHandler = ({scrollContainer}) => {
    const classes = containerStyle();
    const match = useRouteMatch();
    const doc = match.params[0];
    const allContent = [...contentDocs, ...contentDocsWidgets];
    const activeDoc = doc ? allContent.reduce((a, b) => a[0] === doc ? a : b) : undefined;

    return <React.Fragment>
        <Head title={activeDoc ? activeDoc[1] + ' Docs · UI-Schema' : 'UI-Schema Documentation'}/>
        <Container maxWidth={'md'} fixed className={classes.root}>
            {doc ?
                <DocDetails id={doc} scrollContainer={scrollContainer} activeDoc={activeDoc}/> :
                <DocsOverview/>}
        </Container>
        <ScrollUpButton scrollContainer={scrollContainer}/>
    </React.Fragment>;
};

const DocsProxy = () => <Layout Component={DocsHandler}/>;

export default DocsProxy
