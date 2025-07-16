import { TsDocModuleDefinition, TsDocModuleDefinitionSymbol, TsDocModuleDefinitionSymbolInfo, TsDocModuleFileSource, TsDocTagContent } from '@control-ui/docs-ts/TsDocModule'
import { flattenRoutes } from '@control-ui/routes/flattenRoutes'
import * as fm from 'front-matter'
import { globSync } from 'glob'
import * as fsSync from 'node:fs'
import * as path from 'node:path'
import * as ts from 'typescript'
import { Node, SyntaxKind } from 'typescript'
import { DocRouteModule } from '../src/content/docs'
import { routes } from '../src/routes'

const basePathPackages = path.resolve(path.join(__dirname, '../../'))
const outputDir = path.resolve(path.join(__dirname, '..', 'public', 'docs'))
const indexFile = path.resolve(path.join(__dirname, '..', 'public', 'docs', 'index-modules.json'))
const indent: number | undefined = 4

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

const routing = routes()
// const codeRoutes = flattenRoutes<DocRouteModule, TsDocModuleFileSource>(
//     routing as DocRouteModule,
//     (r) => typeof r.doc === 'string' && typeof r.docModule !== 'undefined',
//     (r) => ({
//         pagePath: r.path,
//         ...r.docModule,
//     } as TsDocModuleFileSource),
// )
const allRoutes = flattenRoutes<DocRouteModule, DocRouteModule>(
    routing as DocRouteModule,
    () => true,
    (r) => r,
)

const codeRoutes: TsDocModuleFileSource[] = []

for (const r of allRoutes) {
    if (typeof r.doc === 'string' && typeof r.docModule !== 'undefined') {
        codeRoutes.push({
            pagePath: r.path,
            ...r.docModule,
        } as TsDocModuleFileSource)
    } else if (r.doc) {
        const file = path.join(basePathPackages, 'docs', 'src', 'content', r.doc + '.md')
        // @ts-ignore
        const fileContent = fm(fsSync.readFileSync(file).toString()) as {
            attributes: { [k: string]: any }
            body: string
            bodyBegin: number
        }
        if (fileContent.attributes.docModule) {
            codeRoutes.push({
                pagePath: r.path,
                ...fileContent.attributes.docModule,
            } as TsDocModuleFileSource)
        }
    }
}

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

/**
 * @todo already different between here and UI, not really useful
 *       - `declLoc` is specific for members and not directly defined
 *       - structured type info is needed for other complex types, incl. `extends`
 */
type TypeLink = {
    name: string
    filePath: string
    docPath: string
}
type TypeLinks = { [key: string]: TypeLink }

type TsDocModuleDefinitionExtended =
    TsDocModuleDefinition &
    {
        extends?: TsDocModuleDefinitionSymbolExtended[]
        implements?: TsDocModuleDefinitionSymbolExtended[]
        typeParameters?: TsDocModuleDefinition[]
        parameters?: TsDocModuleDefinitionExtended[]
        members?: (TsDocModuleDefinitionExtended & {
            declLoc?: {
                filePath: string
                start: ts.LineAndCharacter
                end: ts.LineAndCharacter
            }
        })[]
        types?: TsDocModuleDefinitionExtended[]
        returns?: TsDocModuleDefinitionExtended[]
        isRest?: boolean
        isOptional?: boolean
        typeLinks?: TypeLinks
        // modifiers?:
        defaultValue?: string
    }

type TsDocModuleDefinitionSymbolExtended =
    TsDocModuleDefinitionSymbol &
    {
        type?: TypeLink & {
            text: string
            implText?: string
        }
    }

type CodeRouteInfo =
    TsDocModuleFileSource &
    {
        moduleFilePath?: string
        fromPath?: string
        definitions: TsDocModuleDefinitionExtended[]
    }

const defNodes = new Map<object, ts.Node>()
const codeRouteInfos: CodeRouteInfo[] = []

const filePathToCodeRouteMap = new Map<string, TsDocModuleFileSource>()

for (const codeRoute of codeRoutes.slice(0, limit)) {
    const modulePath = path.join(basePathPackages, codeRoute.modulePath)

    const absoluteFileNames: string[] = []
    for (const filePath of codeRoute.files) {
        if (filePath.includes('*')) {
            const r = globSync(filePath, {
                cwd: modulePath,
                absolute: true,
                nodir: true,
            })
            absoluteFileNames.push(...r.filter(f => {
                return ![
                    '.mock.ts',
                    '.mock.tsx',
                    '.test.ts',
                    '.test.tsx',
                ].some(ext => f.endsWith(ext))
            }))
        } else {
            const absoluteFilePath = path.join(modulePath, filePath)
            absoluteFileNames.push(absoluteFilePath)
        }
    }

    for (const resolvedFile of absoluteFileNames) {
        const normalizedPath = resolvedFile.replaceAll('\\', '/')
        if (filePathToCodeRouteMap.has(normalizedPath)) {
            console.warn(`Warning: File ${resolvedFile} is included in multiple documentation pages. This may lead to ambiguous links.`)
        }
        // todo: this links the whole file to the codeRoute, while documentation only includes `exported` symbols,
        //       but due to this step, all types have `docPath`, even for internal types or even generics,
        //       which would need the decision about including all types, with a new flat index per docPath
        filePathToCodeRouteMap.set(normalizedPath, codeRoute)
    }

    const codeRouteInfo: CodeRouteInfo = {
        ...codeRoute,
        definitions: [] as TsDocModuleDefinitionExtended[],
        // note: this overwrites the initial files with the actual found and resolved once
        files: absoluteFileNames.map(absFile => path.relative(basePathPackages, absFile).replaceAll('\\', '/')),
    }
    codeRouteInfos.push(codeRouteInfo)
}

for (const codeRouteInfo of codeRouteInfos) {
    console.debug(`Generating Page Bundle: ${codeRouteInfo.pagePath}`)

    // Key: symbolName, Value: filePath where it's defined.
    const symbolOriginMap = new Map<string, string>()
    // Key: `filePath#symbolName`, Value: The definition object.
    const uniqueDefinitions = new Map<string, TsDocModuleDefinition>()

    const absoluteFileNames = codeRouteInfo.files.map(relFile => path.join(basePathPackages, relFile))
    for (const absoluteFilePath of absoluteFileNames) {
        console.debug(`Generating for: ${path.dirname(absoluteFilePath)}`)

        const sourceFile = program.getSourceFile(absoluteFilePath)

        if (sourceFile) {
            const extractedDefinitions = extractModuleInfo(
                sourceFile,
                program,
                defNodes,
                filePathToCodeRouteMap,
            )
            for (const definition of extractedDefinitions) {
                const symbolName = definition.name
                const symbolFilePath = definition.loc.filePath

                if (symbolOriginMap.has(symbolName) && symbolOriginMap.get(symbolName) !== symbolFilePath) {
                    throw new Error(
                        `Ambiguous Export: Symbol '${symbolName}' in code route '${codeRouteInfo.pagePath}' is exported from multiple files. ` +
                        `This is not allowed.\n` +
                        `  - Existing: ${symbolOriginMap.get(symbolName)}\n` +
                        `  - New:      ${symbolFilePath}`,
                    )
                }
                symbolOriginMap.set(symbolName, symbolFilePath)

                const uniqueKey = `${symbolFilePath}#${symbolName}`
                if (!uniqueDefinitions.has(uniqueKey)) {
                    uniqueDefinitions.set(uniqueKey, definition)
                }
            }
        } else {
            throw new Error(`SourceFile not loaded: ${absoluteFilePath}`)
        }
    }

    codeRouteInfo.definitions = Array.from(uniqueDefinitions.values())
}

// const symbolMap = new Map<string, {
//     definition: TsDocModuleDefinition
//     codeRouteInfo: typeof codeRouteInfos[0]
// }>()
//
// for (const codeRouteInfo of codeRouteInfos) {
//     for (const definition of codeRouteInfo.definitions) {
//         if (!symbolMap.has(definition.name)) {
//             symbolMap.set(definition.name, {definition, codeRouteInfo})
//         }
//     }
// }
//
// for (const codeRouteInfo of codeRouteInfos) {
//     for (const definition of codeRouteInfo.definitions) {
//
//         const findLinksInNode = (node: ts.Node): TypeLinks => {
//             const links: TypeLinks = {}
//             const visitor = (n: ts.Node): void => {
//                 if (ts.isTypeReferenceNode(n)) {
//                     const typeName = n.typeName.getText()
//                     if (links[typeName]) return
//                     const match = symbolMap.get(typeName)
//                     if (match) {
//                         links[typeName] = {
//                             name: typeName,
//                             docPath: match.codeRouteInfo.pagePath,
//                             filePath: match.definition.loc.filePath,
//                         }
//                     }
//                 }
//                 ts.forEachChild(n, visitor)
//             }
//             visitor(node)
//             return links
//         }
//
//         if (definition.extends) {
//             for (const ext of definition.extends) {
//                 const match = symbolMap.get(ext.name)
//                 if (match) {
//                     definition.typeLinks ??= {}
//                     definition.typeLinks[ext.name] = {
//                         name: ext.name,
//                         docPath: match.codeRouteInfo.pagePath,
//                         filePath: match.definition.loc.filePath,
//                     }
//                 }
//             }
//         }
//         if (definition.implements) {
//             for (const impl of definition.implements) {
//                 const match = symbolMap.get(impl.name)
//                 if (match) {
//                     definition.typeLinks ??= {}
//                     definition.typeLinks[impl.name] = {
//                         name: impl.name,
//                         docPath: match.codeRouteInfo.pagePath,
//                         filePath: match.definition.loc.filePath,
//                     }
//                 }
//             }
//         }
//
//         if (definition.members) {
//             for (const member of definition.members) {
//                 const memberNode = defNodes.get(member)
//                 if (memberNode && (ts.isPropertyDeclaration(memberNode) || ts.isPropertySignature(memberNode)) && memberNode.type) {
//                     const links = findLinksInNode(memberNode.type)
//                     if (Object.keys(links).length > 0) {
//                         member.typeLinks = links
//                     }
//                 }
//             }
//         }
//
//         if (definition.parameters) {
//             for (const parameter of definition.parameters) {
//                 const parameterNode = defNodes.get(parameter) as ts.ParameterDeclaration
//                 if (parameterNode?.type) {
//                     const links = findLinksInNode(parameterNode.type)
//                     if (Object.keys(links).length > 0) {
//                         parameter.typeLinks = links
//                     }
//                 }
//             }
//         }
//
//         if (definition.returns) {
//             for (const returnDef of definition.returns) {
//                 const returnNode = defNodes.get(returnDef)
//                 if (returnNode) {
//                     const links = findLinksInNode(returnNode)
//                     if (Object.keys(links).length > 0) {
//                         returnDef.typeLinks = links
//                     }
//                 }
//             }
//         }
//     }
// }

const dirsChecked = new Set<string>()

const createDir = (dir: string) => {
    if (dirsChecked.has(dir)) return
    dirsChecked.add(dir)
    fsSync.mkdirSync(dir, {recursive: true})
}

createDir(outputDir)

codeRouteInfos.forEach(codeRouteInfo => {
    const outputFile = path.join(
        outputDir,
        codeRouteInfo.package,
        (
            codeRouteInfo.moduleFilePath
            || codeRouteInfo.fromPath
            || (codeRouteInfo.pagePath.startsWith('/') ? codeRouteInfo.pagePath.slice(1) : codeRouteInfo.pagePath).replaceAll('/', '-')
        ) + '.json',
    )
    console.debug(`Writing documentation bundle: ${outputFile}`)
    createDir(path.dirname(outputFile))
    fsSync.writeFileSync(outputFile, JSON.stringify(codeRouteInfo, undefined, indent))
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
    symbolIndex: {
        [symbolName: string]: {
            package: string
            fromPath: string
            pagePath: string
            filePath: string
        }[]
    }
} = {
    modules: [],
    packages: {},
    symbolIndex: {},
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
    const bundleName =
        codeRouteInfo.moduleFilePath || codeRouteInfo.fromPath ||
        (codeRouteInfo.pagePath.startsWith('/') ? codeRouteInfo.pagePath.slice(1) : codeRouteInfo.pagePath).replaceAll('/', '-')

    index.packages[codeRouteInfo.package][bundleName] ||= 0

    codeRouteInfo.definitions.forEach(definition => {
        index.packages[codeRouteInfo.package][bundleName]++
        index.modules.push({
            module: definition.name,
            ...baseModule,
        })

        const symbolName = definition.name
        if (!index.symbolIndex[symbolName]) {
            index.symbolIndex[symbolName] = []
        }
        index.symbolIndex[symbolName].push({
            ...baseModule,
            filePath: definition.loc.filePath,
        })
    })
})

createDir(path.dirname(indexFile))
fsSync.writeFileSync(indexFile, JSON.stringify(index, undefined, indent))
console.log(`Written index to: ${indexFile}`)

// fsSync.writeFileSync(path.join(outputDir,'usages.json'), JSON.stringify(Object.fromEntries(fileToDefinitionsMap.entries())))

// 0
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

/**
 * @see {@link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker} for a simplified example on which part of this code was built upon
 */
function extractModuleInfo(
    entrypointFile: ts.SourceFile,
    program: ts.Program,
    defNodes: Map<object, ts.Node>,
    filePathToCodeRouteMap: Map<string, TsDocModuleFileSource>,
): TsDocModuleDefinition[] {
    const checker = program.getTypeChecker()
    const definitions: TsDocModuleDefinition[] = []

    const visitedFiles = new Set<string>()

    function serializeStructuredType(typeNode: ts.Node, sourceFile: ts.SourceFile): any {
        if (!ts.isTypeNode(typeNode) && !ts.isTypeElement(typeNode)) {
            // Not a type node, or something we don't handle as a direct type.
            // It could be an expression used in a type context, like `typeof MyVar`.
            return {
                text: typeNode.getText(sourceFile),
                // text: typeNode.getFullText(sourceFile),
                // text: checker.typeToString(checker.getTypeAtLocation(typeNode), typeNode, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
                kind: ts.SyntaxKind[typeNode.kind],
            }
        }

        const base: {
            text: string
            kind?: string
            filePath?: string
            docPath?: string
        } = {
            text: typeNode.getText(sourceFile),
            // text: typeNode.getFullText(sourceFile),
            kind: ts.SyntaxKind[typeNode.kind],
        }

        // const text = typeNode.getText(sourceFile)
        // // const symbol = checker.getSymbolAtLocation(typeNode)
        // const kind = ts.SyntaxKind[typeNode.kind]

        // let filePath: string | undefined
        let filePath: string | undefined
        let docPath: string | undefined

        // const symbol = checker.getSymbolAtLocation(typeNode)

        const type = ts.isTypeNode(typeNode) ? checker.getTypeFromTypeNode(typeNode) : undefined
        const symbol = type?.aliasSymbol || type?.getSymbol()

        if (symbol?.declarations?.[0]) {
            const declFile = symbol.declarations[0].getSourceFile()
            if (!program.isSourceFileDefaultLibrary(declFile)) {
                const absolutePath = declFile.fileName
                filePath = path.relative(basePathPackages, absolutePath).replaceAll('\\', '/')
                // todo: only add if the symbol is included in docs
                const docInfo = filePathToCodeRouteMap.get(absolutePath)
                if (docInfo) {
                    docPath = docInfo.pagePath
                }
            }
        }
        if (filePath) {
            base.filePath = filePath
        }
        if (docPath) {
            base.docPath = docPath
        }
        // // @ts-ignore
        // base.filePath2 = typeNode.getSourceFile()?.fileName ?
        //     path.relative(basePathPackages, typeNode.getSourceFile().fileName).replaceAll('\\', '/') :
        //     '-1'

        if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
            return {
                ...base,
                types: typeNode.types.map(t => serializeStructuredType(t, sourceFile)),
            }
        }

        if (ts.isParenthesizedTypeNode(typeNode)) {
            return serializeStructuredType(typeNode.type, sourceFile)
        }

        if (ts.isTypeReferenceNode(typeNode)) {
            return {
                ...base,
                name: typeNode.typeName.getText(sourceFile),
                typeArguments: typeNode.typeArguments?.map(t => serializeStructuredType(t, sourceFile)),
            }
        }

        if (ts.isArrayTypeNode(typeNode)) {
            return {
                ...base,
                elementType: serializeStructuredType(typeNode.elementType, sourceFile),
            }
        }

        if (ts.isTupleTypeNode(typeNode)) {
            return {
                ...base,
                elements: typeNode.elements.map(e => serializeStructuredType(e, sourceFile)),
            }
        }

        if (ts.isLiteralTypeNode(typeNode)) {
            let value: any
            const literal = typeNode.literal
            if (ts.isStringLiteral(literal)) {
                value = literal.text
            } else if (ts.isNumericLiteral(literal)) {
                value = parseFloat(literal.text)
            } else if (literal.kind === ts.SyntaxKind.TrueKeyword) {
                value = true
            } else if (literal.kind === ts.SyntaxKind.FalseKeyword) {
                value = false
            } else if (literal.kind === ts.SyntaxKind.NullKeyword) {
                value = null
            } else if (ts.isPrefixUnaryExpression(literal)) {
                // e.g. `const x: -1`
                value = literal.getText(sourceFile)
            }
            return {...base, value}
        }

        if (ts.isTypeOperatorNode(typeNode)) {
            return {
                ...base,
                operator: ts.SyntaxKind[typeNode.operator],
                type: serializeStructuredType(typeNode.type, sourceFile),
            }
        }

        if (ts.isIndexedAccessTypeNode(typeNode)) {
            return {
                ...base,
                objectType: serializeStructuredType(typeNode.objectType, sourceFile),
                indexType: serializeStructuredType(typeNode.indexType, sourceFile),
            }
        }

        if (ts.isExpressionWithTypeArguments(typeNode)) {
            return {
                ...base,
                name: typeNode.expression.getText(sourceFile),
                expression: serializeStructuredType(typeNode.expression, sourceFile),
                typeArguments: typeNode.typeArguments?.map(t => serializeStructuredType(t, sourceFile)),
            }
        }

        if (ts.isConditionalTypeNode(typeNode)) {
            return {
                ...base,
                checkType: serializeStructuredType(typeNode.checkType, sourceFile),
                extendsType: serializeStructuredType(typeNode.extendsType, sourceFile),
                trueType: serializeStructuredType(typeNode.trueType, sourceFile),
                falseType: serializeStructuredType(typeNode.falseType, sourceFile),
            }
        }

        if (ts.isFunctionTypeNode(typeNode) || ts.isConstructorTypeNode(typeNode)) {
            const fnDef: any = {...base}
            fnDef.parameters = typeNode.parameters.map(p => {
                const parameterDef: TsDocModuleDefinitionExtended = {
                    ...extractCommon(p, sourceFile),
                }
                if (p.type) {
                    parameterDef.type = serializeStructuredType(p.type, sourceFile)
                }
                return parameterDef
            })
            if (typeNode.type) {
                fnDef.returnType = serializeStructuredType(typeNode.type, sourceFile)
            }
            return fnDef
        }

        if (ts.isTypeLiteralNode(typeNode)) {
            return {
                ...base,
                members: typeNode.members.map(member => {
                    const memberDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(member, sourceFile),
                    }
                    if ((ts.isPropertySignature(member) || ts.isMethodSignature(member)) && member.type) {
                        memberDef.type = serializeStructuredType(member.type, sourceFile)
                    }
                    // for method signature, also handle parameters
                    if (ts.isMethodSignature(member)) {
                        memberDef.parameters ??= []
                        member.parameters?.forEach(parameter => collectAndCreateParameterDefs(parameter, memberDef, sourceFile))
                    }
                    return memberDef
                }),
            }
        }

        if (ts.isMappedTypeNode(typeNode)) {
            const mappedDef: any = {...base}
            if (typeNode.type) {
                mappedDef.type = serializeStructuredType(typeNode.type, sourceFile)
            }
            return mappedDef
        }

        if (ts.isTemplateLiteralTypeNode(typeNode)) {
            return {
                ...base,
                head: typeNode.head.text,
                templateSpans: typeNode.templateSpans.map(span => {
                    return {
                        type: serializeStructuredType(span.type, sourceFile),
                        literal: span.literal.text,
                    }
                }),
            }
        }

        // Fallback for simple types like `string`, `number`, `any`, keyword types etc.
        delete base.filePath
        delete base.docPath
        return base
    }

    function createReturnDef(
        signature: ts.Signature,
        ownerDef: TsDocModuleDefinitionExtended,
        sourceFile: ts.SourceFile,
        returnTypeNode?: ts.TypeNode,
    ) {
        const returnType = signature.getReturnType()
        const returnTags = signature.getJsDocTags().filter(tag => tag.name === 'returns')
        const comment = returnTags.length > 0 && returnTags[0].text ? ts.displayPartsToString(returnTags[0].text) : ''

        const returnDef: TsDocModuleDefinitionExtended = {
            name: 'return',
            kind: returnTypeNode ? ts.SyntaxKind[returnTypeNode.kind] : 'Inferred',
            loc: returnTypeNode ? {
                filePath: path.relative(basePathPackages, sourceFile.fileName).replaceAll('\\', '/'),
                start: sourceFile.getLineAndCharacterOfPosition(returnTypeNode.getStart(sourceFile, true)),
                end: sourceFile.getLineAndCharacterOfPosition(returnTypeNode.getEnd()),
            } : ownerDef.loc,
            description: comment,
            type:
                returnTypeNode ?
                    serializeStructuredType(returnTypeNode, sourceFile) :
                    {
                        text: checker.typeToString(returnType, returnTypeNode, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
                    },
        }

        ownerDef.returns = [returnDef]
        if (returnTypeNode) {
            defNodes.set(returnDef, returnTypeNode)
        }
    }

    function isNodeExported(node: ts.Node): boolean {
        // For BindingElement, trace up to the VariableDeclaration
        if (ts.isBindingElement(node)) {
            let current: Node = node
            while (current && !ts.isVariableDeclaration(current)) {
                current = current.parent
            }
            if (current && ts.isVariableDeclaration(current)) {
                return isNodeExported(current)
            }
        }

        const symbol = checker.getSymbolAtLocation((node as ts.NamedDeclaration).name || node)
        if (!symbol) {
            // Handle `export default` which may not have a symbol on the expression
            return ts.isExportAssignment(node.parent) || (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Default) !== 0
        }

        const sourceFileSymbol = checker.getSymbolAtLocation(node.getSourceFile())
        if (!sourceFileSymbol) return false

        // Check if the symbol is directly in the module's exports
        const moduleExports = checker.getExportsOfModule(sourceFileSymbol)
        for (const exportedSymbol of moduleExports) {
            if (exportedSymbol === symbol) return true
            // Check for aliased exports: `export { original as aliased }`
            if (exportedSymbol.flags & ts.SymbolFlags.Alias) {
                if (checker.getAliasedSymbol(exportedSymbol) === symbol) {
                    return true
                }
            }
        }

        // Check for export modifiers on the node itself or its direct parent (e.g., VariableStatement)
        const flags = ts.getCombinedModifierFlags(node as ts.Declaration)
        return (flags & ts.ModifierFlags.Export) !== 0 || (flags & ts.ModifierFlags.Default) !== 0
    }

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
                        let generics = ''
                        if (type.typeParameters) {
                            generics = `<${type.typeParameters.map(tp => tp.symbol.name).join(', ')}>`
                        }
                        typeString = `interface ${symbol.name}${generics} {
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

    function serializeSymbol(symbol: ts.Symbol, node: ts.Node): TsDocModuleDefinitionSymbolExtended {
        const typeText = serializeType(symbol, node)
        const symbolType = checker.getTypeOfSymbolAtLocation(symbol, node)

        const typeNode = (node as (ts.HasType & { type?: ts.TypeNode })).type
        const struct =
            typeNode &&
            (ts.isTypeNode(typeNode) || ts.isTypeElement(typeNode))
                ? serializeStructuredType(typeNode, node.getSourceFile()) : null

        const baseTypeInfo: NonNullable<TsDocModuleDefinitionSymbolExtended['type']> = {
            implText: typeText,
            kind: SyntaxKind[symbolType.flags],
            name: symbolType.symbol?.name,
            ...struct || {},
            // todo: this `text` is needed to have e.g. `| undefined` for optional, while `struct.text` is a bit simpler as only using the `TypeNode`,
            //       could it be, that this needs a nested prop already? as `.type` is also for TS not the same as the symbols themselves?
            text: checker.typeToString(symbolType, node, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
            // type: struct,
        }

        // if (symbolType.symbol?.declarations?.[0]) {
        //     const declFile = symbolType.symbol.declarations[0].getSourceFile()
        //     if (!program.isSourceFileDefaultLibrary(declFile)) {
        //         const absolutePath = declFile.fileName
        //         // baseTypeInfo.filePath = path.relative(basePathPackages, absolutePath).replaceAll('\\', '/')
        //         // todo: only add if the symbol is included in docs
        //         const docInfo = filePathToCodeRouteMap.get(absolutePath)
        //         if (docInfo) {
        //             baseTypeInfo.docPath = docInfo.pagePath
        //         }
        //     }
        // }

        return {
            name: symbol.getName(),
            description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
            type: baseTypeInfo,
        }
    }

    function formatTypeString(typeStr: string, depth = 0): string {
        return typeStr
            .replace(/\s+/g, ' ')
            // safe in CLI-only context
            .replace(/\{(.+?)}/g, (match, group) => { // NOSONAR
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
                checker.getSymbolAtLocation((node as ts.NamedDeclaration).name as ts.Node) :
                ts.isConstructorDeclaration(node) ? checker.getSymbolAtLocation(node.parent) : undefined

        if (
            !symbol && !ts.isConstructorDeclaration(node) && !ts.isBindingElement(node)
            && !ts.isTypeReferenceNode(node) && !ts.isTypeLiteralNode(node)
            // && !ts.isLiteralTypeNode(node)
            && ![
                SyntaxKind.StringKeyword,
                SyntaxKind.NumberKeyword,
                SyntaxKind.BooleanKeyword,
                SyntaxKind.VoidKeyword,
                SyntaxKind.UndefinedKeyword,
                SyntaxKind.NullKeyword,
                SyntaxKind.AnyKeyword,
                SyntaxKind.UnknownKeyword,
                SyntaxKind.NeverKeyword,
                SyntaxKind.TrueKeyword,
                SyntaxKind.FalseKeyword,
                SyntaxKind.IndexSignature,
                SyntaxKind.ArrayType,
                SyntaxKind.LiteralType,
                SyntaxKind.ConstructSignature,
                SyntaxKind.CallSignature,
                SyntaxKind.TypeOperator,
            ].includes(node.kind)
        ) {
            const name = (node as ts.NamedDeclaration).name
            const nameText = name && 'getText' in name ? name.getText(node.getSourceFile()) : ''
            console.log(`Missing Symbol ${SyntaxKind[node.kind]} ${nameText} in ${node.getSourceFile().fileName}`)
            // return undefined
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
                flags: Pick<TsDocModuleDefinitionSymbolInfo, 'deprecated' | 'internal' | 'experimental'>
                tags: NonNullable<TsDocModuleDefinitionSymbolInfo['tags']>
            }>((parsed, t) => {
                if (t.tagName.text === 'internal') {
                    parsed.flags.internal = true
                }
                if (t.tagName.text === 'experimental') {
                    parsed.flags.experimental = true
                }
                if (t.kind === SyntaxKind.JSDocDeprecatedTag) {
                    parsed.flags.deprecated = true
                }
                if (
                    t.kind === SyntaxKind.JSDocSeeTag
                    || t.kind === SyntaxKind.JSDocAuthorTag
                    || t.kind === SyntaxKind.JSDocDeprecatedTag
                    || t.tagName.text === 'internal'
                    || t.tagName.text === 'experimental'
                    || t.tagName.text === 'todo'
                    || t.tagName.text === 'remarks'
                    || t.tagName.text === 'example'
                    || t.tagName.text === 'param'
                    || t.tagName.text === 'returns'
                    || t.tagName.text === 'template'
                ) {
                    const tagName = t.tagName.text
                    if (!(tagName in parsed.tags)) {
                        parsed.tags[tagName] = []
                    }
                    const comments = getJSDocComments(t.comment)
                    if (comments) {
                        parsed.tags[tagName].push(comments)
                    }
                }
                return parsed
            }, {flags: {}, tags: {}}) || {}

            const docInfo: TsDocModuleDefinitionSymbolInfo & { isOptional?: boolean } = {
                ...symbol ? serializeSymbol(symbol, node) : {name: 'constructor'},
                ...comment?.length ? {comment: comment} : {},
                ...flags || {},
                tags: tags,
            }

            if (symbol?.flags && symbol?.flags & ts.SymbolFlags.Optional) {
                docInfo.isOptional = true
            }

            return docInfo
        }

        const docInfo: TsDocModuleDefinitionSymbolInfo & { isOptional?: boolean } =
            symbol ? serializeSymbol(symbol, node) : {name: 'constructor'}

        if (symbol?.flags && symbol?.flags & ts.SymbolFlags.Optional) {
            docInfo.isOptional = true
        }

        return docInfo
    }

    function extractCommon(
        node: ts.Node,
        sourceFile: ts.SourceFile,
        {includeParent}: { includeParent?: boolean } = {},
    ): Omit<TsDocModuleDefinitionExtended, 'exported'> {
        const name = ts.isConstructorDeclaration(node) ? 'constructor' : (node as ts.NamedDeclaration).name?.getText(sourceFile)
        const def: TsDocModuleDefinitionExtended = {
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

        // todo: this includes too much, for anything and not just for defaulted e.g. parameters and properties, where useful, not at every `export const`
        //       is better with `isVariableDeclaration`
        if (
            (
                !ts.isVariableDeclaration(node)
                // todo: which else don't make sense?
            )
            && 'initializer' in node && node.initializer && ts.isExpression(node.initializer as any)
        ) {
            // @ts-ignore
            def.defaultValue = node.initializer.getText(sourceFile)
        }

        if ((ts.isParameter(node) || ts.isBindingElement(node)) && node.dotDotDotToken) {
            def.isRest = true
        }

        if (
            (ts.isParameter(node) && (node.questionToken || node.initializer)) ||
            (ts.isBindingElement(node) && node.initializer)
        ) {
            def.isOptional = true
        }

        return def
    }

    function collectAndCreateParameterDefs(
        parameter: ts.ParameterDeclaration | ts.BindingElement,
        parentDef: TsDocModuleDefinitionExtended,
        sourceFile: ts.SourceFile,
    ) {
        if (ts.isParameter(parameter)) {
            if (ts.isIdentifier(parameter.name)) {
                // Simple parameter: function(a)
                const parameterDef = {
                    ...extractCommon(parameter, sourceFile),
                }
                parentDef.parameters ??= []
                parentDef.parameters.push(parameterDef)
                defNodes.set(parameterDef, parameter)
            } else {
                // Destructuring in parameter: function({a, b})
                for (const element of parameter.name.elements) {
                    if (!ts.isOmittedExpression(element)) {
                        collectAndCreateParameterDefs(element, parentDef, sourceFile)
                    }
                }
            }
        } else {
            // BindingElement
            if (ts.isIdentifier(parameter.name)) {
                // Destructured parameter: {a, ...rest}
                const parameterDef = {
                    ...extractCommon(parameter, sourceFile),
                }
                parentDef.parameters ??= []
                parentDef.parameters.push(parameterDef)
                defNodes.set(parameterDef, parameter)
            } else {
                // Nested destructuring: { a: { b, c } }
                for (const element of parameter.name.elements) {
                    if (!ts.isOmittedExpression(element)) {
                        collectAndCreateParameterDefs(element, parentDef, sourceFile)
                    }
                }
            }
        }
    }

    const visitInFile = (sourceFile: ts.SourceFile) => (node: ts.Node) => {
        let nodeDef: TsDocModuleDefinitionExtended | null = null
        if (ts.isClassDeclaration(node)) {
            const classDef: TsDocModuleDefinitionExtended = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
                members: [],
            }
            nodeDef = classDef
            if (node.heritageClauses) {
                for (const clause of node.heritageClauses) {
                    // todo: refac to full TsDocModuleDefinitionSymbolExtended
                    const clauseTypes = clause.types.map(typeNode => ({
                        text: typeNode.getText(sourceFile),
                        name: typeNode.expression.getText(sourceFile),
                    }))

                    if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                        classDef.extends = clauseTypes
                    } else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
                        classDef.implements = clauseTypes
                    }
                }
            }
            node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) || ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
                    classDef.members ??= []
                    const memberDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(member, sourceFile),
                    }
                    if (ts.isFunctionLike(member)) {
                        member.parameters?.forEach(parameter => collectAndCreateParameterDefs(parameter, memberDef, sourceFile))

                        const signature = checker.getSignatureFromDeclaration(member as ts.SignatureDeclaration)
                        if (signature) {
                            createReturnDef(signature, memberDef, sourceFile, member.type)
                        }
                    }
                    classDef.members.push(memberDef)
                    defNodes.set(memberDef, member)
                }
            })
        } else if (ts.isEnumDeclaration(node)) {
            const enumDef: TsDocModuleDefinition & { members?: TsDocModuleDefinition[] } = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            }
            nodeDef = enumDef
            node.members.forEach(member => {
                enumDef.members ??= []
                const memberDef = {
                    ...extractCommon(member, sourceFile),
                }
                enumDef.members.push(memberDef)
                defNodes.set(memberDef, member)
            })
        } else if (
            // ts.isFunctionDeclaration(node)
            ts.isFunctionLike(node)
            // || ts.isJSDocFunctionType(node)
        ) {
            const fnDef: TsDocModuleDefinitionExtended = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            }
            nodeDef = fnDef
            node.parameters?.forEach(parameter => collectAndCreateParameterDefs(parameter, fnDef, sourceFile))

            if (node.typeParameters) {
                fnDef.typeParameters = node.typeParameters.map(tp => {
                    const tpDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(tp, sourceFile),
                    }
                    defNodes.set(tpDef, tp)
                    return tpDef
                })
            }

            const signature = checker.getSignatureFromDeclaration(node as ts.SignatureDeclaration)
            if (signature) {
                createReturnDef(signature, fnDef, sourceFile, node.type)
            }
        } else if (
            ts.isInterfaceDeclaration(node)
            || ts.isMappedTypeNode(node)
            || ts.isTypeLiteralNode(node)
        ) {
            const ifaceLikeDef: TsDocModuleDefinitionExtended = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            }
            nodeDef = ifaceLikeDef

            if (ts.isInterfaceDeclaration(node) && node.heritageClauses) {
                ifaceLikeDef.extends = node.heritageClauses.flatMap(clause => {
                    return clause.types.map(typeNode => {
                        const type = checker.getTypeFromTypeNode(typeNode as ts.TypeNode)
                        const symbol = type.getSymbol() || type.aliasSymbol
                        const typeDef: TsDocModuleDefinitionSymbolExtended = {
                            name: symbol?.name || typeNode.expression.getText(sourceFile),
                            type: serializeStructuredType(typeNode as ts.TypeNode, sourceFile),
                        }
                        defNodes.set(typeDef, typeNode as ts.TypeNode)
                        return typeDef
                    })
                })
            }

            if (
                ts.isInterfaceDeclaration(node)
                && node.typeParameters
            ) {
                ifaceLikeDef.typeParameters = node.typeParameters.map(tp => {
                    const tpDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(tp, sourceFile),
                    }
                    defNodes.set(tpDef, tp)
                    return tpDef
                })
            }

            node.members?.forEach(member => {
                ifaceLikeDef.members ??= []
                const memberDef = {
                    ...extractCommon(member, sourceFile),
                }
                ifaceLikeDef.members.push(memberDef)
                defNodes.set(memberDef, member)
            })
        } else if (ts.isVariableDeclaration(node)) {
            const varDef: TsDocModuleDefinitionExtended = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            }
            nodeDef = varDef

            // console.log(`Visiting ${SyntaxKind[node.kind]}: ${node.name?.getText(sourceFile) || 'anonymous'} in ${sourceFile.fileName}`)

            // const symbol = checker.getSymbolAtLocation(node)
            // if (symbol) {
            //     const type = checker.getTypeOfSymbolAtLocation(symbol, node)
            const symbol = checker.getSymbolAtLocation(node.name)
            if (symbol) {
                const type = checker.getTypeOfSymbolAtLocation(symbol, node)
                const callSignatures = type.getCallSignatures()
                if (callSignatures.length > 0) {
                    const signature = callSignatures[0]

                    if (signature.typeParameters) {
                        varDef.typeParameters = signature.typeParameters.map(tp => {
                            // todo: here `tp` is `TypeParameter`, thus can't use `extractCommon` directly, as `tp` is a `Type` but expected as `Node`
                            // todo: unclear how to correctly get `typeNode` here, this leads to `False expression: Node must have a real position for this operation`
                            //       const typeNode = checker.typeToTypeNode(tp, node, ts.NodeBuilderFlags.NoTruncation | ts.NodeBuilderFlags.NoTypeReduction)
                            const tpDef: TsDocModuleDefinitionExtended = {
                                name: tp.symbol.name,
                                kind: 'TypeParameter',
                                loc: {
                                    filePath: path.relative(basePathPackages, sourceFile.fileName).replaceAll('\\', '/'),
                                    start: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, true)),
                                    end: sourceFile.getLineAndCharacterOfPosition(node.getEnd()),
                                },
                                description: ts.displayPartsToString(tp.symbol.getDocumentationComment(checker)),
                                // structured type
                                // type: typeNode ? serializeStructuredType(typeNode, sourceFile) : undefined,
                                type: {
                                    text: checker.typeToString(tp, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
                                },
                            }

                            defNodes.set(tpDef, node) // Associate with the variable declaration node

                            return tpDef
                        })
                    }

                    signature.parameters.forEach(p => {
                        const pDecl = p.valueDeclaration
                        if (pDecl && ts.isParameter(pDecl)) {
                            collectAndCreateParameterDefs(pDecl, varDef, sourceFile)
                        }
                    })

                    let returnTypeNode: ts.TypeNode | undefined
                    const decl = symbol.valueDeclaration
                    if (decl && ts.isVariableDeclaration(decl) && decl.initializer && ts.isFunctionLike(decl.initializer)) {
                        returnTypeNode = decl.initializer.type
                    }

                    createReturnDef(signature, varDef, sourceFile, returnTypeNode)
                }

                const properties = type.getProperties()
                if (properties.length > 0) {
                    properties.forEach(p => {
                        if (p.valueDeclaration) {
                            const declarationSourceFile = p.valueDeclaration.getSourceFile()
                            if (!program.isSourceFileDefaultLibrary(declarationSourceFile)) {
                                const memberDef = {
                                    ...extractCommon(p.valueDeclaration, sourceFile),
                                    declLoc: {
                                        // todo: this sometimes has the wrong file, of anther package/type totally unrelated to the defined property
                                        filePath: path.relative(basePathPackages, declarationSourceFile.fileName).replaceAll('\\', '/'),
                                        start: declarationSourceFile.getLineAndCharacterOfPosition(p.valueDeclaration.getStart(declarationSourceFile, true)),
                                        end: declarationSourceFile.getLineAndCharacterOfPosition(p.valueDeclaration.getEnd()),
                                    },
                                }
                                varDef.members ??= []
                                varDef.members.push(memberDef)
                                defNodes.set(memberDef, p.valueDeclaration)
                            }
                        }
                    })
                }
            }

            // // handling of members and alike, only defined directly and not inherited
            // if (node.initializer) {
            //     // symbol = checker.getSymbolAtLocation(node.name)
            //     // const initializerType = checker.getSymbolAtLocation(node.initializer)
            //     const symbol = checker.getSymbolAtLocation(node.initializer)// initializerType.getSymbol() || initializerType.aliasSymbol
            //     if (symbol) {
            //         const decl = symbol.declarations?.[0]
            //         if (decl && (ts.isFunctionDeclaration(decl) || ts.isArrowFunction(decl) || ts.isFunctionExpression(decl))) {
            //             varDef.parameters ??= []
            //             decl.parameters.forEach(parameter => collectAndCreateParameterDefs(parameter, varDef, sourceFile))
            //
            //             const signature = checker.getSignatureFromDeclaration(decl)
            //             if (signature) {
            //                 createReturnDef(signature, varDef, sourceFile, decl.type)
            //             }
            //         } else if (ts.isObjectLiteralExpression(node.initializer)) {
            //             varDef.members = node.initializer.properties.map(prop => {
            //                 const memberDef: TsDocModuleDefinitionExtended = {
            //                     ...extractCommon(prop, sourceFile),
            //                 }
            //                 if (ts.isPropertyAssignment(prop) && prop.initializer) {
            //                     const propType = checker.getTypeAtLocation(prop.initializer)
            //                     memberDef.type = {
            //                         text: checker.typeToString(propType, prop.initializer, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
            //                     }
            //                 }
            //                 defNodes.set(memberDef, prop)
            //                 return memberDef
            //             })
            //         }
            //     }
            // }
        } else if (ts.isTypeReferenceNode(node)) {
            // todo: is this needed?
            const typeRefDef: TsDocModuleDefinitionExtended = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            }
            nodeDef = typeRefDef

            if (node.typeArguments) {
                typeRefDef.typeParameters = node.typeArguments.map(tp => {
                    const tpDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(tp, sourceFile),
                    }
                    defNodes.set(tpDef, tp)
                    return tpDef
                })
            }
        } else if (ts.isTypeAliasDeclaration(node)) {
            const aliasDef: TsDocModuleDefinitionExtended = {
                exported: isNodeExported(node),
                ...extractCommon(node, sourceFile),
            }
            nodeDef = aliasDef

            if (node.typeParameters) {
                aliasDef.typeParameters = node.typeParameters.map(tp => {
                    const tpDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(tp, sourceFile),
                    }
                    defNodes.set(tpDef, tp)
                    return tpDef
                })
            }

            const aliasTypeNode = node.type

            if (ts.isTypeLiteralNode(aliasTypeNode)) {
                aliasTypeNode.members.forEach(member => {
                    const memberDef: TsDocModuleDefinitionExtended = {
                        ...extractCommon(member, sourceFile),
                    }

                    if (ts.isMethodSignature(member)) {
                        member.parameters?.forEach(parameter => collectAndCreateParameterDefs(parameter, memberDef, sourceFile))
                        const signature = checker.getSignatureFromDeclaration(member)
                        if (signature) {
                            createReturnDef(signature, memberDef, sourceFile, member.type)
                        }
                    }
                    aliasDef.members ??= []
                    aliasDef.members.push(memberDef)
                    defNodes.set(memberDef, member)
                })
            } else if (ts.isFunctionTypeNode(aliasTypeNode)) {
                aliasTypeNode.parameters.forEach(p => collectAndCreateParameterDefs(p, aliasDef, sourceFile))
                const signature = checker.getSignatureFromDeclaration(aliasTypeNode)
                if (signature) {
                    createReturnDef(signature, aliasDef, sourceFile, aliasTypeNode.type)
                }
            } else if (ts.isUnionTypeNode(aliasTypeNode) || ts.isIntersectionTypeNode(aliasTypeNode)) {
                aliasDef.types = aliasTypeNode.types.map(typeNode => {
                    const type = checker.getTypeFromTypeNode(typeNode)
                    const symbol = type.getSymbol() || type.aliasSymbol

                    const typeDef: TsDocModuleDefinitionExtended = {
                        // kind: ts.SyntaxKind[typeNode.kind],
                        // loc: {
                        //     filePath: path.relative(basePathPackages, sourceFile.fileName).replaceAll('\\', '/'),
                        //     start: sourceFile.getLineAndCharacterOfPosition(typeNode.getStart(sourceFile, true)),
                        //     end: sourceFile.getLineAndCharacterOfPosition(typeNode.getEnd()),
                        // },
                        // type: serializeStructuredType(typeNode, sourceFile),
                        ...extractCommon(typeNode, sourceFile),
                        name: symbol?.name || 'anonymous',
                    }
                    // const typeDef: TsDocModuleDefinitionExtended = {
                    //     name: typeNode.getText(sourceFile),
                    //     kind: ts.SyntaxKind[typeNode.kind],
                    //     loc: {
                    //         filePath: path.relative(basePathPackages, sourceFile.fileName).replaceAll('\\', '/'),
                    //         start: sourceFile.getLineAndCharacterOfPosition(typeNode.getStart(sourceFile, true)),
                    //         end: sourceFile.getLineAndCharacterOfPosition(typeNode.getEnd()),
                    //     },
                    //     type: {
                    //         text: checker.typeToString(type, typeNode, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
                    //     },
                    //     description: symbol ? ts.displayPartsToString(symbol.getDocumentationComment(checker)) : undefined,
                    // }
                    defNodes.set(typeDef, typeNode)
                    return typeDef
                })
            }
        } else if (
            // TRAVERSE: These are container-like nodes that don't have a direct definition
            // but contain children that might. We must traverse them.
            ts.isModuleDeclaration(node) ||         // e.g. `namespace Module { ... }`
            ts.isModuleBlock(node) ||               // The `{ ... }` block in a namespace
            ts.isVariableStatement(node) ||         // e.g. `export const a = 1;` (the statement that contains VariableDeclarationList)
            ts.isVariableDeclarationList(node) ||   // The `a = 1, b = 2` part (contains VariableDeclaration nodes)
            ts.isExportAssignment(node) ||          // e.g. `export default ...`
            ts.isExpressionStatement(node) ||       // A statement that is just an expression. Could be part of a HOC pattern.
            node.kind === SyntaxKind.FirstStatement // A pseudo-node representing the start of a file.
        ) {
            ts.forEachChild(node, visitInFile(sourceFile))
        } else if (ts.isExportDeclaration(node)) {
            // Handles `export * from './module'` and `export { name } from './module'`.
            if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                // This is a re-export from another module.
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
                        // todo: add file to bundle `files`?
                        ts.forEachChild(exportedSourceFile, visitInFile(exportedSourceFile))
                    } else {
                        throw new Error(`SourceFile not available: ${resolvedFileName}`)
                    }
                } else {
                    throw new Error(`Export not resolved: ${moduleName}`)
                }
            } else if (node.exportClause) {
                // This is `export { foo, bar };`. The `isNodeExported` logic on the original
                // `foo` and `bar` declarations will handle this. No action needed here.
            } else {
                // console.log('isExportDeclaration without moduleSpecifier', node.kind, SyntaxKind[node.kind], (node as ts.NamedDeclaration).name?.getText(sourceFile) || 'anonymous', node.getSourceFile().fileName, node.pos, node.moduleSpecifier)
            }
            // } else if (ts.isExportAssignment(node)) {
            //     // `export default ...` is handled by `isNodeExported`, but we still need to traverse the expression
            //     ts.forEachChild(node, visitInFile(sourceFile, isReExportedAsStar))
        } else if (
            ts.isImportDeclaration(node) ||
            ts.isImportClause(node) ||
            ts.isExportSpecifier(node) ||
            node.kind === SyntaxKind.EndOfFileToken ||
            node.kind === SyntaxKind.ExportKeyword ||
            node.kind === SyntaxKind.DefaultKeyword ||
            node.kind === SyntaxKind.ConstKeyword
        ) {
            // noop
        } else {
            const name = (node as ts.NamedDeclaration).name
            const nameText = name && 'getText' in name ? name.getText(sourceFile) : 'anonymous'
            console.log('unknown-node', node.kind, SyntaxKind[node.kind], nameText, node.getSourceFile().fileName, node.pos)
        }

        if (nodeDef) {
            definitions.push(nodeDef)
            defNodes.set(nodeDef, node)
        }
    }

    ts.forEachChild(entrypointFile, visitInFile(entrypointFile))

    // todo: implement referencing, to keep children which are not exported but referenced,
    //       most likely filtering must be moved after scanning all files included in any documentation page
    return definitions.filter(c => c.exported || c.referenced)
}
