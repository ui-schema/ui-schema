import { TsDocsSimple } from '@control-ui/docs-ts/TsDocsSimple'
import { Link } from '@control-ui/kit'
import Button from '@mui/material/Button'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Tooltip from '@mui/material/Tooltip'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LinkableHeadline } from '@control-ui/docs/LinkableHeadline'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { TsDocModuleCollectionSimple, TsDocsModuleRenderer } from '@control-ui/docs-ts/TsDocModule'
import { MdInlineCode } from '@control-ui/md/MdInlineCode'
import { Markdown } from './Markdown'

const ModuleHeadline: React.ComponentType<React.PropsWithChildren<{
    id: string
    level: number
}>> = ({id, level, children}) => {
    return <LinkableHeadline level={level} levelOffsetVariant={2} customId={id} mb={0} mt={0} style={{wordBreak: 'break-all'}}>
        <Box mt={0.5} mb={0.25}>
            {children}
        </Box>
    </LinkableHeadline>
}

const renderer: TsDocsModuleRenderer = {
    InlineCode: MdInlineCode,
    Markdown: Markdown as React.ComponentType<{ source: string, dense?: boolean }>,
    ModuleHeadline: ModuleHeadline,
    Details: ({definition: definitionProp}) => {
        const [showTypeText, setShowTypeText] = useState(false)
        const definition = definitionProp as any

        // note: React.FC is inferred a bit different, especially for typeReferences,
        //       while also unpopular now, it still offers special displays for react components
        const isReactC =
            (
                definition.type?.name === 'React.FC'
                || definition.type?.name === 'FC'
                || definition.type?.name === 'React.ComponentType'
                || definition.type?.name === 'ComponentType'
            )
            && definition.type?.filePath?.includes('@types/react')

        const reactCProps0 = isReactC ? definition.type?.typeArguments?.[0] : undefined
        const reactCProps =
            reactCProps0 && (
                reactCProps0.name === 'React.PropsWithChildren'
                || reactCProps0.name === 'PropsWithChildren'
            )
                ? reactCProps0.typeArguments?.[0] : reactCProps0

        // ignoring members from external types, especially for hiding e.g. `displayName`, `propTypes` from react components
        const members = definition.members?.filter(
            member =>
                !member.declLoc
                || !member.declLoc.filePath.includes('node_modules/@types'),
        )
        // if (
        //     !definition.uses
        //     && !definition.usedBy
        //     && !definition.members
        //     && !definition.parameters
        // ) return null
        return <Box>
            {/*{definition.uses ? <pre><code>{'uses: ' + JSON.stringify(definition.uses.length, undefined, 4)}</code></pre> : null}*/}

            {/*{definition.usedBy ? <pre><code>{'usedBy: ' + JSON.stringify(definition.usedBy.length, undefined, 4)}</code></pre> : null}*/}

            {definitionProp.kind === 'TypeAliasDeclaration' && definition.type?.kind ?
                <Box mt={0.5} mb={1}>
                    <Typography variant={'overline'} component={'p'} color={'secondary'}>Kind</Typography>
                    <Typography variant={'body2'} sx={{ml: 1}}>
                        <MdInlineCode>
                            {definition.type?.kind}
                        </MdInlineCode>
                    </Typography>
                </Box> : null}

            {definition.implements?.length ?
                <Box mt={1}>
                    <Typography variant={'overline'} component={'p'} color={'secondary'}>Implements</Typography>
                    <Box pl={3} pr={1} component={'ul'}>
                        {definition.implements.map((impl, i) =>
                            <Box key={i} component={'li'}>
                                {impl.type?.docPath ?
                                    <Tooltip
                                        title={`defined in ${impl.type.filePath}`}
                                        enterDelay={220} enterNextDelay={220}
                                    >
                                        <Link
                                            to={
                                                impl.type.docPath +
                                                '#doc-module--' + CSS.escape(impl.type.name)
                                            }
                                            primary={<MdInlineCode>{impl.type.text}</MdInlineCode>}
                                        />
                                    </Tooltip> :
                                    <MdInlineCode>{impl.type?.text}</MdInlineCode>}
                            </Box>,
                        )}
                    </Box>
                </Box> : null}

            {definition.extends?.length ?
                <Box mt={1}>
                    <Typography variant={'overline'} component={'p'} color={'secondary'}>Extends</Typography>
                    <Box pl={3} pr={1} component={'ul'}>
                        {definition.extends.map((ext, i) =>
                            <Box key={i} component={'li'}>
                                {ext.type?.docPath ?
                                    <Tooltip
                                        title={`defined in ${ext.type.filePath}`}
                                        enterDelay={220} enterNextDelay={220}
                                    >
                                        <Link
                                            to={
                                                ext.type.docPath +
                                                '#doc-module--' + CSS.escape(ext.type.name)
                                            }
                                            primary={<MdInlineCode>{ext.type.text}</MdInlineCode>}
                                        />
                                    </Tooltip> :
                                    <MdInlineCode>{ext.type?.text}</MdInlineCode>}
                            </Box>,
                        )}
                    </Box>
                </Box> : null}

            {definition.typeParameters?.length ?
                <DocsDetailsModuleChilds
                    title={'Type Parameters / Generics'}
                    childs={definition.typeParameters}
                /> : null}

            {isReactC && definition.type?.typeArguments ?
                <Box>
                    {/* render typeArguments manually, as no full type info like for childs, and specific to react components */}
                    <Typography variant={'overline'} component={'p'} color={'secondary'}>Component Props</Typography>
                    {definition.type?.typeArguments.map((typeArg, i) => {
                        const typeContent = typeArg.text ? <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0}}><code>{typeArg.text}</code></pre> : <em>{'unknown'}</em>
                        return <Box key={i} mb={1} px={1}>
                            {typeArg.docPath && typeArg.name ?
                                <Tooltip
                                    title={`defined in ${typeArg.filePath}`}
                                    enterDelay={220} enterNextDelay={220}
                                >
                                    <Link
                                        to={
                                            typeArg.docPath +
                                            '#doc-module--' + CSS.escape(typeArg.name)
                                        }
                                        primary={typeContent}
                                    />
                                </Tooltip> :
                                typeContent}
                        </Box>
                    })}
                </Box> : null}

            {!isReactC && definition.parameters?.length ?
                <DocsDetailsModuleChilds
                    title={'Parameters'}
                    childs={definition.parameters}
                /> : null}

            {!isReactC && members?.length ?
                <DocsDetailsModuleChilds
                    title={'Members'}
                    childs={members}
                /> : null}

            {reactCProps?.members?.length ?
                <DocsDetailsModuleChilds
                    title={'Members'}
                    childs={reactCProps.members}
                /> : null}

            {!isReactC && definition.returns?.length ?
                <Box mt={1}>
                    <Typography variant={'overline'} component={'p'} color={'secondary'} gutterBottom>Returns</Typography>
                    {definition.returns.map((returnDef, i) => {
                        const typeContent = returnDef.type?.text ? <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0}}><code>{returnDef.type?.text}</code></pre> : <em>{'unknown'}</em>
                        return <Box key={i} mb={1} px={1}>
                            {returnDef.description ?
                                <Markdown
                                    source={returnDef.description}
                                /> : null}

                            {/* todo: very often generic are returned, which don't have a link but this isn't distinguished yet */}
                            {enableChildLinks && returnDef.type?.docPath && returnDef.type.name ?
                                <Tooltip
                                    title={`defined in ${returnDef.type.filePath}`}
                                    enterDelay={220} enterNextDelay={220}
                                >
                                    <Link
                                        to={
                                            returnDef.type.docPath +
                                            '#doc-module--' + CSS.escape(returnDef.type.name)
                                        }
                                        primary={typeContent}
                                    />
                                </Tooltip> :
                                typeContent}
                        </Box>
                    })}
                </Box> : null}

            {/* @ts-expect-error */}
            {definitionProp.type?.implText || definitionProp.type?.text ?
                <Button
                    onClick={() => setShowTypeText(prev => !prev)}
                    variant={'text'} size={'small'} color={'secondary'}
                    sx={{ml: -0.5, typography: 'caption'}}
                >{showTypeText ? 'hide type' : 'show type'}</Button> : null}

            {/* @ts-expect-error */}
            {showTypeText && (definitionProp.type?.implText || definitionProp.type?.text) ?
                <Box px={1}>
                    {/* @ts-expect-error */}
                    <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: '12px 0 16px 0'}}><code>{definitionProp.type?.implText || definitionProp.type?.text}</code></pre>
                </Box> : null}

            {/* todo: aceeditor is too expensive to render */}
            {/*definitionProp.type?.implText ?
                <RichCodeEditor
                    value={definitionProp.type?.implText}
                    readOnly
                    mode={null}
                    fontSize={14} minLines={1} maxLines={30} enableShowAll
                    style={{margin: '8px 0 12px 0'}}
                /> : null*/}
        </Box>
    },
}

const enableChildLinks = false

const DocsDetailsModuleChilds = (
    {childs, title},
) => {
    return <Box mt={1}>
        <Typography variant={'overline'} component={'p'} color={'secondary'}>{title}</Typography>
        <Table size={'small'}>
            <TableHead>
                <TableRow>
                    <TableCell>
                        {'Name'}
                    </TableCell>
                    <TableCell>
                        {'Type'}
                    </TableCell>
                    <TableCell>
                        {'Description'}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {childs?.map((child, i) => {
                    const typeContent = child.type ? <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}><code>{child.type?.text}</code></pre> : ''
                    return <TableRow
                        key={i}
                    >
                        <TableCell>
                            {child.name}
                            {child.isOptional ? <small>{' (optional)'}</small> : ''}
                        </TableCell>
                        <TableCell>
                            {/* todo: this only works for simple reference types and incorrectly wraps also other types or more complex types with a link */}
                            {/* todo: the `filePath` is not always the correct one */}
                            {/* todo: it includes links on generics and other internal types, which don't have a link target */}
                            {enableChildLinks && child.type?.docPath ?
                                <Tooltip
                                    title={`defined in ${child.type.filePath}`}
                                    enterDelay={220} enterNextDelay={220}
                                >
                                    <Link
                                        to={
                                            child.type.docPath +
                                            '#doc-module--' + CSS.escape(child.type.name)
                                        }
                                        primary={typeContent}
                                    />
                                </Tooltip> :
                                typeContent}
                        </TableCell>
                        <TableCell
                            sx={{
                                '& *': {
                                    fontSize: 'inherit',
                                },
                            }}
                        >
                            {child.description ?
                                <Markdown
                                    source={child.description}
                                /> : null}

                            {'defaultValue' in child ?
                                <span style={{display: 'block'}}>
                                    <span>{'Default: '}</span>
                                    <MdInlineCode>{child.defaultValue}</MdInlineCode>
                                </span> : null}
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
        {/*<pre><code>{JSON.stringify(childs, undefined, 4)}</code></pre>*/}
    </Box>
}

export const DocsDetailsModules: React.ComponentType<{ codeDocumentation: TsDocModuleCollectionSimple | undefined }> = ({codeDocumentation}) => {
    const [showFiles, setShowFiles] = useState(false)
    const repoRoot = 'https://github.com/ui-schema/ui-schema/tree/master/packages/'
    return <>
        <LinkableHeadline level={1} customId={'module-api'} mb={4} mt={0}>
            Module API
        </LinkableHeadline>

        <Box mb={4}>
            <Alert severity={'info'} variant={'outlined'}>
                <AlertTitle>{'Basic Documentation'}</AlertTitle>
                <Typography gutterBottom variant={'body2'}>An overview of the exported variables and types. View details in their source files.</Typography>
                {/*<Typography gutterBottom variant={'body2'}>Experimental documentation generator, there may be missing or bad-UX parts in the generated code documentation.</Typography>*/}
                {/*<Typography variant={'body2'}>Additionally, not all source code is converted to full-Typescript yet, for the pure-JS parts nothing can be generated.</Typography>*/}
            </Alert>
            <Button onClick={() => setShowFiles(prev => !prev)} variant={'text'} size={'small'} sx={{ml: -0.5}}>
                {showFiles ? 'Hide Files' : 'Show Files'}
            </Button>
        </Box>

        {codeDocumentation ?
            <TsDocsSimple
                documentation={codeDocumentation}
                repoRoot={repoRoot}
                renderer={renderer}
                // showFiles={false}
                showFiles={showFiles}
            /> : null}
    </>
}
