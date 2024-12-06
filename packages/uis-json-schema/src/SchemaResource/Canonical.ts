import { toPointer } from '@ui-schema/json-pointer/toPointer'
import { BranchType } from './SchemaResource.js'
import { LocationPath } from './walkBranch.js'

/**
 * Resolve a relative URL against a base URL.
 */
function resolveUri(base: string, relative: string): string {
    // Remove any trailing slashes from the base URL
    if (base.endsWith('/')) {
        base = base.slice(0, -1)
    }

    // If the relative URL is an absolute URL, return it as-is
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(relative)) {
        return relative
    }

    if (base.startsWith('#')) {
        return relative
    }

    // todo: make sure it works on fragment-uris/query params
    const pathPos = base.indexOf('/', base.indexOf('://') + 3)
    const hashPos = base.indexOf('#', pathPos === -1 ? undefined : pathPos)
    const origin = base.slice(0, pathPos === -1 ? hashPos === -1 ? undefined : hashPos : pathPos)
    const path = base.slice(pathPos === -1 ? origin.length : pathPos, hashPos === -1 ? undefined : hashPos)

    if (relative.startsWith('#')) {
        // todo: what if base already has fragment?
        //       wouldn't it be joined by pointer and not just its $id (for embedded?)
        //       THIS function resolves $ref and not just "building absolute url of any embedded schema"!!
        return `${origin}${path}${relative === '#' ? '' : relative}`
    }

    const relativeParts = (relative.startsWith('/') ? relative.slice(1) : relative).split('/')
    while (relativeParts[0] === '..') {
        relativeParts.shift()
    }

    while (relativeParts[0] === '.') {
        relativeParts.shift()
    }

    // Reconstruct the URL from the combined parts
    const nextPath = relativeParts.join('/')
    return `${origin}${nextPath.startsWith('/') ? nextPath : '/' + nextPath}`
}

/**
 * Gets the baseUri, that is origin (protocol, host, port) and path.
 */
export const getBaseUrl = (url: string) => {
    // todo: do not use URL?
    if (url === '' || url.startsWith('#')) return ''
    try {
        const currentRootUrl = new URL(url)
        return currentRootUrl.origin + currentRootUrl.pathname
    } catch (e) {
        // invalid `url`, e.g. no protocol/hostname, then treating `url` as just a path-hash-get portion
        return (url.startsWith('/') ? '' : '/') +
            url.split('#')[0].split('?')[0]
    }
}

/**
 * If `testUri` is a fragment that is relative to `branchUri`
 */
const areSameBase = (branchUri: string, testUri: string) => {
    const currentRoot = getBaseUrl(branchUri)
    const nextRoot = getBaseUrl(testUri)
    return currentRoot === nextRoot
}

const resolveCanonicalLocation = (
    {
        parent,
        location,
        retrievalUri,
    }: {
        parent?: { canonical?: string }
        retrievalUri?: string
        location: (string | number)[]
    },
) => {
    return (
        parent?.canonical ? resolveUri(parent.canonical, '#' + toPointer(location)) :
            retrievalUri ? resolveUri(retrievalUri, '#' + toPointer(location)) :
                '#' + toPointer(location)
    )
}

/**
 * Returns the anchor portion, from valid and partial uris
 */
const getHashPortion = (testUri: string) => {
    const hashIndex = testUri.indexOf('#')
    if (hashIndex === -1) return null

    const hashPart = testUri.substring(hashIndex + 1)

    return hashPart || ''
}

export const resolveCanonicalId = (
    {
        id,
        parent,
        retrievalUri,
    }: {
        id: string
        parent?: { canonical?: string }
        retrievalUri?: string
    },
) => {
    let canonical: string
    const protoPos = id.indexOf('://')
    if (
        protoPos !== -1 && protoPos < id.indexOf('/')
    ) {
        // absolute URI in $id
        canonical = id
    } else {
        canonical =
            parent?.canonical ? resolveUri(parent.canonical, id) :
                retrievalUri ? resolveUri(retrievalUri, id) : id
    }

    return canonical
}

export function makeCanonical(
    {
        schema,
        ancestorCanonical,
        ancestorLocation = [],
        location,
        retrievalUri,
    }: {
        schema: any
        ancestorCanonical: BranchType['canonical'] | undefined
        ancestorLocation: LocationPath | undefined
        location: LocationPath
        /**
         * @todo should only the first one use it? what for external resources which don't include an $id?
         */
        retrievalUri?: string
    },
) {
    let canonical: string
    let canonicalLocation: string
    let anchor: string | undefined
    if (schema.get('$id')) {
        canonical = resolveCanonicalId({
            id: schema.get('$id'),
            parent: ancestorCanonical,
            retrievalUri: retrievalUri,
        })
        const relId = getHashPortion(canonical)
        if (relId) {
            anchor = relId
        }
        // note: if `$id` and `$anchor`, the spec says the resources canonical
        //       is based on `$anchor` resolved against its `$id`,
        //       no matter if `$id` is in the same or in parent resources
    } else {
        canonicalLocation = resolveCanonicalLocation({
            parent: ancestorCanonical,
            location: [...ancestorLocation, ...location],
            retrievalUri,
        })
        canonical = canonicalLocation
    }

    if (schema.get('$anchor')) {
        if (schema.get('$anchor').startsWith('#')) throw new Error(`Invalid $anchor, must not start with hashtag: ${schema.get('$anchor')}`)
        canonical = resolveCanonicalId({
            id: '#' + schema.get('$anchor'),
            parent: {canonical: canonical},
            retrievalUri: retrievalUri,
        })
        anchor = schema.get('$anchor')
    }

    let isRoot: boolean | undefined

    if (ancestorCanonical?.canonical) {
        if (
            canonical === ancestorCanonical.canonical ||
            !areSameBase(
                getBaseUrl(ancestorCanonical.canonical),
                getBaseUrl(canonical),
            )
        ) {
            isRoot = true
            canonicalLocation = resolveCanonicalLocation({
                parent: {canonical},
                location: [],
                retrievalUri,
            })
        } else {
            canonicalLocation = resolveCanonicalLocation({
                parent: ancestorCanonical,
                location: [...ancestorLocation, ...location],
                retrievalUri,
            })
        }
    } else {
        isRoot = true
        canonicalLocation = resolveCanonicalLocation({
            parent: {canonical},
            location: [],
            retrievalUri,
        })
    }

    return {
        canonical: canonical,
        canonicalLocation: canonicalLocation,
        anchor: anchor,
        isRoot: isRoot,
    }
}
