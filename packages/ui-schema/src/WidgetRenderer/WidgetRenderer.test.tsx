import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { WidgetRenderer } from './WidgetRenderer'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { WidgetProps } from '@ui-schema/ui-schema'

expect.extend({toBeInTheDocument, toHaveClass})

describe('WidgetRenderer', () => {
    it('missing type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [],
                    validators: [],
                }}
                value={'demo-value'}
                current={0}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })

    it('missing custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [],
                    validators: [],
                }}
                value={'demo-value'}
                current={0}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
            />
        )
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })

    it('type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {string: (props: WidgetProps) => props.value}, custom: {},
                    pluginStack: [],
                    validators: [],
                }}
                value={'demo-value'}
                current={0}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })

    it('custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {Text: (props: WidgetProps) => props.value},
                    pluginStack: [],
                    validators: [],
                }}
                value={'demo-value'}
                current={0}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
            />
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-custom-Text') === null).toBeTruthy()
    })

    it('array widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {array: (props: WidgetProps) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set'}, custom: {},
                    pluginStack: [],
                    validators: [],
                }}
                value={[]}
                current={-1}
                schema={createOrderedMap({type: 'array'})}
            />
        )
        expect(queryByText('is-undef') !== null).toBeTruthy()
    })

    it('object widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {},
                    custom: {CustomObj: (props: WidgetProps) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set'},
                    pluginStack: [],
                    validators: [],
                }}
                value={{}}
                current={-1}
                schema={createOrderedMap({type: 'object', widget: 'CustomObj'})}
            />
        )
        expect(queryByText('is-undef') !== null).toBeTruthy()
    })
})
