// eslint-disable-next-line @typescript-eslint/no-require-imports
const {createMap} = require('@ui-schema/ui-schema/createMap')

if (typeof createMap === 'function') {
    console.log('✅ -cjs.cjs resolved createMap as function')
} else {
    throw new Error(`-cjs.cjs resolved wrong symbol: ${typeof createMap}`)
}

/**
 * @type {[import: string, path: string][]}
 */
const expected = [
    ['@ui-schema/ui-schema/createMap', '@ui-schema/ui-schema/createMap/index.cjs'],
    ['@ui-schema/react/Translate', '@ui-schema/react/Translate/index.cjs'],
    ['@ui-schema/json-pointer', '@ui-schema/json-pointer/index.cjs'],
    ['@ui-schema/ds-material/Widgets/TextField', '@ui-schema/ds-material/Widgets/TextField/index.cjs'],
]

for (const [specifier, expectedPath] of expected) {
    const resolved = require.resolve(specifier).replaceAll('\\', '/')
    if (!resolved.endsWith('/node_modules/' + expectedPath)) {
        throw new Error(`-cjs.cjs resolved to unexpected file for ${specifier}: ${resolved}`)
    } else {
        console.log(`✅ -cjs.cjs resolved ${specifier} to expected file: ${resolved}`)
    }
}
