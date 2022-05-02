import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LinkableHeadline } from '@control-ui/docs/LinkableHeadline'
import { Alert } from '@mui/material'
import { TsDocModuleCollection } from '@control-ui/docs-ts/TsDocModule'
import { TsDocsModuleRenderer, TsDocs } from '@control-ui/docs-ts/TsDocs'
import { MdInlineCode } from '@control-ui/md/MdInlineCode'
import { Markdown } from './Markdown'

const ModuleHeadline: React.ComponentType<React.PropsWithChildren<{
    id: string
    level: number
}>> = ({id, level, children}) => {
    return <LinkableHeadline level={level} levelOffsetVariant={2} customId={id} mb={0} mt={0} style={{wordBreak: 'break-all'}}>
        {children}
    </LinkableHeadline>
}

const renderer: TsDocsModuleRenderer = {
    InlineCode: MdInlineCode,
    Markdown: Markdown as React.ComponentType<{ source: string, dense?: boolean }>,
    ModuleHeadline: ModuleHeadline,
}

const warnOnTag = ['internal']
export const DocsDetailsModules: React.ComponentType<{ modules: TsDocModuleCollection | undefined }> = ({modules}) => {
    const repoRoot = 'https://github.com/ui-schema/ui-schema/tree/master/packages/'
    return <>
        <LinkableHeadline level={1} customId={'module-apis'} mb={4} mt={0}>
            Module APIs
        </LinkableHeadline>
        <Box mb={4}>
            <Alert severity={'warning'} variant={'outlined'}>
                <Typography gutterBottom variant={'body2'}>Experimental documentation generator, there may be missing or bad-UX parts in the generated code documentation.</Typography>
                <Typography variant={'body2'}>Additionally, not all source code is converted to full-Typescript yet, for the pure-JS parts nothing can be generated.</Typography>
            </Alert>
        </Box>

        {modules ?
            <TsDocs
                modules={modules}
                repoRoot={repoRoot}
                renderer={renderer}
                warnOnTag={warnOnTag}
            /> : null}
    </>
}
