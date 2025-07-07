import { TsDocModuleDefinition, TsDocModuleDefinitionSymbol, TsDocModuleDefinitionSymbolInfo, TsDocModuleFileSource, TsDocTagContent } from '@control-ui/docs-ts/TsDocModule'
import { flattenRoutes } from '@control-ui/routes/flattenRoutes'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as ts from 'typescript'
import { Node, SyntaxKind } from 'typescript'
import { DocRouteModule } from '../src/content/docs'
import { routes } from '../src/routes'

const basePathPackages = path.resolve(path.join(__dirname, '../../'))
const outputDir = path.resolve(path.join(__dirname, '..', 'public', 'docs'))
const indexFile = path.resolve(path.join(__dirname, '..', 'public', 'docs', 'index-modules.json'))

const verbose = false

function overwriteConsole() {
    const debug = console.debug
    console.debug = (...args: Parameters<Console['debug']>) => {
        if (!verbose) return
        debug(...args)
    }
}

overwriteConsole()

const startTime = Date.now()

const routing = routes(() => () => null)
const codeRoutes = flattenRoutes<DocRouteModule, TsDocModuleFileSource>(
    routing as DocRouteModule,
    (r) => typeof r.doc === 'string' && typeof r.docModule !== 'undefined',
    (r) => ({
        pagePath: r.path,
        ...r.docModule,
    } as TsDocModuleFileSource),
)

//console.log(codeRoutes)

// const limit = 4
const limit = codeRoutes.length
console.log(`Found ${codeRoutes.length} code documentation pages, output limited to ${limit}.`)

const configFilePath = ts.findConfigFile(basePathPackages, ts.sys.fileExists, 'tsconfig.json')
if (!configFilePath) {
    throw new Error(`No tsconfig detected for base ${basePathPackages}`)
}
console.debug(`Using configFile: ${configFilePath}`)
const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile)
const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config, ts.sys, basePathPackages,
    {
        allowJs: true,
        forceConsistentCasingInFileNames: true,
        suppressImplicitAnyIndexErrors: true,
        suppressExcessPropertyErrors: true,
    },
    configFilePath,
)

const program = ts.createProgram({
    rootNames: [
        ...parsedCommandLine.fileNames,
    ],
    projectReferences: parsedCommandLine.projectReferences,
    options: {
        ...parsedCommandLine.options,
        removeComments: false,
        stripInternal: false,
    },
})

const codeRouteInfos: (TsDocModuleFileSource & { definitions: any[] })[] = []
for(const codeRoute of codeRoutes.slice(0, limit)) {
    console.debug(`Generating Page Bundle: ${codeRoute.pagePath}`)

    const modulePath = path.join(basePathPackages, codeRoute.modulePath)
    const codeRouteInfo = {
        ...codeRoute,
        definitions: [] as any[],
    }
    codeRouteInfos.push(codeRouteInfo)

    for(const filePath of codeRoute.files) {
        const absoluteFilePath = path.join(modulePath, filePath)
        console.debug(`Generating for: ${path.dirname(absoluteFilePath)}`)

        const sourceFile = program.getSourceFile(absoluteFilePath)

        if (sourceFile) {
            const extractedDefinitions = extractModuleInfo(sourceFile, program)
            codeRouteInfo.definitions = codeRouteInfo.definitions.concat(extractedDefinitions)
        } else {
            throw new Error(`SourceFile not loaded: ${absoluteFilePath}`)
        }
    }
}

const dirsChecked = new Set<string>()

const createDir = (dir: string) => {
    if (dirsChecked.has(dir)) return
    dirsChecked.add(dir)
    fs.mkdirSync(dir, {recursive: true})
}

createDir(outputDir)

codeRouteInfos.forEach(codeRouteInfo => {
    const outputFile = path.join(
        outputDir,
        codeRouteInfo.package,
        // @ts-ignore
        (codeRouteInfo.moduleFilePath || codeRouteInfo.fromPath) + '.json',
    )
    console.debug(`Writing documentation bundle: ${outputFile}`)
    createDir(path.dirname(outputFile))
    fs.writeFileSync(outputFile, JSON.stringify(codeRouteInfo))
})

console.log(`Written ${codeRouteInfos.length} documentation bundles in ${((Date.now() - startTime) / 1000).toFixed(2)}s to: ${outputDir}`)

console.debug('Building index')

const index: {
    modules: {
        module: string
        package: string
        fromPath: string
        pagePath: string
    }[]
    packages: {
        [name: string]: {
            // module file to count of exported symbols
            [module: string]: number
        }
    }
} = {
    modules: [],
    packages: {},
}

codeRouteInfos.forEach(codeRouteInfo => {
    const baseModule = {
        package: codeRouteInfo.package,
        fromPath: codeRouteInfo.fromPath,
        pagePath: codeRouteInfo.pagePath,
    }
    if (!(codeRouteInfo.package in index.packages)) {
        index.packages[codeRouteInfo.package] = {}
    }
    index.packages[codeRouteInfo.package][codeRouteInfo.fromPath] ||= 0

    codeRouteInfo.definitions.forEach(definition => {
        index.packages[codeRouteInfo.package][codeRouteInfo.fromPath]++
        index.modules.push({
            module: definition.name,
            ...baseModule,
        })
    })
})

createDir(path.dirname(indexFile))
fs.writeFileSync(indexFile, JSON.stringify(index))
console.log(`Written index to: ${indexFile}`)

// ---
// todo: split up cli from lib
// ---

export function isJSDocText(node: Node): node is ts.JSDocText {
    return node.kind === SyntaxKind.JSDocText
}

export function isJSDocLink(node: Node): node is ts.JSDocLink {
    return node.kind === SyntaxKind.JSDocLink
}

export function isJSDocLinkCode(node: Node): node is ts.JSDocLinkCode {
    return node.kind === SyntaxKind.JSDocLinkCode
}

export function isJSDocLinkPlain(node: Node): node is ts.JSDocLinkPlain {
    return node.kind === SyntaxKind.JSDocLinkPlain
}

function isNodeDirectlyExported(node: ts.Node): boolean {
    return (
        (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0
    )
}

function isNodeExported(node: ts.Node): boolean {
    let exported = isNodeDirectlyExported(node)
        || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    let parent = node.parent

    while(parent && !exported) {
        exported = isNodeDirectlyExported(parent)
        parent = parent.parent
    }

    return exported
}


/**
 * @see {@link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker} for a simplified example on which part of this code was built upon
 */
function extractModuleInfo(entrypointFile: ts.SourceFile, program: ts.Program) {
    const checker = program.getTypeChecker()
    const definitions: TsDocModuleDefinition[] = []

    const visitedFiles = new Set<string>()

    function serializeType(symbol: ts.Symbol, node: ts.Node) {
        let typeString: string = ''
        if (symbol.flags & ts.SymbolFlags.Class) {
            const classType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)

            const formatFlags =
                ts.TypeFormatFlags.NoTruncation
                | ts.TypeFormatFlags.MultilineObjectLiterals
                // | ts.TypeFormatFlags.NoTypeReduction
                | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType
                // | ts.TypeFormatFlags.UseTypeOfFunction
                | ts.TypeFormatFlags.UseStructuralFallback
                | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
                | ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral
                | ts.TypeFormatFlags.WriteArrowStyleSignature
                | ts.TypeFormatFlags.WriteTypeArgumentsOfSignature
                // | ts.TypeFormatFlags.InTypeAlias
                | ts.TypeFormatFlags.AllowUniqueESSymbolType

            if (!classType) throw new Error(`No class type for ${symbol.getName()}`)

            let superclassString = ''
            const baseTypes = checker.getBaseTypes(classType as ts.InterfaceType)
            if (baseTypes.length > 0) {
                superclassString = ` extends ${baseTypes
                    .filter(base => {
                        const symbol = base.getSymbol()
                        return symbol && (symbol.flags & ts.SymbolFlags.Class)
                    })
                    // .filter(base => base.getSymbol()?.flags & ts.SymbolFlags.Class)
                    .map(base => checker.typeToString(base, undefined, formatFlags))
                    .join(', ')}`
            }

            const implementedInterfaces = baseTypes.filter(base => {
                const symbol = base.getSymbol()
                return symbol && (symbol.flags & ts.SymbolFlags.Interface)
            })
            let implementsString = ''
            if (implementedInterfaces.length > 0) {
                implementsString = ` implements ${implementedInterfaces.map(iface => checker.typeToString(iface, undefined, formatFlags)).join(', ')}`
            }

            typeString = `class ${symbol.name}${superclassString}${implementsString} {\n    /* ... */\n}`
        } else if (symbol.valueDeclaration) {
            typeString = checker.typeToString(
                checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration),
                // undefined,
                node,
                ts.TypeFormatFlags.NoTruncation
                | ts.TypeFormatFlags.MultilineObjectLiterals
                // | ts.TypeFormatFlags.NoTypeReduction
                | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType
                // | ts.TypeFormatFlags.UseTypeOfFunction
                // | ts.TypeFormatFlags.UseStructuralFallback
                | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
                | ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral
                | ts.TypeFormatFlags.WriteArrowStyleSignature
                | ts.TypeFormatFlags.WriteTypeArgumentsOfSignature
                | ts.TypeFormatFlags.AllowUniqueESSymbolType,
            )
            // todo: even with `MultilineObjectLiterals` it doesn't generate line breaks,
            //       contains four spaces at various positions etc.,
            //       improve by using a custom printer or format with prettier?
            typeString = `const ${symbol.name}: ` + formatTypeString(typeString)
        } else {
            // interface, type
            const declarations = symbol.getDeclarations()
            if (declarations) {
                declarations.forEach(decl => {
                    const type = checker.getTypeAtLocation(decl)
                    if (type.isClassOrInterface()) {
                        const properties = checker.getPropertiesOfType(type)
                        // todo: generics
                        typeString = `interface ${symbol.name} {
` + properties.map(prop => {
                            const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!)
                            const isOptional = prop.flags & ts.SymbolFlags.Optional
                            const propTypeString: string = checker.typeToString(
                                propType,
                                undefined,
                                ts.TypeFormatFlags.NoTruncation
                                | ts.TypeFormatFlags.MultilineObjectLiterals
                                | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType
                                | ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral
                                | ts.TypeFormatFlags.WriteArrowStyleSignature
                                //| ts.TypeFormatFlags.NoTypeReduction
                                | ts.TypeFormatFlags.WriteTypeArgumentsOfSignature
                                | ts.TypeFormatFlags.AllowUniqueESSymbolType,
                            )
                            return `    ${prop.name}${isOptional ? '?' : ''}: ${formatTypeString(propTypeString, 4)}`
                        }).join('\n') + '\n}'
                    } else {
                        typeString = decl.getText(node?.getSourceFile())
                        if (typeString.startsWith('export ')) {
                            typeString = typeString.slice('export '.length)
                        }
                        // const typeName = symbol.getName()
                        // if(typeString.startsWith(`type ${typeName} =`)) {
                        //     typeString = typeString.slice(`type ${typeName} =`.length).trim()
                        // }
                        // } else if(typeString.startsWith(`type ${typeName}<`)) {
                        //     typeString = typeString.slice(`type ${typeName}`.length).trim()
                        // }
                    }
                })
            } else {
                console.log(`No declarations found for symbol ${symbol.getName()}`)
            }
        }
        return typeString
    }

    function serializeSymbol(symbol: ts.Symbol, node: ts.Node): TsDocModuleDefinitionSymbol {
        if (symbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = checker.getAliasedSymbol(symbol)
            console.log('aliased', checker.typeToString(checker.getTypeOfSymbolAtLocation(aliasedSymbol, node)))
        }

        const typeString = serializeType(symbol, node)
        return {
            name: symbol.getName(),
            description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
            type: {
                text: typeString,
            },
        }
    }

    function formatTypeString(typeStr: string, depth = 0): string {
        return typeStr
            .replace(/\s+/g, ' ')
            .replace(/\{(.+)}/g, (match, group) => {
                const lines = group.split(';')
                return lines.length > 2 ? '{\n' + lines.map(l => l.trim() ? ' '.repeat(depth + 4) + l.trim() + ';\n' : '').join('') + ' '.repeat(depth) + '}' : match
            })
            .replace(/\n\s*\n/g, '\n')
            .replace(/\{ +/g, '{ ')
            .replace(/;}/g, '; }')
    }

    function getJSDocComments(comment: ts.JSDoc['comment']): TsDocTagContent[] | undefined {
        // todo: maybe transform directly to Markdown instead of exposing as array?
        return typeof comment === 'string'
            ? [{kind: 'JSDocText', text: comment}]
            : Array.isArray(comment)
                ? comment
                    .map((c): TsDocTagContent =>
                        isJSDocLink(c)
                            ? {
                                kind: 'JSDocLink',
                                text:
                                    (
                                        c.name
                                            ? ts.isIdentifier(c.name)
                                                // note: protocol of HTTP links are inside the name
                                                ? c.name.text
                                                : c.name.kind === SyntaxKind.JSDocMemberName
                                                    ? 'member:' + c.name.getText() // todo?
                                                    : ts.isQualifiedName(c.name)
                                                        ? 'ref:' + c.name.getText() // todo?
                                                        : ''
                                            : ''
                                    ) + c.text,
                            } :
                            ({
                                kind: 'JSDocText',
                                // kind: SyntaxKind[c.kind],
                                text: c.text,
                            }),
                    )
                    .filter(t => t.text)
                : undefined
    }

    function extractJsDoc(node: ts.Node): TsDocModuleDefinitionSymbolInfo | undefined {
        const symbol =
            (node as ts.NamedDeclaration).name ?
                checker.getSymbolAtLocation((node as ts.NamedDeclaration).name as ts.Node) : undefined

        if (!symbol) {
            console.log(`Missing Symbol ${SyntaxKind[node.kind]} ${(node as ts.NamedDeclaration).name?.getText(node.getSourceFile())} in ${node.getSourceFile().fileName}`)
            return undefined
        }

        const jsDocs = ts.getJSDocCommentsAndTags(node)
        // todo: merge all?
        // todo: jsDocs is typed `(ts.JSDoc | ts.JSDocTag)[]`, check how to handle completely
        const jsDoc = jsDocs?.find(function(value): value is ts.JSDoc {
            return value.kind === SyntaxKind.JSDoc
        })
        if (jsDoc) {
            // note: the Symbol documentation also includes JSDoc, even if specified at higher levels,
            //       meaning it merges JSDoc at FirstStatement and inside VariableDeclaration into one,
            //       thus if a symbol exists, plain JSDoc comments shouldn't be needed
            const comment = typeof jsDoc.comment === 'string' && symbol ? undefined : getJSDocComments(jsDoc.comment)
            const {flags, tags} = jsDoc.tags?.reduce<{
                flags: Pick<TsDocModuleDefinitionSymbolInfo, 'deprecated' | 'internal'>
                tags: NonNullable<TsDocModuleDefinitionSymbolInfo['tags']>
            }>((parsed, t) => {
                if (t.tagName.text === 'internal') {
                    parsed.flags.internal = true
                }
                if (t.kind === SyntaxKind.JSDocDeprecatedTag) {
                    parsed.flags.deprecated = true
                }
                if (
                    t.kind === SyntaxKind.JSDocSeeTag
                    || t.kind === SyntaxKind.JSDocAuthorTag
                    || t.kind === SyntaxKind.JSDocDeprecatedTag
                    || t.tagName.text === 'internal'
                    || t.tagName.text === 'todo'
                    || t.tagName.text === 'remarks'
                    || t.tagName.text === 'example'
                ) {
                    const tagName = t.tagName.text
                    if (!(tagName in parsed.tags)) {
                        parsed.tags[tagName] = []
                    }
                    parsed.tags[tagName].push(getJSDocComments(t.comment))
                }
                return parsed
            }, {flags: {}, tags: {}}) || {}

            return {
                ...serializeSymbol(symbol, node),
                ...comment?.length ? {comment: comment} : {},
                ...flags || {},
                tags: tags,
            }
        }

        return serializeSymbol(symbol, node)
    }

    function extractCommon(
        node: ts.Node,
        sourceFile: ts.SourceFile,
        {includeParent}: { includeParent?: boolean } = {},
    ): Omit<TsDocModuleDefinition, 'exported'> {
        const name = (node as ts.NamedDeclaration).name?.getText(sourceFile)
        return {
            name: name || 'anonymous',
            kind: ts.SyntaxKind[node.kind],
            ...includeParent ? {parent: node.parent ? ts.SyntaxKind[node.parent.kind] : null} : {},
            loc: {
                filePath: path.relative(basePathPackages, sourceFile.fileName).replaceAll('\\', '/'),
                // note: line is 0-based
                start: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, true)),
                end: sourceFile.getLineAndCharacterOfPosition(node.getEnd()),
            },
            ...extractJsDoc(node),
        }
    }

    const visitInFile = (sourceFile: ts.SourceFile) => (node: ts.Node) => {
        if (ts.isClassDeclaration(node)) {
            definitions.push({
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            })
        }

        if (ts.isFunctionDeclaration(node)) {
            definitions.push({
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            })
        }

        if (ts.isVariableDeclaration(node)) {
            definitions.push({
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            })
        }

        if (ts.isInterfaceDeclaration(node)) {
            definitions.push({
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            })
        }

        if (ts.isTypeAliasDeclaration(node)) {
            definitions.push({
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            })
        }

        if (
            ts.isModuleDeclaration(node)
            || ts.isVariableDeclarationList(node)
            || node.kind === SyntaxKind.FirstStatement
        ) {
            ts.forEachChild(node, visitInFile(sourceFile))
        } else if (ts.isExportDeclaration(node)) {
            // namespace export, resolve and visit its children
            if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                const moduleName = node.moduleSpecifier.text

                const containingFile = sourceFile.fileName
                const compilerOptions = program.getCompilerOptions()

                // todo: is resolve only needed when NOT using `rootName` or something which is not included in the `tsconfig` includes?
                const resolvedModuleName = ts.resolveModuleName(
                    moduleName,
                    containingFile,
                    compilerOptions,
                    ts.sys,
                )

                if (resolvedModuleName.resolvedModule) {
                    const resolvedFileName = resolvedModuleName.resolvedModule.resolvedFileName

                    if (visitedFiles.has(resolvedFileName)) {
                        return
                    }

                    visitedFiles.add(resolvedFileName)

                    // console.log(`Resolved module: ${resolvedFileName}`)
                    const exportedSourceFile = program.getSourceFile(resolvedFileName)
                    if (exportedSourceFile) {
                        // todo: add file to bundle `files`
                        ts.forEachChild(exportedSourceFile, visitInFile(exportedSourceFile))
                    } else {
                        throw new Error(`SourceFile not available: ${resolvedFileName}`)
                    }
                } else {
                    throw new Error(`Export not resolved: ${moduleName}`)
                }
            }
        }
    }

    ts.forEachChild(entrypointFile, visitInFile(entrypointFile))

    // todo: implement referencing, to keep children which are not exported but referenced,
    //       most likely filtering must be moved after scanning all files included in any documentation page
    return definitions.filter(c => c.exported || c.referenced)
}
