import React, { PropsWithChildren } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import {
    toBeInTheDocument,
    toHaveClass,
} from '@testing-library/jest-dom/matchers'
import { List } from 'immutable'
import { SchemaEditor } from '../src/SchemaEditor/SchemaEditor'
import { MockWidgets } from './MockSchemaProvider.mock'
import { createStore, extractValue, WithValue } from '@ui-schema/ui-schema/EditorStore/EditorStore'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { CombiningHandler, ConditionalHandler, DefaultHandler, DependentHandler, JsonSchema, NestedSchemaEditor, TransTitle, ValidatorStack, ValidityReporter, WidgetProps } from '@ui-schema/ui-schema'
import { ReferencingHandler } from '@ui-schema/ui-schema/Plugins/ReferencingHandler'
import { validators } from '@ui-schema/ui-schema/Validators/validators'
import { NextPluginRenderer } from '@ui-schema/ui-schema/EditorPluginStack/EditorPluginStack'
import { isInvalid } from '@ui-schema/ui-schema/ValidityReporter/isInvalid'

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
        {List.isList(props.value) ? props.value.map((val: any, i: number) =>
            <div key={i}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                    <NestedSchemaEditor
                        showValidity={props.showValidity}
                        storeKeys={props.storeKeys.push(i)}
                        schema={props.schema.get('items')}
                        noGrid
                    />
                </div>
            </div>).valueSeq() : null}
    </>
})

const TestSchemaEditor = (props: {
    data?: {
        demo_string?: string
        demo_number?: number
        demo_array?: []
        demo_array2?: string[]
    }
    notT?: boolean
}) => {

    // needed variables and setters for the SchemaEditor, create wherever you like
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(props.data || {demo_string: ''})))
    // @ts-ignore
    const [schema/*, setSchema*/] = React.useState(() => createOrderedMap({
        type: 'object',
        // @ts-ignore
        $def: {
            // @ts-ignore
            demo_number_def: {
                $anchor: 'demo_number',
                type: 'number',
                multipleOf: 5,
                maximum: 50,
            },
            // @ts-ignore
            type_string: {
                $id: '#type_string',
            },
            person: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
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
                            // @ts-ignore
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
        // @ts-ignore
        allOf: [{
            // @ts-ignore
            if: {
                properties: {
                    demo_string: {
                        type: 'string',
                        // @ts-ignore
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
        dependencies: {
            demo_number: {
                properties: {
                    demo_string: {
                        minLength: 2,
                    },
                },
            },
        },
        required: ['demo_number'],
    } as JsonSchema))

    return <SchemaEditor
        schema={schema}
        store={store}
        onChange={setStore}

        showValidity
        widgets={widgets}
        t={props.notT ? undefined : (text: string) => text}
    >
        {/* (optional) add components which use the context of the Editor here */}
        {/* @ts-ignore */}
        <div>schema-is-{isInvalid(store.getValidity()) ? 'invalid' : 'correct'}</div>
    </SchemaEditor>
}

describe('SchemaEditor Integration', () => {
    it('TestSchemaEditor', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestSchemaEditor data={{demo_number: 10, demo_array2: ['val-test']}}/>
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
    it('TestSchemaEditor not `t`', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestSchemaEditor notT/>
        )
        expect(container.querySelectorAll('.root-renderer').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('Demo String') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title') === null).toBeTruthy()
        expect(queryAllByText('string-renderer').length === 3).toBeTruthy()
    })
    it('TestSchemaEditor ConditionalCombining', async () => {
        const {queryByText, container} = render(
            <TestSchemaEditor data={{demo_string: 'test'}}/>
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-renderer').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('widget.demo_string.title') == null).toBeTruthy()
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })
    it('TestSchemaEditorError', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestSchemaEditor data={{
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

