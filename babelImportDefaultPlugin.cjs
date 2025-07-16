/**
 * A (dirty) babel plugin to transform imports of CJS to ESM compatible default import.
 *
 * in ESM:
 * import ContainerModule from '@mui/material/Container'
 *
 * out ESM:
 * import ContainerModule from '@mui/material/Container'
 * const Container = ContainerModule.default
 */
module.exports = function({types: t}) {
    return {
        visitor: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ImportDeclaration(path, state) {
                const source = path.node.source.value

                // console.log(`Processing import from: ${source}`)
                // console.log(`Specifiers: ${JSON.stringify(path.node.specifiers, null, 2)}`)

                const isDefaultImport = path.node.specifiers.some(specifier =>
                    t.isImportDefaultSpecifier(specifier),
                )

                if(isDefaultImport) {
                    const originalImportName = path.node.specifiers[0].local.name

                    // Check if the import already has "Module" suffix to prevent infinite loops
                    if(originalImportName.endsWith('Module')) {
                        // console.log(`Skipping transformation for ${originalImportName} to avoid infinite loop.`)
                        return // Stop further transformation
                    }

                    if(isLikelyCommonJS(source, state)) {
                        console.log(`Transforming ${originalImportName} from CommonJS`)

                        path.replaceWithMultiple([
                            t.importDeclaration(
                                [t.importDefaultSpecifier(t.identifier(`${originalImportName}Module`))],
                                t.stringLiteral(source),
                            ),
                            t.variableDeclaration('const', [
                                t.variableDeclarator(
                                    t.identifier(originalImportName),
                                    t.memberExpression(t.identifier(`${originalImportName}Module`), t.identifier('default')),
                                ),
                            ]),
                        ])

                        // console.log(`Created new import: ${originalImportName}Module`)
                    } else {
                        // console.log(`${source} is likely ESM, no transformation applied.`)
                    }
                }
            },
        },
    }

    function isLikelyCommonJS(source, state) {
        // Check if the source is from a package with type: module
        const isModulePackage = state.file.opts.filename.includes('node_modules') && state.file.opts.packageData

        if(isModulePackage && state.file.opts.packageData.type === 'module') {
            return false // It's ESM, so return false
        }

        return (
            !source.endsWith('.mjs') &&
            (
                /node_modules/.test(source)
                || source.startsWith('@mui')
            )
        )
    }
}
