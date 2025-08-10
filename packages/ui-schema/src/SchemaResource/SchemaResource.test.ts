import { expect, describe, test } from '@jest/globals'
import { createOrdered } from '@ui-schema/ui-schema/createMap'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { resourceFromSchema, SchemaBranchType } from './SchemaResource.js'

/**
 * npm run tdd -- --testPathPattern=SchemaResource --selectProjects=test-@ui-schema/ui-schema
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mocksFolder = path.join(__dirname, '../../', '../json-schema', 'tests/mocks')

const readSchema = (filename: string) => {
    return fs.readFile(path.join(mocksFolder, filename)).then(b => JSON.parse(b.toString()))
}

const mapToStrings = (map: Record<string, SchemaBranchType[]>) => {
    return Object.keys(map).reduce((mapped, canonical) => {
        mapped[canonical] = map[canonical].map(b => b.canonical.canonical)
        return mapped
    }, {})
}

describe('SchemaResource', () => {
    interface TestCase {
        file: string
        name?: string
        patchSchema?: (schema: any) => any
        expectedSchemas?: string[]
        expectedRefs?: Record<string, string[]>
        expectedUnresolved?: Record<string, string[]>
        expectedCanonical?: Record<string, Partial<SchemaBranchType['canonical']>>
    }

    test.each<TestCase>([
        {
            file: 'simple-object',
            expectedSchemas: [
                '#',
                '#/properties/tags',
                '#/properties/tags/items',
                '#/properties/description',
                '#/properties/price',
                '#/properties/name',
            ],
        },
        {
            file: 'simple-array-of-objects',
            expectedSchemas: [
                '#',
                '#/items',
                '#/items/properties/tags',
                '#/items/properties/tags/items',
                '#/items/properties/description',
                '#/items/properties/price',
                '#/items/properties/name',
            ],
        },
        {
            file: 'simple-array-tuple',
            expectedSchemas: [
                '#',
                '#/prefixItems/2',
                '#/prefixItems/2/items',
                '#/prefixItems/1',
                '#/prefixItems/0',
            ],
        },
        {
            file: 'simple-array-tuple-items',
            expectedSchemas: [
                '#',
                '#/items/2',
                '#/items/2/items',
                '#/items/1',
                '#/items/0',
            ],
        },
        {
            file: 'defs-nested-anchors',
            expectedSchemas: [
                'https://example.org/schemas/example-defs-nested-anchors.json',
                'https://example.org/schemas/example-defs-nested-anchors.json#/properties/order',
                'https://example.org/schemas/example-defs-nested-anchors.json#/properties/order/properties/shipping_address',
                'https://example.org/schemas/example-defs-nested-anchors.json#/properties/order/properties/billing_address',
                'https://example.org/schemas/example-defs-nested-anchors.json#/properties/customer',
                'https://example.org/schemas/example-defs-nested-anchors.json#customer',
                'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/customer/properties/email',
                'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/customer/properties/address',
                'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/customer/properties/name',
                'https://example.org/schemas/example-defs-nested-anchors.json#email',
                'https://example.org/schemas/example-defs-nested-anchors.json#address',
                'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/address/properties/city',
                'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/address/properties/street',
            ],
            expectedRefs: {
                'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/address': [
                    'https://example.org/schemas/example-defs-nested-anchors.json#/properties/order/properties/billing_address',
                ],
                'https://example.org/schemas/example-defs-nested-anchors.json#address': [
                    'https://example.org/schemas/example-defs-nested-anchors.json#/properties/order/properties/shipping_address',
                    'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/customer/properties/address',
                ],
                'https://example.org/schemas/example-defs-nested-anchors.json#customer': [
                    'https://example.org/schemas/example-defs-nested-anchors.json#/properties/customer',
                ],
                'https://example.org/schemas/example-defs-nested-anchors.json#email': [
                    'https://example.org/schemas/example-defs-nested-anchors.json#/$defs/customer/properties/email',
                ],
            },
        },
        {
            file: 'defs-nested-anchors',
            name: 'no-root-id',
            expectedSchemas: [
                '#',
                '#/properties/order',
                '#/properties/order/properties/shipping_address',
                '#/properties/order/properties/billing_address',
                '#/properties/customer',
                '#customer',
                '#/$defs/customer/properties/email',
                '#/$defs/customer/properties/address',
                '#/$defs/customer/properties/name',
                '#email',
                '#address',
                '#/$defs/address/properties/city',
                '#/$defs/address/properties/street',
            ],
            expectedRefs: {
                '#/$defs/address': [
                    '#/properties/order/properties/billing_address',
                ],
                '#address': [
                    '#/properties/order/properties/shipping_address',
                    '#/$defs/customer/properties/address',
                ],
                '#customer': [
                    '#/properties/customer',
                ],
                '#email': [
                    '#/$defs/customer/properties/email',
                ],
            },
            patchSchema: schema => schema.delete('$id'),
            expectedCanonical: {
                '#': {
                    canonical: '#',
                    canonicalLocation: '#',
                },
                '#/properties/order': {
                    canonical: '#/properties/order',
                    canonicalLocation: '#/properties/order',
                },
                '#/properties/order/properties/shipping_address': {
                    canonical: '#/properties/order/properties/shipping_address',
                    canonicalLocation: '#/properties/order/properties/shipping_address',
                },
                '#/properties/order/properties/billing_address': {
                    canonical: '#/properties/order/properties/billing_address',
                    canonicalLocation: '#/properties/order/properties/billing_address',
                },
                '#/properties/customer': {
                    canonical: '#/properties/customer',
                    canonicalLocation: '#/properties/customer',
                },
                '#customer': {
                    canonical: '#customer',
                    canonicalLocation: '#/$defs/customer',
                },
                '#/$defs/customer/properties/email': {
                    canonical: '#/$defs/customer/properties/email',
                    canonicalLocation: '#/$defs/customer/properties/email',
                },
                '#/$defs/customer/properties/address': {
                    canonical: '#/$defs/customer/properties/address',
                    canonicalLocation: '#/$defs/customer/properties/address',
                },
                '#/$defs/customer/properties/name': {
                    canonical: '#/$defs/customer/properties/name',
                    canonicalLocation: '#/$defs/customer/properties/name',
                },
                '#email': {
                    canonical: '#email',
                    canonicalLocation: '#/$defs/customer/$defs/email',
                },
                '#address': {
                    canonical: '#address',
                    canonicalLocation: '#/$defs/address',
                },
                '#/$defs/address/properties/city': {
                    canonical: '#/$defs/address/properties/city',
                    canonicalLocation: '#/$defs/address/properties/city',
                },
                '#/$defs/address/properties/street': {
                    canonical: '#/$defs/address/properties/street',
                    canonicalLocation: '#/$defs/address/properties/street',
                },
            },
        },
        {
            file: 'defs-ids-nested',
            expectedSchemas: [
                'https://example.org/course-management-schema',
                'https://example.org/course-management-schema#/properties/content',
                'https://example.org/course-management-schema#/properties/lesson',
                'https://example.org/course-management-schema#/properties/module',
                'https://example.org/course-management-schema#/properties/course',
                'https://example.org/course-management-schema#option',
                'https://example.org/course-management-schema#/$defs/option/properties/text',
                'https://example.org/course-management-schema#/$defs/option/properties/optionId',
                'https://example.org/course-management-schema#question',
                'https://example.org/course-management-schema#/$defs/question/properties/correctOptionId',
                'https://example.org/course-management-schema#/$defs/question/properties/options',
                'https://example.org/course-management-schema#/$defs/question/properties/options/items',
                'https://example.org/course-management-schema#/$defs/question/properties/text',
                'https://example.org/course-management-schema#/$defs/question/properties/questionId',
                'https://example.org/course-management-schema#quizContent',
                'https://example.org/course-management-schema#/$defs/quizContent/properties/questions',
                'https://example.org/course-management-schema#/$defs/quizContent/properties/questions/items',
                'https://example.org/course-management-schema#/$defs/quizContent/properties/type',
                'https://example.org/course-management-schema#videoContent',
                'https://example.org/course-management-schema#/$defs/videoContent/properties/duration',
                'https://example.org/course-management-schema#/$defs/videoContent/properties/url',
                'https://example.org/course-management-schema#/$defs/videoContent/properties/type',
                'https://example.org/course-management-schema#textContent',
                'https://example.org/course-management-schema#/$defs/textContent/properties/body',
                'https://example.org/course-management-schema#/$defs/textContent/properties/type',
                'https://example.org/course-management-schema#content',
                'https://example.org/course-management-schema#/$defs/content/oneOf/2',
                'https://example.org/course-management-schema#/$defs/content/oneOf/1',
                'https://example.org/course-management-schema#/$defs/content/oneOf/0',
                'https://example.org/course-management-schema#lesson',
                'https://example.org/course-management-schema#/$defs/lesson/properties/content',
                'https://example.org/course-management-schema#/$defs/lesson/properties/title',
                'https://example.org/course-management-schema#/$defs/lesson/properties/lessonId',
                'https://example.org/course-management-schema#module',
                'https://example.org/course-management-schema#/$defs/module/properties/lessons',
                'https://example.org/course-management-schema#/$defs/module/properties/lessons/items',
                'https://example.org/course-management-schema#/$defs/module/properties/title',
                'https://example.org/course-management-schema#/$defs/module/properties/moduleId',
                'https://example.org/course-management-schema#course',
                'https://example.org/course-management-schema#/$defs/course/properties/modules',
                'https://example.org/course-management-schema#/$defs/course/properties/modules/items',
                'https://example.org/course-management-schema#/$defs/course/properties/description',
                'https://example.org/course-management-schema#/$defs/course/properties/title',
                'https://example.org/course-management-schema#/$defs/course/properties/courseId',
            ],
            expectedRefs: {
                'https://example.org/course-management-schema#content': [
                    'https://example.org/course-management-schema#/properties/content',
                    'https://example.org/course-management-schema#/$defs/lesson/properties/content',
                ],
                'https://example.org/course-management-schema#lesson': [
                    'https://example.org/course-management-schema#/properties/lesson',
                    'https://example.org/course-management-schema#/$defs/module/properties/lessons/items',
                ],
                'https://example.org/course-management-schema#module': [
                    'https://example.org/course-management-schema#/properties/module',
                    'https://example.org/course-management-schema#/$defs/course/properties/modules/items',
                ],
                'https://example.org/course-management-schema#course': [
                    'https://example.org/course-management-schema#/properties/course',
                ],
                'https://example.org/course-management-schema#option': [
                    'https://example.org/course-management-schema#/$defs/question/properties/options/items',
                ],
                'https://example.org/course-management-schema#question': [
                    'https://example.org/course-management-schema#/$defs/quizContent/properties/questions/items',
                ],
                'https://example.org/course-management-schema#quizContent': [
                    'https://example.org/course-management-schema#/$defs/content/oneOf/2',
                ],
                'https://example.org/course-management-schema#textContent': [
                    'https://example.org/course-management-schema#/$defs/content/oneOf/0',
                ],
                'https://example.org/course-management-schema#videoContent': [
                    'https://example.org/course-management-schema#/$defs/content/oneOf/1',
                ],
            },
        },
        {
            file: 'ids-remote-main',
            expectedSchemas: [
                'https://example.org/schemas/main-schema.json',
                'https://example.org/schemas/main-schema.json#/properties/shippingAddress',
                'https://example.org/schemas/main-schema.json#/properties/userProfile',
                'https://example.org/schemas/main-schema.json#/properties/userInfo',
            ],
            expectedRefs: {},
            expectedUnresolved: {
                'https://example.org/schemas/include-schema.json#/properties/profile': [
                    'https://example.org/schemas/main-schema.json#/properties/userProfile',
                ],
                'https://example.org/schemas/include-schema.json#/properties/user': [
                    'https://example.org/schemas/main-schema.json#/properties/userInfo',
                ],
                'https://example.org/schemas/include-schema.json#address': [
                    'https://example.org/schemas/main-schema.json#/properties/shippingAddress',
                ],
            },
        },
        {
            file: 'ids-embedded-pointer',
            expectedSchemas: [
                'https://example.org/main-schema',
                'https://example.org/account-schema',
                'https://example.org/account-schema#address-schema',
                'https://example.org/account-schema#/properties/address/properties/country',
                'https://example.org/account-schema#/properties/address/properties/city',
                'https://example.org/account-schema#/properties/address/properties/street',
                'https://example.org/account-schema#/properties/accountNumber',
                'https://example.org/account-schema#/$defs/country',
                'https://example.org/main-schema#user',
                'https://example.org/main-schema#profile-schema',
                'https://example.org/main-schema#/properties/user/properties/profile/properties/address',
                'https://example.org/main-schema#/properties/user/properties/profile/properties/email',
                'https://example.org/main-schema#/properties/user/properties/name',
            ],
            expectedRefs: {
                'https://example.org/account-schema#/$defs/country': [
                    'https://example.org/account-schema#/properties/address/properties/country',
                ],
                'https://example.org/main-schema#/properties/account/properties/address': [
                    'https://example.org/main-schema#/properties/user/properties/profile/properties/address',
                ],
            },
            expectedCanonical: {
                'https://example.org/main-schema': {
                    canonical: 'https://example.org/main-schema',
                    canonicalLocation: 'https://example.org/main-schema',
                },
                'https://example.org/account-schema': {
                    canonical: 'https://example.org/account-schema',
                    canonicalLocation: 'https://example.org/account-schema',
                },
                'https://example.org/account-schema#address-schema': {
                    canonical: 'https://example.org/account-schema#address-schema',
                    canonicalLocation: 'https://example.org/account-schema#/properties/address',
                },
                'https://example.org/account-schema#/properties/address/properties/country': {
                    canonical: 'https://example.org/account-schema#/properties/address/properties/country',
                    canonicalLocation: 'https://example.org/account-schema#/properties/address/properties/country',
                },
                'https://example.org/account-schema#/properties/address/properties/city': {
                    canonical: 'https://example.org/account-schema#/properties/address/properties/city',
                    canonicalLocation: 'https://example.org/account-schema#/properties/address/properties/city',
                },
                'https://example.org/account-schema#/properties/address/properties/street': {
                    canonical: 'https://example.org/account-schema#/properties/address/properties/street',
                    canonicalLocation: 'https://example.org/account-schema#/properties/address/properties/street',
                },
                'https://example.org/account-schema#/properties/accountNumber': {
                    canonical: 'https://example.org/account-schema#/properties/accountNumber',
                    canonicalLocation: 'https://example.org/account-schema#/properties/accountNumber',
                },
                'https://example.org/account-schema#/$defs/country': {
                    canonical: 'https://example.org/account-schema#/$defs/country',
                    canonicalLocation: 'https://example.org/account-schema#/$defs/country',
                },
                'https://example.org/main-schema#user': {
                    canonical: 'https://example.org/main-schema#user',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user',
                },
                'https://example.org/main-schema#profile-schema': {
                    canonical: 'https://example.org/main-schema#profile-schema',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user/properties/profile',
                },
                'https://example.org/main-schema#/properties/user/properties/profile/properties/address': {
                    canonical: 'https://example.org/main-schema#/properties/user/properties/profile/properties/address',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user/properties/profile/properties/address',
                },
                'https://example.org/main-schema#/properties/user/properties/profile/properties/email': {
                    canonical: 'https://example.org/main-schema#/properties/user/properties/profile/properties/email',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user/properties/profile/properties/email',
                },
                'https://example.org/main-schema#/properties/user/properties/name': {
                    canonical: 'https://example.org/main-schema#/properties/user/properties/name',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user/properties/name',
                },
            },
        },
        {
            file: 'ids-embedded-remote',
            expectedSchemas: [
                'https://example.org/main-schema',
                'https://example.org/account-schema',
                'https://example.org/address-schema',
                'https://example.org/address-schema#/properties/city',
                'https://example.org/address-schema#/properties/street',
                'https://example.org/account-schema#/properties/accountNumber',
                'https://example.org/main-schema#user',
                'https://example.org/profile-schema',
                'https://example.org/profile-schema#/properties/address',
                'https://example.org/profile-schema#/properties/email',
                'https://example.org/main-schema#/properties/user/properties/name',
            ],
            expectedRefs: {
                'https://example.org/address-schema': [
                    'https://example.org/profile-schema#/properties/address',
                ],
            },
            expectedCanonical: {
                'https://example.org/main-schema': {
                    canonical: 'https://example.org/main-schema',
                    canonicalLocation: 'https://example.org/main-schema',
                },
                'https://example.org/account-schema': {
                    canonical: 'https://example.org/account-schema',
                    canonicalLocation: 'https://example.org/account-schema',
                },
                'https://example.org/address-schema': {
                    canonical: 'https://example.org/address-schema',
                    canonicalLocation: 'https://example.org/address-schema',
                },
                'https://example.org/address-schema#/properties/city': {
                    canonical: 'https://example.org/address-schema#/properties/city',
                    canonicalLocation: 'https://example.org/address-schema#/properties/city',
                },
                'https://example.org/address-schema#/properties/street': {
                    canonical: 'https://example.org/address-schema#/properties/street',
                    canonicalLocation: 'https://example.org/address-schema#/properties/street',
                },
                'https://example.org/account-schema#/properties/accountNumber': {
                    canonical: 'https://example.org/account-schema#/properties/accountNumber',
                    canonicalLocation: 'https://example.org/account-schema#/properties/accountNumber',
                },
                'https://example.org/main-schema#user': {
                    canonical: 'https://example.org/main-schema#user',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user',
                },
                'https://example.org/profile-schema': {
                    canonical: 'https://example.org/profile-schema',
                    canonicalLocation: 'https://example.org/profile-schema',
                },
                'https://example.org/profile-schema#/properties/address': {
                    canonical: 'https://example.org/profile-schema#/properties/address',
                    canonicalLocation: 'https://example.org/profile-schema#/properties/address',
                },
                'https://example.org/profile-schema#/properties/email': {
                    canonical: 'https://example.org/profile-schema#/properties/email',
                    canonicalLocation: 'https://example.org/profile-schema#/properties/email',
                },
                'https://example.org/main-schema#/properties/user/properties/name': {
                    canonical: 'https://example.org/main-schema#/properties/user/properties/name',
                    canonicalLocation: 'https://example.org/main-schema#/properties/user/properties/name',
                },
            },
        },
        {
            file: 'composition-conditional',
            expectedSchemas: [
                '#',
                '#/else',
                '#/else/properties/content',
                '#/then',
                '#/then/properties/content',
                '#/if',
                '#/if/properties/teaser',
                '#/allOf/1',
                '#/allOf/1/properties/meta',
                '#/allOf/0',
                '#/allOf/0/properties/title',
                '#/properties/type',
                '#/properties/type/not',
            ],
        },
    ])(
        'resourceFromSchema - $file $name',
        async (
            {
                file,
                patchSchema,
                expectedSchemas,
                expectedRefs,
                expectedUnresolved,
                expectedCanonical,
            },
        ) => {
            const schema = await readSchema(`${file}.json`)
            const schemaMap = createOrdered(schema)
            const resource = resourceFromSchema(patchSchema ? patchSchema(schemaMap) : schemaMap)
            if (expectedSchemas) {
                expect(Object.keys(resource.schemas)).toStrictEqual(expectedSchemas)
            }
            expect(mapToStrings(resource.refs)).toStrictEqual(expectedRefs || {})
            expect(resource.unresolved ? mapToStrings(resource.unresolved) : undefined).toStrictEqual(expectedUnresolved)
            if (expectedCanonical) {
                // const canonicals = Object.entries(resource.schemas).reduce((canonicals, [canonical, branch]) => {
                //     canonicals[canonical] = {
                //         canonical: branch.canonical.canonical,
                //         canonicalLocation: branch.canonical.canonicalLocation,
                //     }
                //     return canonicals
                // }, {})
                // console.log('canonicals', canonicals)
                for (const [canonical, branch] of Object.entries(resource.schemas)) {
                    if (!(canonical in expectedCanonical)) continue
                    expect(branch.canonical).toMatchObject(expectedCanonical[canonical])
                }
            }
        },
    )

    test(
        'findRef',
        async () => {
            const schema = await readSchema(`ids-embedded-pointer.json`)
            const schemaMap = createOrdered(schema)
            const resource = resourceFromSchema(schemaMap)
            const branchWithRef = resource.findRef('https://example.org/main-schema#/properties/user/properties/profile/properties/address')
            expect(branchWithRef?.canonical).toStrictEqual({
                'anchor': undefined,
                'canonical': 'https://example.org/main-schema#/properties/user/properties/profile/properties/address',
                'canonicalLocation': 'https://example.org/main-schema#/properties/user/properties/profile/properties/address',
                'isRoot': undefined,
            })
            expect(branchWithRef?.value()?.get('$ref')).toBe('https://example.org/main-schema#/properties/account/properties/address')
            const branchOfRef = resource.findRef(branchWithRef?.value()?.get('$ref'))
            expect(branchOfRef?.canonical).toStrictEqual({
                'anchor': 'address-schema',
                'canonical': 'https://example.org/account-schema#address-schema',
                'canonicalLocation': 'https://example.org/account-schema#/properties/address',
                'isRoot': undefined,
            })
            expect(branchWithRef?.reference).toBeInstanceOf(Function)
            expect(branchWithRef?.reference?.() === branchOfRef).toBe(true)
        },
    )

    test(
        'duplicate schema',
        async () => {
            const schema = await readSchema(`defs-nested-anchors-duplicate.json`)
            const schemaMap = createOrdered(schema)
            expect(() => resourceFromSchema(schemaMap)).toThrow(
                'Duplicate schema resource with canonical: https://example.org/schemas/example-defs-nested-anchors.json#address\n' +
                'found in: https://example.org/schemas/example-defs-nested-anchors.json#/$defs/address\n' +
                'already found in: https://example.org/schemas/example-defs-nested-anchors.json#/properties/order/$defs/address',
            )
        },
    )

    test(
        'invalid anchor',
        async () => {
            const schemaMap = createOrdered({
                $anchor: '#root',
            })
            expect(() => resourceFromSchema(schemaMap)).toThrow(
                'Invalid $anchor, must not start with hashtag: #root',
            )
        },
    )

    test(
        'mixed schema dialect',
        async () => {
            const schema = await readSchema(`mixed-dialects.json`)
            const schemaMap = createOrdered(schema)
            const resource = resourceFromSchema(schemaMap)
            expect(Object.keys(resource.schemas)).toStrictEqual([
                'https://example.org/mixed-dialects',
                'https://example.org/mixed-dialects#/properties/customer',
                'https://example.org/mixed-dialects#/properties/product',
                'https://example.org/mixed-dialects#customer',
                'https://example.org/mixed-dialects#/$defs/customer/properties/address',
                'https://example.org/mixed-dialects#/$defs/customer/properties/lastName',
                'https://example.org/mixed-dialects#/$defs/customer/properties/firstName',
                'https://example.org/mixed-dialects#/$defs/customer/properties/customerId',
                'https://example.org/mixed-dialects#address',
                'https://example.org/mixed-dialects#/$defs/customer/$defs/address/properties/zipCode',
                'https://example.org/mixed-dialects#/$defs/customer/$defs/address/properties/city',
                'https://example.org/mixed-dialects#/$defs/customer/$defs/address/properties/street',
                'https://example.org/mixed-dialects#product',
                'https://example.org/mixed-dialects#/$defs/product/properties/price',
                'https://example.org/mixed-dialects#/$defs/product/properties/name',
                'https://example.org/mixed-dialects#/$defs/product/properties/productId',
            ])

            expect(resource.schemas['https://example.org/mixed-dialects'].dialect).toBe('https://json-schema.org/draft/2020-12/schema')
            expect(resource.schemas['https://example.org/mixed-dialects#product'].dialect).toBe('https://json-schema.org/draft/2020-12/schema')
            expect(resource.schemas['https://example.org/mixed-dialects#customer'].dialect).toBe('https://json-schema.org/draft/2019-09/schema')
            expect(resource.schemas['https://example.org/mixed-dialects#address'].dialect).toBe('https://json-schema.org/draft-07/schema')
        },
    )
})
