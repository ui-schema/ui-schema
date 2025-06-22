import { walkPointer } from '@ui-schema/json-pointer/walkPointer'
import { getBaseUrl, makeCanonical } from './Canonical.js'
import { InstanceLocationPathSegment, LocationPath, walkBranch } from './walkBranch.js'

export interface BranchType {
    type?: string
    value?: () => unknown
    ancestor: undefined | (() => BranchType)
    // todo: move $schema handling into walkSchema
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

export const findBranch = (
    schemaLocationPointer: string,
    branch: BranchType,
) => {
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
                    refBranch = findBranch(refPointer, baseBranch)
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
