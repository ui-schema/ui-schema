import React from "react";
import {Paper, Link} from "@material-ui/core";
import {ScrollUpButton} from "@control-ui/kit/ScrollUpButton";
import PageNotFound from "./PageNotFound";
import {DocDetails} from "@control-ui/docs/DocDetails";
import {HeadlineMenu} from "@control-ui/docs/LinkableHeadline";
import {PROCESS_ERROR, PROCESS_PROGRESS, PROCESS_START, PROCESS_SUCCESS} from "@control-ui/kit/Process";
import {LoadingCircular} from "@control-ui/kit/Loading/LoadingCircular";
import {Markdown} from "../component/Markdown";
import DemoUIGenerator from "../component/Schema/DemoUIGenerator";
import {PageContent} from "@control-ui/kit/PageContent";

const DocContent = ({content, id, progress, activeDoc}) => {

    return <>
        <PageContent maxWidth={'md'}>
            <Paper style={{margin: '12px 0', padding: '0 12px', display: 'flex', flexDirection: 'column', overflowX: 'auto', flexShrink: 0, background: 'transparent'}} elevation={4} variant={'outlined'}>
                <HeadlineMenu disableNavLink/>
            </Paper>
            <div style={{display: 'block', textAlign: 'right', margin: '0 12px'}}>
                <Link
                    target={'_blank'} rel='noreferrer noopener nofollow'
                    href={'https://github.com/ui-schema/ui-schema/tree/develop/packages/docs/src/content/docs/' + id + '.md'}
                >Edit Page</Link>
            </div>
            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column',}} elevation={4}>
                {progress === PROCESS_START || progress === PROCESS_PROGRESS ?
                    <LoadingCircular title={'Loading Docs'}/> :
                    progress === PROCESS_ERROR ?
                        'error' :
                        <React.Fragment>
                            <Markdown source={content} content/>
                        </React.Fragment>}
            </Paper>
            {progress === PROCESS_SUCCESS && activeDoc.context && activeDoc.context.demoUIGenerator ?
                <div style={{display: 'block', textAlign: 'right', margin: '0 12px'}}>
                    <Link
                        target={'_blank'} rel='noreferrer noopener nofollow'
                        href={'https://github.com/ui-schema/ui-schema/tree/develop/packages/docs/src/content/docs/' + id + 'Demo.js'}
                    >Edit Demos</Link>
                </div> : null}
            {progress === PROCESS_SUCCESS && activeDoc.context && activeDoc.context.demoUIGenerator ?
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column',}} elevation={4}>
                    <Markdown
                        source={`
## Demo UI Generator

Examples of this widget, using \`ds-material\`. Type in/change the input and check the data or change the schema (e.g. add specific keywords from above), the demo generators are showing invalid directly.
`} content/>
                    {activeDoc.context.demoUIGenerator.map(([demoText, demoSchema], i) =>
                        <React.Fragment key={i}>
                            <Markdown source={demoText} content/>
                            <DemoUIGenerator activeSchema={demoSchema} id={'i-' + i}/>
                        </React.Fragment>)}
                </Paper>
                : null}
        </PageContent>
    </>
};

const DocsDetails = ({scrollContainer,}) => {
    return <React.Fragment>
        <DocDetails
            scrollContainer={scrollContainer}
            title={activeDoc => activeDoc && activeDoc.nav && activeDoc.nav.label ?
                activeDoc.nav.label + ' · UI Schema' : 'UI Schema Documentation'}
            NotFound={PageNotFound}
            Content={DocContent}
        />
        <ScrollUpButton scrollContainer={scrollContainer}/>
    </React.Fragment>;
};

export default DocsDetails
