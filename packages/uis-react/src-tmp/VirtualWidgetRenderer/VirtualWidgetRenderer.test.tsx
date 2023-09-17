/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { VirtualWidgetRenderer, VirtualWidgetsMapping } from '@ui-schema/react/WidgetRenderer/VirtualWidgetRenderer'
import { List, OrderedMap } from 'immutable'

expect.extend({toBeInTheDocument, toHaveClass})

const virtualWidgets: VirtualWidgetsMapping = {
    // eslint-disable-next-line react/display-name
    'default': () => <span>virtual-default-renderer</span>,
    // eslint-disable-next-line react/display-name
    'object': () => <span>virtual-object-renderer</span>,
    // eslint-disable-next-line react/display-name
    'array': () => <span>virtual-array-renderer</span>,
}

describe('VirtualWidgetRenderer', () => {
    it('default type widget', async () => {
        const {queryByText} = render(
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
