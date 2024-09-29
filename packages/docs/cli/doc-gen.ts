import * as fs from 'fs'
import * as path from 'path'
import { parseFiles } from '@structured-types/api'
import * as reactPlugin from '@structured-types/react-plugin'
import { flattenRoutes } from '@control-ui/routes/flattenRoutes'
import { routes } from '../src/routes'
import { extractTsModule, indexTsDocs, writeTsDocs } from '@control-ui/docs-ts/writeTsDocs'
import { TsDocModuleFileSource } from '@control-ui/docs-ts/TsDocModule'
import { createDocsIndex, DocsIndexValueModules, DocsIndexValuePackages, DocsIndexValuesCombiner } from '@control-ui/docs/createDocsIndex'
import { DocRouteModule } from '../src/content/docs'

const base = path.resolve(path.join('public', 'docs'))
const baseModules = path.resolve('../')

const routing = routes(() => () => null)
const codeFiles = flattenRoutes<DocRouteModule, TsDocModuleFileSource>(
    routing as DocRouteModule,
    (r) =>
        typeof r.doc === 'string' && typeof r.docModule !== 'undefined',
    (r) => ({
        pagePath: r.path,
        ...r.docModule,
    } as TsDocModuleFileSource),
)

const codeFilesSrc: string[] = codeFiles.reduce((fileTree, file) => {
    return [...fileTree, ...file.files?.map(f => path.join(baseModules, file.relPath, f)) || []]
}, [] as string[])

const fileInfo = parseFiles(codeFilesSrc, {
    // @ts-ignore
    plugins: [reactPlugin],
    /* -
     * `2` does not contain function parameter types inside of interfaces
     * `2` resolves interface props shallow enough to read named ones easily, e.g. at `LayoutProps`
     * `3` resolves interface props too deep, making `ComponentClass<P> | FunctionComponent<P>` instead of `React.ComponentType<RouteComponentProps>` (in `LayoutProps`)
     * `3` resolves function params deep enough like in `DrawerProviderContext`, it creates: `(open: Boolean | setOpenHandler) => Void` - where `2` only makes: `(open) => Void`
     */
    maxDepth: 3,
    collectSourceInfo: true,
    collectHelpers: false,
    //collectInheritance: false,
    //collectInternals: true,
})

type CustomDocsIndex = DocsIndexValuesCombiner<DocsIndexValueModules & DocsIndexValuePackages>

const {index, update} = createDocsIndex<CustomDocsIndex>({
    modules: [],
    packages: {},
})

const parsed = indexTsDocs(
    baseModules,
    fileInfo,
    codeFiles,
    update,
    extractTsModule,
)

writeTsDocs(base, parsed, 2)
    .then((r) => {
        console.log('TS docs written', r.length, parsed.length)
    })
    .catch(() => {
        console.error('error while writing TS docs')
    })

fs.writeFile(path.join(base, 'index.json'), JSON.stringify(index), (err) => {
    if (err) {
        console.error('Failed saving doc of docsIndex', err)
        return
    }

    console.log('Saved TS docsIndex')
})
