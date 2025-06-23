/**
 * @jest-environment jsdom
 */
import { ReactNode } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { WidgetRenderer } from './WidgetRenderer.js'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { NoWidgetProps, WidgetProps } from '@ui-schema/react/Widgets'
import { List } from 'immutable'
import { onChangeHandler, WithScalarValue } from '@ui-schema/react/UIStore'

const NoWidget = ({scope, matching}: NoWidgetProps): ReactNode => <>missing-{scope}{matching ? '-' + matching : ''}</>

const mockProps = {
    storeKeys: List([]),
    internalValue: undefined,
    onChange: undefined as unknown as onChangeHandler,
    t: text => text,
}

describe('WidgetRenderer', () => {
    it('missing type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    NoWidget: NoWidget,
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
                {...mockProps}
            />,
        )
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })

    it('missing custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    NoWidget: NoWidget,
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
                {...mockProps}
            />,
        )
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })

    it('type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        types: {
                            string: (props: WidgetProps & WithScalarValue) => props.value,
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
                {...mockProps}
            />,
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })

    it('custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        custom: {
                            Text: (props: WidgetProps & WithScalarValue) => props.value,
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
                {...mockProps}
            />,
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-custom-Text') === null).toBeTruthy()
    })

    it('array widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        types: {
                            array: (props: WidgetProps & { value?: unknown }) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set',
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={[]}
                schema={createOrderedMap({type: 'array'})}
                {...mockProps}
            />,
        )
        // todo: remove experimental 0.5.x
        // expect(queryByText('is-undef') !== null).toBeTruthy()
        expect(queryByText('is-set') !== null).toBeTruthy()
    })

    it('object widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        custom: {
                            CustomObj: (props: WidgetProps & { value?: unknown }) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set',
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={{}}
                schema={createOrderedMap({type: 'object', widget: 'CustomObj'})}
                {...mockProps}
            />,
        )
        // todo: remove experimental 0.5.x
        // expect(queryByText('is-undef') !== null).toBeTruthy()
        expect(queryByText('is-set') !== null).toBeTruthy()
    })
})
