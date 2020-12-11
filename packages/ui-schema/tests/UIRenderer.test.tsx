import React, { PropsWithChildren } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import {
    toBeInTheDocument,
    toHaveClass,
} from '@testing-library/jest-dom/matchers'
import { List } from 'immutable'
import { UIGenerator } from '../src/UIGenerator/UIGenerator'
import { MockWidgets } from './MockSchemaProvider.mock'
import { createStore, extractValue, WithValue } from '@ui-schema/ui-schema/UIStore/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { CombiningHandler, ConditionalHandler, DefaultHandler, DependentHandler, JsonSchema, UIGeneratorNested, TransTitle, ValidatorStack, ValidityReporter, WidgetProps } from '@ui-schema/ui-schema'
import { ReferencingHandler } from '@ui-schema/ui-schema/Plugins/ReferencingHandler'
import { validators } from '@ui-schema/ui-schema/Validators/validators'
import { NextPluginRenderer } from '@ui-schema/ui-schema/PluginStack/PluginStack'
import { isInvalid } from '@ui-schema/ui-schema/ValidityReporter/isInvalid'
import { storeUpdater } from '@ui-schema/ui-schema/UIStore/storeUpdater'

/**
 * This file serves as general integration test
 *
 * - checking rendering from root to widget renderer
 * - checking validation stack / plugin stack basic execution
 * - checking basic error pass through
 *
 * todo: test on details and behaviour instead of only does-render-stuff
 */

expect.extend({toBeInTheDocument, toHaveClass})
const widgets = MockWidgets

// eslint-disable-next-line react/display-name
widgets.RootRenderer = (props: PropsWithChildren<any>): React.ReactElement => <div className={'root-renderer'}>{props.children}</div>
// eslint-disable-next-line react/display-name
widgets.GroupRenderer = (props: PropsWithChildren<any>): React.ReactElement => <div className={'group-renderer'}>{props.children}</div>
widgets.pluginStack = [
    // plugin to have every widget in it's own div to query against
    (props) => <div><NextPluginRenderer {...props}/></div>,
    ReferencingHandler,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    ValidatorStack,
    ValidityReporter,
]
widgets.validators = validators

// eslint-disable-next-line react/display-name
widgets.types.string = (props: WidgetProps): React.ReactElement => {
    return <>
        <span>string-renderer</span>
        <span><TransTitle schema={props.schema} ownKey={props.ownKey} storeKeys={props.storeKeys}/></span>
        {props.valid ? null : <span>string-with-error</span>}
        {props.errors.hasError() ? <span>{JSON.stringify(props.errors.errorsToJS())}</span> : null}
    </>
}

// eslint-disable-next-line react/display-name
widgets.types.array = extractValue((props: WidgetProps & WithValue): React.ReactElement => {
    return <>
        <span>array-renderer</span>
        <span><TransTitle schema={props.schema} ownKey={props.ownKey} storeKeys={props.storeKeys}/></span>
        {/* @ts-ignore */}
        {List.isList(props.value) ? props.value.map((val, i: number) =>
            <div key={i}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                    <UIGeneratorNested
                        showValidity={props.showValidity}
                        storeKeys={props.storeKeys.push(i)}
                        schema={props.schema.get('items')}
                        noGrid
                    />
                </div>
            </div>).valueSeq() : null}
    </>
})

const TestUIRenderer = (props: {
    data?: {
        demo_string?: string
        demo_number?: number
        demo_array?: []
        demo_array2?: string[]
    }
    notT?: boolean
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
                        items: {$ref: '#/definitions/person'},
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
                pattern: '^$|.+',
                minLength: 0,
                maxLength: 2,
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
            person: {$ref: '#/definitions/person'},
        },
        allOf: [{
            if: {
                properties: {
                    demo_string: {
                        type: 'string',
                        const: 'test',
                    },
                },
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
    } as JsonSchema))

    const onChange = React.useCallback((storeKeys, scopes, values, deleteOnEmpty, type) => {
        setStore(storeUpdater(storeKeys, scopes, values, deleteOnEmpty, type))
    }, [setStore])

    return <UIGenerator
        schema={schema}
        store={store}
        onChange={onChange}

        showValidity
        widgets={widgets}
        t={props.notT ? undefined : (text: string) => text}
    >
        {/* (optional) add components which use the context of the Editor here */}
        <div>schema-is-{isInvalid(store.getValidity()) ? 'invalid' : 'correct'}</div>
    </UIGenerator>
}

describe('UIGenerator Integration', () => {
    it('TestUIRenderer', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer data={{demo_number: 10, demo_array2: ['val-test']}}/>
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-renderer').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('schema-is-correct') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length === 4).toBeTruthy()
        expect(queryByText('string-with-error') === null).toBeTruthy()
        expect(queryByText('missing-type-number') !== null).toBeTruthy()
        expect(queryAllByText('array-renderer').length === 3).toBeTruthy()
    })
    it('TestUIRenderer not `t`', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer notT/>
        )
        expect(container.querySelectorAll('.root-renderer').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('Demo String') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title') === null).toBeTruthy()
        expect(queryAllByText('string-renderer').length === 3).toBeTruthy()
    })
    it('TestUIRenderer ConditionalCombining', async () => {
        const {queryByText, container} = render(
            <TestUIRenderer data={{demo_string: 'test'}}/>
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-renderer').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('widget.demo_string.title') == null).toBeTruthy()
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })
    it('TestUIRendererError', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer data={{
                demo_string: '4444a', demo_number: 83,
                // @ts-ignore
                demo_array: 'not-an-array',
            }}/>
        )
        //expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-renderer').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        //expect(queryByText('schema-is-correct') === null).toBeTruthy()
        //expect(queryByText('schema-is-invalid') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryByText('string-with-error') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length === 2).toBeTruthy()
    })
})

