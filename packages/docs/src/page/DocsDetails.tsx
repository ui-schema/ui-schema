import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import yaml from 'yaml'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import IcToc from '@mui/icons-material/Toc'
import IcShowFull from '@mui/icons-material/Expand'
import IcShowCompact from '@mui/icons-material/Compress'
import { HeadMeta } from '@control-ui/kit/HeadMeta'
import { ScrollUpButton } from '@control-ui/kit/ScrollUpButton'
import { DocsDetailsModules } from '../component/DocsDetailsModules'
import { DemoWidget } from '../schemas/_list'
import PageNotFound from './PageNotFound'
import { DocDetailsRenderer, DocDetailsProps } from '@control-ui/docs/DocDetails'
import { LinkableHeadlineMenu } from '@control-ui/docs/LinkableHeadline'
import { LoadingCircular } from '@control-ui/kit/Loading'
import { Markdown } from '../component/Markdown'
import DemoUIGenerator from '../component/Schema/DemoUIGenerator'
import { PageContent } from '@control-ui/kit/PageContent'
import Typography from '@mui/material/Typography'
import { DocRouteModule } from '../content/docs'
// import { DocsDetailsModules } from '../component/DocsDetailsModules'
import { DocRoute } from '@control-ui/docs'
import { useRouter } from '@control-ui/routes/RouterProvider'
import { useLocation } from 'react-router-dom'
import { filterRoutes } from '@control-ui/routes'
import Box from '@mui/material/Box'

const cachedContent = new Map<string, any>()

const DocContent: React.FC<{
    docBody: {
        id: string
        content: string
    } | null
    id: string
    progress: string
    doc?: DocRouteModule
}> = ({docBody, id, progress, doc}) => {
    const {palette} = useTheme()
    const {breakpoints} = useTheme()
    const isLg = useMediaQuery(breakpoints.up('lg'))
    const [fullWidth, setFullWidth] = React.useState(window.localStorage.getItem('docs-details--fullWidth') === 'yes')

    const mdDoc = React.useMemo(() => {
        if (!docBody) return undefined
        const lines: string[] = docBody.content.split('\n')
        // todo: add correct front-matter extraction, but e.g. `front-matter` is no longer maintained/browser-optimized
        let data: any = null
        if (lines[0] === '---') {
            const i = lines.slice(1).findIndex((l: string) => l === '---')
            if (i !== -1) {
                const fmLines = lines.splice(0, i + 2)
                if (fmLines.length) {
                    const ymlContent = fmLines.slice(1, -1).join('\n')
                    try {
                        data = yaml.parse(ymlContent)
                    } catch (e) {
                        console.error('frontmatter error', docBody, e)
                    }
                }
            }
        }
        return {
            data: data,
            content: lines.join('\n'),
        }
    }, [docBody])

    const docModule = doc?.docModule || mdDoc?.data?.docModule
    const codeDocsPath =
        docModule
        && docModule.package/* && (docModule.moduleFilePath || docModule.fromPath)*/
            ? '/docs/' + docModule.package + '/' + (docModule.moduleFilePath || docModule.fromPath || id.replaceAll('/', '-')) + '.json'
            : undefined
    const [modules, setModules] = React.useState<any>(codeDocsPath ? cachedContent.get(codeDocsPath) : undefined)
    const [loadingModuleDocs, setLoadingModuleDocs] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (!codeDocsPath) {
            setModules(undefined)
            setLoadingModuleDocs(false)
            return
        }

        const cachedCodeDocs = cachedContent.get(codeDocsPath)
        if (cachedCodeDocs) {
            setModules(cachedCodeDocs)
            setLoadingModuleDocs(false)
            // still try loading, to refresh on changes, e.g. for local HMR updates
        } else {
            setModules(undefined)
            setLoadingModuleDocs(true)
        }

        const abort = new AbortController()
        fetch(codeDocsPath, {signal: abort.signal})
            .then((res) => res.status !== 200 ? Promise.reject(res) : res.json())
            .then((data) => {
                if (abort.signal.aborted) return
                cachedContent.set(codeDocsPath, data)
                setModules(data)
                setLoadingModuleDocs(false)
            })
            .catch(e => {
                if (abort.signal.aborted) return
                console.error('error loading module-api docs', codeDocsPath, e)
                setLoadingModuleDocs(false)
            })
        return () => abort.abort()
    }, [codeDocsPath])

    return <>
        <PageContent maxWidth={isLg && fullWidth ? 'xl' : 'md'} style={{flexGrow: 1}}>
            <div style={{display: 'flex', alignItems: 'center', margin: '4px 12px'}}>
                {isLg ?
                    <Tooltip title={fullWidth ? 'show compact' : 'show full width'}>
                        <Button
                            onClick={() => {
                                setFullWidth(f => {
                                    const n = !f
                                    window.localStorage.setItem('docs-details--fullWidth', n ? 'yes' : 'no')
                                    return n
                                })
                            }}
                            color={'secondary'} size={'small'}
                        >
                            {fullWidth ? <IcShowCompact style={{transform: 'rotate(90deg)'}}/> : <IcShowFull style={{transform: 'rotate(90deg)'}}/>}
                        </Button>
                    </Tooltip> : null}
                <Typography variant={'body2'} style={{marginLeft: 'auto'}}>
                    <Link
                        target={'_blank'} rel="noreferrer noopener nofollow"
                        href={'https://github.com/ui-schema/ui-schema/tree/develop/packages/docs/src/content/' + id + '.md'}
                    >Edit Page</Link>
                </Typography>
            </div>

            <Paper
                component={'section'}
                sx={{
                    margin: '0 0 12px 0',
                    padding: '24px',
                    display: 'flex', flexDirection: 'column',
                    borderRadius: 2,
                    '& *': {
                        wordBreak: 'break-word',
                    },
                }}
                variant={'outlined'}
            >
                {progress === 'start' || progress === 'progress' ?
                    <LoadingCircular title={'Loading Docs'}/> :
                    progress === 'error' ?
                        <Box>
                            <Alert severity={'error'}>Error loading page.</Alert>
                        </Box> :
                        progress === 'not-found' ?
                            <PageNotFound
                                title={'Not Available'}
                                error={'This document seems to be vanished - or not yet created.'}
                            /> : null}
                {mdDoc ? <Markdown source={mdDoc.content}/> : null}
            </Paper>

            {progress === 'success' && doc?.demos?.schema ?
                <>
                    <div style={{display: 'block', textAlign: 'right', margin: '0 12px 4px 12px'}}>
                        <Typography variant={'body2'} style={{marginLeft: 'auto'}}>
                            <Link
                                target={'_blank'} rel="noreferrer noopener nofollow"
                                href={'https://github.com/ui-schema/ui-schema/tree/develop/packages/docs/src/content/' + id + 'Demo.js'}
                            >Edit Demos</Link>
                        </Typography>
                    </div>

                    <Paper style={{marginBottom: 12, padding: 24, display: 'flex', flexDirection: 'column', borderRadius: 5}} variant={'outlined'}>
                        <Markdown
                            source={`
## Demo UI Generator

Examples of this widget, using \`ds-material\`. Type in/change the input and check the data or change the schema (e.g. add specific keywords from above), the demo generators are showing invalid directly.
`}/>
                        {doc?.demos?.schema.map(([demoText, demoSchema, demoData]: DemoWidget, i) =>
                            <React.Fragment key={i}>
                                {demoText ?
                                    <Box mb={2}>
                                        <Markdown source={demoText}/>
                                    </Box> : null}
                                <DemoUIGenerator
                                    activeSchema={demoSchema}
                                    data={demoData}
                                    readOnly={doc?.demos?.readOnly}
                                    id={'i-' + i}
                                />
                            </React.Fragment>)}
                    </Paper>
                </> : null}

            {docModule ?
                <Paper
                    style={{margin: '24px 0 12px 0', padding: 24, display: 'flex', flexDirection: 'column', borderRadius: 5}}
                    variant={'outlined'}
                    component={'section'}
                >
                    <DocsDetailsModules codeDocumentation={modules}/>
                    {loadingModuleDocs ? <LoadingCircular title={'Loading Module API'}/> : null}
                </Paper> : null}
        </PageContent>

        <Paper
            style={{
                margin: '0 12px',
                // padding: '0 12px',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'auto',
                opacity: progress === 'success' ? 1 : 0,
                transition: '0.32s opacity ease-out',
                flexShrink: 0,
                position: 'sticky',
                bottom: 12,
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: '85vh',
                maxWidth: 375,
                borderRadius: 5,
                //borderTop: '1px solid ' + palette.primary.main,
                //background: palette.primary.main,
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
            }}
            // elevation={4}
            variant={'outlined'}
        >
            <LinkableHeadlineMenu
                disableNavLink
                //style={{margin: 0, padding: 0}}
                startIcon={<IcToc/>}
                titleStyle={{color: palette.background.paper, fontWeight: 'bold', background: palette.primary.main}}
                btnVariant={'contained'}
                disablePadding
                bindKey={'m'}
                linkListStyle={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}
                // collapseStyle={{overflow: 'auto'}}
                //linkItemStyle={{color: palette.background.paper}}
            />
        </Paper>
    </>
}

export const findDoc = (routes: DocRoute, id: string): DocRoute[] => filterRoutes<DocRoute>(routes, (route) => typeof route.doc === 'string' && route.path?.slice(1) === id)

const CustomDocDetails = <D extends DocRoute = DocRoute>(
    {
        title, description,
        headProps = {}, scrollContainer,
        Content, NotFound,
    }: Omit<DocDetailsProps<D>, 'path'>,
): React.ReactElement => {
    const {routes} = useRouter()
    const location = useLocation()
    const docId = location.pathname.slice(1)
    const doc = React.useMemo(
        () =>
            docId ? findDoc(routes as D, docId)[0] : undefined,
        [docId, routes],
    )

    return <React.Fragment>
        <HeadMeta
            title={title(doc as D)}
            description={description ? description(doc as D) : undefined}
            {...headProps}
        />
        {docId && doc ?
            <DocDetailsRenderer<D>
                id={doc.doc as string}
                scrollContainer={scrollContainer}
                doc={doc as D}
                Content={Content}
                path={location.pathname}
                hash={location.hash}
            /> :
            <NotFound/>}
    </React.Fragment>
}

const DocsDetails: React.FC<{ scrollContainer: React.RefObject<HTMLDivElement | null> }> = ({scrollContainer}) => {
    return <React.Fragment>
        <CustomDocDetails
            scrollContainer={scrollContainer}
            title={doc => doc?.nav?.label ?
                doc.nav.label + ' · UI Schema Docs' : 'UI Schema Documentation'}
            NotFound={PageNotFound}
            Content={DocContent}
        />
        <ScrollUpButton scrollContainer={scrollContainer} color={'secondary'} right={35} bottom={18} resetHash/>
    </React.Fragment>
}

export default DocsDetails
