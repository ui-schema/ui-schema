import { walkPointer } from '@ui-schema/json-pointer/walkPointer'
import { getBaseUrl, makeCanonical } from './Canonical.js'
import { InstanceLocationPathSegment, LocationPath, walkBranch } from './walkBranch.js'

export interface BranchType {
    type?: string
    value?: () => unknown
    ancestor: undefined | (() => BranchType)
    dialect?: string
    location: LocationPath
    instanceLocation: InstanceLocationPathSegment[]
    root: () => BranchType
    canonical?: {
        canonical: string
        canonicalLocation: string
        anchor?: string
        isRoot?: boolean
    }
    children?: Map<string | number, BranchType>
    reference?: () => BranchType
}

export interface SchemaBranchType extends BranchType {
    type: 'schema'
    value: () => any
    canonical: NonNullable<BranchType['canonical']>
}

export interface SchemaResource {
    branch: SchemaBranchType
    schemas: Record<string, SchemaBranchType>
    refs: Record<string, SchemaBranchType[]>
    unresolved?: Record<string, SchemaBranchType[]>
    findRef: (canonicalRef: string) => SchemaBranchType | undefined
}

/**
 * Finds a specific branch within a schema resource tree using a JSON Pointer.
 * This function traverses the `children` property of branches, which are typically
 * `Map` objects, to locate the branch corresponding to the given pointer.
 *
 * @param {string} schemaLocationPointer The JSON Pointer string representing the path to the desired branch.
 * @param {BranchType} branch The starting branch from which to begin the search.
 * @returns {BranchType | undefined} The found branch, or `undefined` if no branch is found at the specified pointer.
 */
export function findBranch(
    schemaLocationPointer: string,
    branch: BranchType,
): BranchType | undefined {
    return walkPointer(
        schemaLocationPointer, branch,
        (branch, key) => {
            const b = branch as BranchType
            if (typeof b !== 'object' || !b?.children) {
                return undefined
            }
            return b.children.get(key)
        },
    )
}

/**
 * Creates a `SchemaResource` object from a given schema, recursively walking its branches
 * to identify and canonicalize nested schemas, references (`$ref`), and definitions (`$defs`).
 * This function builds a comprehensive representation of the schema, including all its
 * sub-schemas, their canonical IDs, and any unresolved references.
 *
 * The `SchemaResource` is crucial for efficient schema processing, allowing for quick
 * lookup of schemas by their canonical IDs and resolution of `$ref` pointers,
 * even after hoisting and merging of schemas.
 *
 * @param {any} schema The Immutable.js Map representing the root schema.
 * @param {object} [context={}] An object containing contextual information for resource creation.
 * @param {string} [context.dialect] The JSON Schema dialect to assume if not specified in the schema's `$schema` keyword.
 * @param {string} [context.retrievalUri] The base URI for resolving relative references within the schema.
 * @param {Record<string, SchemaResource>} [context.resources] A collection of already processed external schema resources, used for resolving cross-resource references.
 * @returns {SchemaResource} A `SchemaResource` object containing the processed schema branches, resolved references, and any unresolved references.
 */
export function resourceFromSchema(
    schema: any,
    context: {
        dialect?: string
        retrievalUri?: string
        resources?: Record<string, SchemaResource>
    } = {},
): SchemaResource {
    const refs: Record<string, any> = {}
    const rootSchema = schema

    const schemaBranch: any = {
        type: 'schema',
        value: () => rootSchema,
        ancestor: undefined,
        dialect: rootSchema.get('$schema') || context?.dialect,
        location: [],
        instanceLocation: [],
        root: () => schemaBranch,
        canonical: makeCanonical({
            schema: rootSchema,
            location: [],
            ancestorCanonical: undefined,
            ancestorLocation: undefined,
            retrievalUri: context?.retrievalUri,
        }),
    }

    const getSchema = (canonical: string): SchemaBranchType | undefined => {
        if (canonical in resource.schemas) {
            return resource.schemas[canonical]
        } else if (context.resources && canonical in context.resources) {
            // todo: return resource to use its `findRef`?
            return context.resources[canonical]?.branch
        }
        return undefined
    }

    const resource: SchemaResource = {
        branch: schemaBranch,
        schemas: {},
        refs: {},
        findRef: (canonicalRef: string) => {
            let refBranch: SchemaBranchType | undefined = getSchema(canonicalRef)
            if (!refBranch) {
                const baseUrl = getBaseUrl(canonicalRef) || '#'
                const baseBranch = getSchema(baseUrl)
                if (baseBranch) {
                    const refPointer = canonicalRef.split('#')?.[1]?.split('?')[0] || ''
                    refBranch = findBranch(refPointer, baseBranch) as SchemaBranchType | undefined
                }
            }
            return refBranch
        },
    }

    const open: SchemaBranchType[] = [
        schemaBranch,
    ]

    while (open.length) {
        const currentBranch = open.pop()!

        walkBranch(
            currentBranch,
            {
                ...context,
                dialect: currentBranch.dialect,
            },
            {
                onSchema: (locBranch) => {
                    open.push(locBranch)
                },
                onRef: (canonicalRef) => {
                    // note: for the current "schema based" rendering, the $ref needs to be canonicalized in all schemas,
                    //       not only in the branch it was found, also in its ancestors schemas,
                    //       and that means all schemas in all ancestors must be updated with the canonicalRef
                    const reverseKeys = currentBranch.location.slice().reverse()
                    const keys: typeof reverseKeys = []
                    let selfBranch: BranchType | SchemaBranchType | undefined = currentBranch.ancestor?.()
                    for (const key of reverseKeys) {
                        keys.push(key)
                        if (selfBranch?.type === 'schema') {
                            // @ts-expect-error
                            const ancestorSchema = selfBranch.value?.()?.setIn([...keys.slice().reverse(), '$ref'], canonicalRef)
                            if (ancestorSchema) {
                                selfBranch.value = () => ancestorSchema
                            }
                        }
                        selfBranch = selfBranch?.ancestor?.()
                    }
                    refs[canonicalRef] ||= []
                    refs[canonicalRef].push(currentBranch)
                },
            },
        )

        if (resource.schemas[currentBranch.canonical.canonical]) {
            throw new Error(`Duplicate schema resource with canonical: ${currentBranch.canonical.canonical}
found in: ${currentBranch.canonical.canonicalLocation}
already found in: ${resource.schemas[currentBranch.canonical.canonical].canonical.canonicalLocation}`)
        }

        resource.schemas[currentBranch.canonical.canonical] = currentBranch
    }

    // for (const [canonical, schema] of Object.entries(resource.schemas)) {
    //     console.log('reg-schema', canonical, schema.value?.().toJS())
    // }

    for (const canonicalRef in refs) {
        const refBranch: BranchType | undefined = resource.findRef(canonicalRef)
        if (refBranch) {
            resource.refs[canonicalRef] ||= []
            refs[canonicalRef].forEach((dependentBranch: typeof resource.branch) => {
                dependentBranch.reference = () => refBranch!
                resource.refs[canonicalRef].push(dependentBranch)
                // todo: check circular loops by walking back the existing `ancestor?.()` + `ancestor?.().reference?.()` and check against each ancestor
            })
        } else {
            resource.unresolved ||= {}
            resource.unresolved[canonicalRef] = refs[canonicalRef]
        }
    }

    return resource
}
