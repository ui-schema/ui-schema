import * as fs from 'fs'
import * as path from 'path'
import { flattenRoutes } from '@control-ui/routes/flattenRoutes'
import { routes } from '../src/routes'
import { DocsIndexValuePageInfo, DocsIndexValuePages, DocsIndexValuesCombiner } from '@control-ui/docs/createDocsIndex'
import * as fm from 'front-matter'
import { makeIdFromText } from '@control-ui/docs/makeIdFromText'
import { DocRoute } from '@control-ui/docs'

const base = path.resolve(path.join('public', 'docs'))
const baseContent = path.resolve(path.join('src', 'content'))
const fileName = 'index-pages.json'

const routing = routes()
const flatRoutes = flattenRoutes<DocRoute, DocsIndexValuePageInfo & { doc: string }>(
    routing,
    (r) => Boolean(r.doc || !r.routes),
    (r, parent) => ({
        doc: r.doc as string,
        pagePath: r.nav?.to as string,
        label: r.nav?.label,
        parentLabel: parent && parent.label ? [...(parent.parentLabel || []), parent.label] : [],
    }),
)

const naiveLinesParser = (
    lines: string[],
    open: string,
    isClosing?: (line: string) => boolean,
): {
    type: string
    children: any[]
} => {
    const elements: any[] = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (isClosing && isClosing(line)) {
            break
        }
        if (open !== 'code' && line.startsWith('#')) {
            const hTypes = [
                ['# ', 'h1'],
                ['## ', 'h2'],
                ['### ', 'h3'],
                ['#### ', 'h4'],
                ['##### ', 'h5'],
                ['###### ', 'h6'],
            ]
            const hType = hTypes.find(([prefix]) => line.startsWith(prefix))
            if (hType) {
                elements.push({
                    type: hType[1],
                    text: line.slice(hType[0].length),
                    start: i + 1,
                })
            } else {
                console.error('invalid headline')
            }
        } else if (
            open !== 'code' && (
                line.match(/^---*$/) ||
                line.match(/^___*$/) ||
                line.match(/^\*\*\**$/)
            )
        ) {
            elements.push({
                type: 'hr',
                start: i + 1,
            })
        } else if (open !== 'code' && line.match(/^\s*?\d\.\s.*/)) {
            elements.push({
                type: 'ol',
                text: line.slice(2),
                start: i + 1,
            })
        } else if (open !== 'code' && line.startsWith('|')) {
            elements.push({
                ...naiveLinesParser(line.slice(1).split('|'), 'tr'),
                start: i + 1,
            })
        } else if (open !== 'code' && line.startsWith('> ')) {
            const element = naiveLinesParser(lines.slice(i + 1), 'quote', (line) => !line.startsWith('> '))
            elements.push({
                ...element,
                start: i + 1,
                end: i + element.children.length,
            })
            i = i + element.children.length
        } else if (open !== 'code' && line.startsWith('      ')) {
            const element = naiveLinesParser(lines.slice(i + 1), 'code', (line) => !line.startsWith('      '))
            elements.push({
                ...element,
                start: i + 1,
                end: i + element.children.length,
            })
            i = i + element.children.length
        } else if (line.startsWith('```')) {
            const element = naiveLinesParser(lines.slice(i + 1), 'code', (line) => line.startsWith('```'))
            elements.push({
                ...element,
                start: i + 1,
                end: i + element.children.length + 2,
            })
            i = i + element.children.length + 1
        } else {
            elements.push({
                type: 'line',
                text: line,
                start: i + 1,
            })
        }
    }

    return {
        type: open,
        children: elements,
    }
}

const naiveParser = (md: string) => {
    const lines = md.split('\n')
    return naiveLinesParser(lines, 'root')
}

Promise.all(
    flatRoutes.map(r => {
        const file = path.join(baseContent, r.doc + '.md')
        return new Promise<any>((resolve, reject) => {
            fs.readFile(file, (err, file) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve({
                            /*headings: headings.map(h => ({
                                fragment: makeIdFromText(h.text),
                                headline: h.text,
                            })),*/
                            pagePath: r.pagePath,
                            label: r.label,
                            parentLabel: r.parentLabel,
                            // desc: fmData.attributes.description,
                        })
                        return
                    }
                    console.error('failed reading file', file, err)
                    reject()
                    return
                }
                const mdFile = file.toString()
                // @ts-ignore
                const fmData = fm(mdFile) as {
                    attributes: { [k: string]: any }
                    body: string
                    bodyBegin: number
                }

                const mdData = naiveParser(fmData.body)
                const headings = mdData.children.filter(child => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(child.type) !== -1)

                resolve({
                    headings: headings.map(h => ({
                        fragment: makeIdFromText(h.text),
                        headline: h.text,
                    })),
                    pagePath: r.pagePath,
                    label: r.label,
                    parentLabel: r.parentLabel,
                    desc: fmData.attributes.description,
                })
                /*fs.writeFile(path.join(base, 'debug', r.pagePath.replace(/\//g, '-').slice(1) + '.json'), JSON.stringify(mdData, undefined, 4), (err) => {
                    if(err) {
                        console.error('Failed saving doc of ' + r.pagePath, err)
                        reject()
                        return
                    }

                    console.log('Saved ' + fileName, r.pagePath)
                    resolve(undefined)
                })*/
            })
        })
    }),
)
    .then((res) => {
        const pageIndex = res.filter(r => typeof r !== 'undefined')
        const index: DocsIndexValuesCombiner<DocsIndexValuePages> = {
            pages: pageIndex,
        }

        fs.writeFile(path.join(base, fileName), JSON.stringify(index), (err) => {
            if (err) {
                console.error('Failed saving doc of ' + fileName, err)
                return
            }

            console.log('Saved ' + fileName, pageIndex.length)
        })
    })
    .catch(e => console.error('Fatal error', e))
