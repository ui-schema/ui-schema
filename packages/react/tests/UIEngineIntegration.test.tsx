/**
 * @jest-environment jsdom
 */
import { resourceFromSchema } from '@ui-schema/ui-schema/SchemaResource'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { SchemaResourceProvider } from '@ui-schema/react/SchemaResourceProvider'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import React, { PropsWithChildren, useMemo } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { List } from 'immutable'
import { MockWidgets } from './MockSchemaProvider.mock'
import { createStore, extractValue, UIStoreProvider } from '@ui-schema/react/UIStore'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { CombiningHandler } from '@ui-schema/react-json-schema/CombiningHandler'
import { ConditionalHandler } from '@ui-schema/react-json-schema/ConditionalHandler'
import { DefaultHandler } from '@ui-schema/react-json-schema/DefaultHandler'
import { DependentHandler } from '@ui-schema/react-json-schema/DependentHandler'
import { ReferencingHandler } from '@ui-schema/react-json-schema/ReferencingHandler'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { translateRelative } from '@ui-schema/ui-schema/TranslatorRelative'
import { JsonSchema } from '@ui-schema/json-schema/Definitions'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { WidgetProps } from '@ui-schema/react/Widget'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'

/**
 * This file serves as general integration test
 *
 * - checking rendering from root to widget renderer
 * - checking validation stack / plugin stack basic execution
 * - checking basic error pass through
 *
 * todo: test on details and behaviour instead of only does-render-stuff
 *
 * npm test -- --testPathPattern=UIEngineIntegration.test.tsx -u --selectProjects=test-@ui-schema/react
 */

const widgets = {
    ...MockWidgets,
    widgets: {
        ...MockWidgets.widgets,
    },
}
// todo: add custom ErrorFallback, otherwise some errors may be catched there - and the test will not fail

widgets.GroupRenderer =
    function GroupRenderer({children, storeKeys}) {
        return <div
            data-path={storeKeys.join('.')}
            className={'group-renderer'}
        >{children}</div>
    }

// todo: make three separate and ensure test are the same, one with legacy, one with modern, one both mixed (as far as supported)
const widgetPluginsLegacy = [
    // plugin to have every widget in its own div - to query against in tests
    ({Next, ...props}) => <div><Next.Component {...props}/></div>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ReferencingHandler,
    // ExtractStorePlugin,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    CombiningHandler,
    DefaultHandler,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    DependentHandler,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ConditionalHandler,
    schemaPluginsAdapterBuilder([
        // todo: should this exclude the validators which replaced the deprecated widget plugins?
        validatorPlugin,
    ]),
    ValidityReporter,
]

const widgetPlugins = [
    // plugin to have every widget in its own div - to query against in tests
    ({Next, ...props}) => <div><Next.Component {...props}/></div>,
    DefaultHandler,
    schemaPluginsAdapterBuilder([
        validatorPlugin,
        requiredPlugin,
    ]),
    ValidityReporter,
]

widgets.widgets.string = function WidgetString(props: WidgetProps) {
    return <>
        <span data-path={props.storeKeys.join('.')}>string-renderer</span>
        <span><TranslateTitle schema={props.schema} storeKeys={props.storeKeys}/></span>
        {props.valid ? null : <span>string-with-error</span>}
        {props.errors?.size ? <span>{JSON.stringify(props.errors)}</span> : null}
    </>
}

widgets.widgets.array = extractValue(function WidgetArray(props: WidgetProps) {
    const itemsSchema = props.schema.get('items')
    return <>
        <span data-path={props.storeKeys.join('.')}>array-renderer</span>
        <span><TranslateTitle schema={props.schema} storeKeys={props.storeKeys}/></span>
        {itemsSchema && !List.isList(itemsSchema) && List.isList(props.value) ? props.value.map((_val, i: number) =>
            <div key={i}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                    {null}
                    <WidgetEngine
                        showValidity={props.showValidity}
                        storeKeys={props.storeKeys.push(i)}
                        schema={itemsSchema}
                        parentSchema={props.schema}
                        //level={level + 1}
                        noGrid
                    />
                </div>
            </div>).valueSeq() : null}
        {props.valid ? null : <span>array-with-error</span>}
    </>
})

// note: for DS which implement a grid system, this is the `GridContainer`/`GridStack` components
const RootContainer = ({children}: PropsWithChildren<any>): React.ReactElement => <div className={'root-container'}>{children}</div>

const TestUIRenderer = (props: {
    data?: {
        demo_string?: string
        demo_number?: number
        demo_array?: []
        demo_array2?: string[]
    }
    notT?: boolean
    noStore?: boolean
    legacy?: boolean
}) => {
    // needed variables and setters for the UIGenerator, create wherever you like
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(props.data || {demo_string: ''})))

    const [schema/*, setSchema*/] = React.useState(() => createOrderedMap({
        type: 'object',
        $defs: {
            demo_number_def: {
                $anchor: 'demo_number',
                type: 'number',
                multipleOf: 5,
                maximum: 50,
            },
            type_string: {
                $id: '#type_string',
            },
            person: {
                type: 'object',
                properties: {
                    // todo: workaround if IDE doesn't correctly match the typing to a deeply nested property
                    name: {
                        type: 'string',
                    } as JsonSchema,
                    children: {
                        type: 'array',
                        // note: new validator is more spec compliant, no $defs/definitions aliasing
                        // items: {$ref: '#/definitions/person'},
                        items: {$ref: '#/$defs/person'},
                        'default': [],
                    },
                },
                if: {
                    properties: {
                        name: {
                            type: 'string',
                            const: 'Musterman',
                        },
                    },
                },
                then: {
                    properties: {
                        name: {
                            minLength: 30,
                        },
                    },
                },
            },
        },
        properties: {
            demo_string: {
                type: 'string',
                minLength: 0,
                maxLength: 6,
            },
            demo_number: {
                $ref: '#demo_number',
            },
            demo_array: {
                type: 'array',
                default: ['def-value'],
                items: {
                    type: 'string',
                },
            },
            demo_array2: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            // note: new validator is more spec compliant, no $defs/definitions aliasing
            // person: {$ref: '#/definitions/person'},
            person: {$ref: '#/$defs/person'},
        },
        allOf: [{
            if: {
                // todo: for v0.5.x validator rewrite, if `undefined`, this now needs `type` to be `invalid`
                type: 'object',
                properties: {
                    demo_string: {
                        type: 'string',
                        const: 'test',
                    },
                },
                // without `required` this now (>=0.4.3) would resolve always after fixing ConditionalHandler
                required: ['demo_string'],
            },
            then: {
                properties: {
                    demo_string: {
                        widget: 'Text',
                    },
                },
            },
        }],
        dependentSchemas: {
            demo_number: {
                properties: {
                    demo_string: {
                        type: 'string',
                        minLength: 2,
                    },
                },
            },
        },
        dependentRequired: {
            demo_array2: ['demo_number'],
        },
        required: ['demo_number'],
    } as unknown as JsonSchema))

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    const appliedWidgets = useMemo(() => {
        return {
            ...widgets,
            WidgetRenderer: WidgetRenderer,
            widgetPlugins: props.legacy ? widgetPluginsLegacy : widgetPlugins,
        }
    }, [props.legacy])

    const resource = useMemo(() => (schema && !props.legacy ? resourceFromSchema(schema, {}) : undefined), [props.legacy, schema])

    const standard = <UIMetaProvider
        binding={appliedWidgets}
        t={props.notT ? translateRelative : (text: string) => text}
        validate={props.legacy ? validatePlain : validate}
    >
        <UIStoreProvider
            store={props.noStore ? undefined : store}
            onChange={onChange}
            showValidity
        >
            <RootContainer>
                <WidgetEngine isRoot schema={props.legacy ? schema : resource?.branch.value()}/>
            </RootContainer>
        </UIStoreProvider>
        <div>store-is-{isInvalid(store.getValidity()) ? 'invalid' : 'correct'}</div>
    </UIMetaProvider>

    if (props.legacy) {
        return standard
    }

    // for $ref support in new validator system, the resource system is needed
    return <SchemaResourceProvider
        resource={resource}
    >
        {standard}
    </SchemaResourceProvider>
}

const validatePlain = Validator([
    ...standardValidators,
]).validate

const validate = Validator([
    ...standardValidators,
    requiredValidatorLegacy, // this is a compact plugin, to behave like the old one
]).validate

const setupTests = (legacy: boolean) => describe('UIGenerator Integration' + (legacy ? ' legacy' : ''), () => {
    it('TestUIRenderer', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer legacy={legacy} data={{demo_number: 10, demo_array2: ['val-test']}}/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length).toBe(1)
        expect(container.querySelectorAll('.group-renderer').length).toBe(2)
        expect(queryByText('store-is-correct') !== null).toBeTruthy()
        expect(queryByText('store-is-invalid')).toBe(null)
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length).toBe(4)
        expect(queryByText('string-with-error') === null).toBeTruthy()
        expect(queryByText('missing-type-number') !== null).toBeTruthy()
        expect(queryAllByText('array-renderer').length).toBe(3)
    })
    it('TestUIRenderer no `store`', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer legacy={legacy} noStore/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length).toBe(1)
        expect(container.querySelectorAll('.group-renderer').length).toBe(2)

        expect(queryByText('Demo String')).toBe(null)
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        // todo: remove experimental 0.5.x
        //       as values are passed down directly, defaulted array/object values are passed down directly,
        //       thus not relying on `store` to get accessed in their direct layer
        // expect(queryAllByText('string-renderer').length).toBe(2)
        expect(queryAllByText('string-renderer').length).toBe(3)
        expect(queryByText('store-is-invalid') !== null).toBeTruthy()
    })
    it('TestUIRenderer not `t`', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer legacy={legacy} notT/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length).toBe(1)
        expect(container.querySelectorAll('.group-renderer').length).toBe(2)
        expect(queryByText('Demo String') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title')).toBe(null)
        expect(queryAllByText('string-renderer').length).toBe(3)
    })
    it('TestUIRenderer ConditionalCombining', async () => {
        const {queryByText, container} = render(
            <TestUIRenderer legacy={legacy} data={{demo_string: 'test'}}/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('widget.demo_string.title') === null).toBeTruthy()
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })
    it('TestUIRendererError', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer legacy={legacy} data={{
                demo_string: 'to-long-text', demo_number: 83,
                // @ts-expect-error
                demo_array: 'not-an-array',
            }}/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        //expect(queryByText('store-is-correct') === null).toBeTruthy()
        //expect(queryByText('store-is-invalid') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryByText('string-with-error') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length === 2).toBeTruthy()
        expect(queryByText('array-with-error') !== null).toBeTruthy()
    })
})

setupTests(true)
setupTests(false)
