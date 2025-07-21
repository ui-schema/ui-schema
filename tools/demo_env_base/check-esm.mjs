import {createMap} from '@ui-schema/ui-schema/createMap'

if (typeof createMap === 'function') {
    console.log('✅ -esm.mjs resolved createMap as function')
} else {
    throw new Error(`-esm.mjs resolved wrong symbol: ${typeof createMap}`)
}

/**
 * @type {[import: string, path: string][]}
 */
const expected = [
    ['@ui-schema/ui-schema/createMap', '@ui-schema/ui-schema/esm/createMap/index.js'],
    ['@ui-schema/react/Translate', '@ui-schema/react/esm/Translate/index.js'],
    ['@ui-schema/json-pointer', '@ui-schema/json-pointer/esm/index.js'],
    ['@ui-schema/ds-material/Widgets/TextField', '@ui-schema/ds-material/esm/Widgets/TextField/index.js'],
]

for (const [specifier, expectedPath] of expected) {
    const resolved = import.meta.resolve(specifier).replaceAll('\\', '/')
    if (!resolved.endsWith('/node_modules/' + expectedPath)) {
        throw new Error(`-esm.mjs resolved to unexpected file for ${specifier}: ${resolved}`)
    } else {
        console.log(`✅ -esm.mjs resolved ${specifier} to expected file: ${resolved}`)
    }
}
