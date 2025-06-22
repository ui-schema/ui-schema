/**
 * @jest-environment jsdom
 */
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { VirtualWidgetRenderer, VirtualWidgetsMapping } from '@ui-schema/react/VirtualWidgetRenderer'
import { List, OrderedMap } from 'immutable'

const virtualWidgets: VirtualWidgetsMapping = {
    'default': () => <span>virtual-default-renderer</span>,
    'object': () => <span>virtual-object-renderer</span>,
    'array': () => <span>virtual-array-renderer</span>,
}

describe('VirtualWidgetRenderer', () => {
    it('default type widget', async () => {
        const {queryByText} = render(
            // @ts-expect-error
            <VirtualWidgetRenderer
                value={'demo-value'}
                storeKeys={List()}
                virtualWidgets={virtualWidgets}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('virtual-default-renderer') !== null).toBeTruthy()
    })

    it('object type widget', async () => {
        const {queryByText} = render(
            // @ts-expect-error
            <VirtualWidgetRenderer
                value={OrderedMap()}
                storeKeys={List()}
                virtualWidgets={virtualWidgets}
                schema={createOrderedMap({type: 'object'})}
            />
        )
        expect(queryByText('virtual-object-renderer') !== null).toBeTruthy()
    })

    it('array type widget', async () => {
        const {queryByText} = render(
            // @ts-expect-error
            <VirtualWidgetRenderer
                value={List()}
                storeKeys={List()}
                virtualWidgets={virtualWidgets}
                schema={createOrderedMap({type: 'array'})}
            />
        )
        expect(queryByText('virtual-array-renderer') !== null).toBeTruthy()
    })

    it('array type widget items tuple schema', async () => {
        // todo: with array content
        const {queryByText} = render(
            // @ts-expect-error
            <VirtualWidgetRenderer
                value={List()}
                storeKeys={List()}
                //virtualWidgets={virtualWidgets}
                schema={createOrderedMap({type: 'array', items: []})}
            />
        )
        expect(queryByText('virtual-array-renderer') === null).toBeTruthy()
    })

    it('array type widget items one-schema', async () => {
        // todo: with array content
        const {queryByText} = render(
            // @ts-expect-error
            <VirtualWidgetRenderer
                value={List()}
                storeKeys={List()}
                //virtualWidgets={virtualWidgets}
                schema={createOrderedMap({type: 'array', items: {}})}
            />
        )
        expect(queryByText('virtual-array-renderer') === null).toBeTruthy()
    })
})
