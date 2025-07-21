import { List, Map as ImmutableMap } from 'immutable'
import { makeCanonical, resolveCanonicalId } from './Canonical.js'
import { BranchType, SchemaBranchType } from './SchemaResource.js'

export type LocationPath = (string | number)[]

export type InstanceLocationPathSegment =
    { type: 'patternProperty', key: string } |
    // { type: 'patternProperty', key: RegExp } |
    { type: 'property', key: string } |
    { type: 'prefixItem', key: number } |
    { type: 'item' }

const makeBranch = (
    ancestor: BranchType,
    nestedLocKey: string | number,
    nestedInstanceLocation: InstanceLocationPathSegment[],
): BranchType => {
    return {
        ancestor: () => ancestor,
        dialect: ancestor.dialect,
        location: [...ancestor.location, nestedLocKey],
        instanceLocation: [...ancestor.instanceLocation, ...nestedInstanceLocation],
        root: ancestor.root,
    }
}

const addBranch = (
    ancestor: BranchType,
    nestedKey: string | number,
    instanceLocation: InstanceLocationPathSegment[],
) => {
    const childBranch = makeBranch(ancestor, nestedKey, instanceLocation)
    ancestor.children ||= new Map()
    ancestor.children.set(nestedKey, childBranch)
    return childBranch
}

const addSchemaBranch = (
    ancestor: BranchType,
    ancestorCanonical: any,
    nestedKey: string | number,
    instanceLocation: InstanceLocationPathSegment[],
    schema,
    context?: { retrievalUri?: string },
): SchemaBranchType => {
    const childBranch = makeBranch(ancestor, nestedKey, instanceLocation)
    childBranch.type = 'schema'
    childBranch.value = () => schema
    childBranch.canonical = makeCanonical({
        schema: schema,
        location: [nestedKey],
        ancestorLocation: ancestor.location,
        ancestorCanonical: ancestorCanonical,
        retrievalUri: context?.retrievalUri,
    })
    if (childBranch.canonical.isRoot) {
        childBranch.location = []
    }
    ancestor.children!.set(nestedKey, childBranch)
    return childBranch as SchemaBranchType
}

export function walkBranch(
    branch: any,
    context: {
        dialect?: string
        retrievalUri?: string
        resources?: any
    },
    {
        onSchema,
        onRef,
    }: {
        onSchema: (branch: SchemaBranchType) => void
        onRef: (canonicalRef: string) => void
    },
) {
    const schema: ImmutableMap<any, any> = branch.value()
    // walk embedded resources
    if (schema.get('$defs')) {
        const collectionBranch = addBranch(branch, '$defs', [])
        collectionBranch.children ||= new Map()
        for (const [nestedKey, nestedSchema] of schema.get('$defs')) {
            const childBranch = addSchemaBranch(
                collectionBranch,
                branch.canonical,
                nestedKey,
                [],
                nestedSchema,
                context,
            )
            onSchema(childBranch)
        }
    }
    if (schema.get('definitions')) {
        const collectionBranch = addBranch(branch, 'definitions', [])
        collectionBranch.children ||= new Map()
        for (const [nestedKey, nestedSchema] of schema.get('definitions')) {
            const childBranch = addSchemaBranch(
                collectionBranch,
                branch.canonical,
                nestedKey,
                [],
                nestedSchema,
                context,
            )
            onSchema(childBranch)
        }
    }

    if (schema.get('$ref')) {
        const canonicalRef = resolveCanonicalId({
            id: schema.get('$ref'),
            parent: branch.canonical,
            retrievalUri: context?.retrievalUri,
        })
        onRef(canonicalRef)
        // todo: optimize handling keywords which are schema-changing,
        //       here canonicalizing the $ref for future lookup of branches and their schema
        branch.value = () => schema.set('$ref', canonicalRef)
    }

    // walk nested value schemas
    if (schema.get('properties')) {
        const collectionBranch = addBranch(branch, 'properties', [])
        collectionBranch.children ||= new Map()
        for (const [nestedKey, nestedSchema] of schema.get('properties')) {
            const childBranch = addSchemaBranch(
                collectionBranch,
                branch.canonical,
                nestedKey,
                [{type: 'property', key: nestedKey}],
                nestedSchema,
                context,
            )
            onSchema(childBranch)
        }
    }

    if (schema.get('patternProperties')) {
        const collectionBranch = addBranch(branch, 'patternProperties', [])
        collectionBranch.children ||= new Map()
        for (const [nestedKey, nestedSchema] of schema.get('patternProperties')) {
            const childBranch = addSchemaBranch(
                collectionBranch,
                branch.canonical,
                nestedKey,
                [{type: 'patternProperty', key: nestedKey}],
                nestedSchema,
                context,
            )
            onSchema(childBranch)
        }
    }

    if (schema.get('items')) {
        if (List.isList(schema.get('items'))) {
            const collectionBranch = addBranch(branch, 'items', [])
            collectionBranch.children ||= new Map()
            for (const [nestedKey, nestedSchema] of schema.get('items').entries()) {
                const childBranch = addSchemaBranch(
                    collectionBranch,
                    branch.canonical,
                    nestedKey,
                    [{type: 'prefixItem', key: nestedKey}],
                    nestedSchema,
                    context,
                )
                onSchema(childBranch)
            }
        } else {
            branch.children ||= new Map()
            const childBranch = addSchemaBranch(
                branch,
                branch.canonical,
                'items',
                [{type: 'item'}],
                schema.get('items'),
                context,
            )
            onSchema(childBranch)
        }
    }

    if (schema.get('prefixItems')) {
        const collectionBranch = addBranch(branch, 'prefixItems', [])
        collectionBranch.children ||= new Map()
        for (const [nestedKey, nestedSchema] of schema.get('prefixItems').entries()) {
            const childBranch = addSchemaBranch(
                collectionBranch,
                branch.canonical,
                nestedKey,
                [{type: 'prefixItem', key: nestedKey}],
                nestedSchema,
                context,
            )
            onSchema(childBranch)
        }
    }

    const compositionKeywords = ['oneOf', 'anyOf', 'allOf']
    compositionKeywords.forEach(keyword => {
        if (schema.get(keyword)) {
            const collectionBranch = addBranch(branch, keyword, [])
            collectionBranch.children ||= new Map()
            for (const [nestedKey, nestedSchema] of schema.get(keyword).entries()) {
                const childBranch = addSchemaBranch(
                    collectionBranch,
                    branch.canonical,
                    nestedKey,
                    [],
                    nestedSchema,
                    context,
                )
                onSchema(childBranch)
            }
        }
    })

    const nestedSchemaKeyword = [
        'if', 'then', 'else',
        'not',
        'propertyNames',
        'additionalProperties',
        'additionalItems',
    ]
    nestedSchemaKeyword.forEach(keyword => {
        const keywordSchema = schema.get(keyword)
        // todo: some keywords could be `boolean`, which shouldn't be indexed as schema, but still be in tree
        if (keywordSchema && typeof keywordSchema === 'object') {
            branch.children ||= new Map()
            const childBranch = addSchemaBranch(
                branch,
                branch.canonical,
                keyword,
                [],
                keywordSchema,
                context,
            )
            onSchema(childBranch)
        }
    })

    // ... check how to handle $dynamicAnchor/$dynamicRef/$recursiveAnchor/$recursiveRef

    return branch
}
