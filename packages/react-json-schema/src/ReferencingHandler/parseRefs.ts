import { List, Map } from 'immutable'
import { getSchemaRefPlugin, resolveRef, SchemaRefPending } from '@ui-schema/react-json-schema/ReferencingHandler'
import { isRootSchema, SchemaRootContext } from '@ui-schema/react-json-schema/SchemaRootProvider'
import { getSchemaId } from '@ui-schema/system/Utils/getSchema'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

/**
 * Pending references, grouped by root id, with requested versions per-schema,
 * `#` for no-custom context `$id`:
 * @example
 * {
 *     '#': {'ref-url': ['*', 'version']},
 *     'http://localhost/schema-1.json': {'schema-1b.json': ['*', '1.2']},
 * }
 */
export type SchemaRefsPending = Map<string, Map<string, List<string>>>

export interface ParseRefsContent {
    // the active root-id
    id?: string
    // the definitions, could be get from ReferencingProvider
    defs?: SchemaRootContext['definitions']
    // the root schema, could be get from SchemaRootProvider
    root?: UISchemaMap
    // try to get a loaded schema
    getLoadedSchema?: getSchemaRefPlugin
}

const handleResolve = (keywords, condition, schema, context, recursive, pending) => {
    Object.keys(keywords).forEach(keyword => {
        // schemaMap can be a `Map` or a `List`
        const schemaMap = schema.get(keyword)
        if (schemaMap && condition(schemaMap)) {
            schema = schema.set(keyword, schemaMap.map((subSchema) => {
                const res = parseRefs(subSchema, context, keywords[keyword] || recursive, pending)
                pending = res.pending
                return res.schema
            }))
        }
    })

    return {schema, pending}
}

// all keywords which nested schemas in maps
const checkNestedMapSchema = {
    properties: false,
}

// all keywords which are an array of schemas
const checkNestedArraySchema = {}

const parseRefsInRenderingKeywords = (schema: UISchemaMap, context: ParseRefsContent, recursive: boolean = false, pending: SchemaRefsPending = Map() as SchemaRefsPending): {
    schema: UISchemaMap
    pending: SchemaRefsPending
} => {
    // for all schema keywords which will be rendered, only the root references must be resolved,
    // but not if they are within an e.g. `if`
    // - e.g. references within `properties` doesn't need to be resolved before they are rendered
    let res = {schema, pending}

    res = handleResolve(
        checkNestedMapSchema, schemaMap => Map.isMap(schemaMap),
        res.schema, context, recursive, res.pending,
    )

    res = handleResolve(
        checkNestedArraySchema, schemaList => List.isList(schemaList),
        res.schema, context, recursive, res.pending,
    )

    return res
}

// conditional keywords who must resolve recursive
const checkConditionalNestedMapSchema = {
    patternProperties: true,
    dependencies: false,
    dependentSchemas: false,
}

// all keywords which are an array of schemas
const checkConditionalNestedArraySchema = {
    allOf: false,
    oneOf: false,
    anyOf: false,
    // here items are tuple-schema arrays
    items: false,
}

const checkSchema = {
    if: true,
    else: false,
    then: false,
    not: false,
    propertyNames: true,
    contains: true,
}

const parseRefsInConditionalKeywords = (schema: UISchemaMap, context: ParseRefsContent, recursive = false, pending: SchemaRefsPending = Map() as SchemaRefsPending): {
    schema: UISchemaMap
    pending: SchemaRefsPending
} => {
    // all schema keywords which are never rendered must be resolved endless-recursive
    // - e.g. `if` is used from within the ConditionalHandler, but it will never be rendered through `WidgetEngine`
    //   thus any `$ref` can not be resolved at render-flow, but must be resolved beforehand
    // for all schema keywords which may-be rendered, only the first level must be resolved, maybe configurable depth
    // - e.g. if `then` should be applied, this schema is merged into the current one, if it is only a reference
    //   and another `then` is applied and also just a reference, the first reference will be overwritten from the second one and is lost.
    //   when resolving the root ref in the `then`s, those schemas are merged into each other

    let res = {schema, pending}

    Object.keys(checkSchema).forEach(keyword => {
        const schemaCond = res.schema.get(keyword)
        if (schemaCond && Map.isMap(schemaCond)) {
            const resCheckSchema = parseRefs(
                // @ts-expect-error too strict typings, make it more defensive?
                schemaCond,
                context,
                checkSchema[keyword] || recursive,
                res.pending,
            )
            res.schema = res.schema.set(keyword, resCheckSchema.schema)
            res.pending = resCheckSchema.pending
        }
    })

    res = handleResolve(
        checkConditionalNestedMapSchema, schemaMap => Map.isMap(schemaMap),
        res.schema, context, true, res.pending,
    )

    res = handleResolve(
        checkConditionalNestedArraySchema, schemaList => List.isList(schemaList),
        res.schema, context, recursive, res.pending,
    )

    // items is either a schema or a list of schemas,
    // here one-schema for all items
    const items = res.schema.get('items')
    if (items && Map.isMap(items)) {
        const itemsSchema = parseRefs(items, context, recursive, res.pending)
        res.schema = res.schema.set('items', itemsSchema.schema)
        res.pending = itemsSchema.pending
    }

    return res
}

export const parseRefs = (
    schema: UISchemaMap,
    context: ParseRefsContent,
    recursive: boolean = false,
    pending: SchemaRefsPending = Map() as SchemaRefsPending,
): {
    schema: UISchemaMap
    pending: SchemaRefsPending
} => {
    const ref = schema.get('$ref')
    const schemaVersion = schema.get('version')
    if (ref) {
        // 1. if schema is a reference itself, resolve it
        //    then with the next code, references in the reference are resolved
        try {
            const resolved = resolveRef(ref, context, schemaVersion)
            // merging resolved ref with current schema, using mergeDeep, but not with `$ref`
            // - for recursion protection and without `version`, to be sure to get the latest `version`
            // todo: json-schema multi-schema validation
            schema = resolved ? resolved.mergeDeep(schema.delete('version').delete('$ref')) : schema
        } catch (e) {
            if (e instanceof SchemaRefPending) {
                const id = context.id || '#'
                pending = pending.updateIn([id, ref], (refPref = List()) => {
                    const v = schema.get('version') || '*'
                    if (!(refPref as List<string>).contains(v)) {
                        refPref = (refPref as List<string>).push(v)
                    }
                    return refPref
                })
            } else {
                throw e
            }
        }
    }

    if (isRootSchema(schema)) {
        // change context if new root schema
        // enforces this before going deeper when nested/recursive
        context = {...context}
        context.id = getSchemaId(schema)
        context.root = schema
        // @ts-expect-error missing type inference
        context.defs = schema.get('definitions') || schema.get('$defs')
    }

    let res: {
        schema: UISchemaMap
        pending: SchemaRefsPending
    } = {schema, pending}

    // 2. handle conditionals
    res = parseRefsInConditionalKeywords(res.schema, context, recursive, res.pending)

    // 3. handle validation/applicator schema
    if (recursive) {
        res = parseRefsInRenderingKeywords(res.schema, context, recursive, res.pending)
    }

    return res
}
