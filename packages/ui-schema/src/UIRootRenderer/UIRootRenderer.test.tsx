/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { MockSchemaProvider } from '../../tests/MockSchemaProvider.mock'

const MockRootRenderer = () => <><span>root-renderer</span></>

describe('UIRootRenderer', () => {
    it('With RootRenderer', async () => {
        const {queryByText} = render(
            <MockSchemaProvider
                widgets={{
                    RootRenderer: MockRootRenderer,
                    // @ts-ignore
                    GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [],
                }}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('root-renderer') !== null).toBeTruthy()
    })

    const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((message) => message)

    it('No RootRenderer', async () => {
        const {queryByText} = render(
            <MockSchemaProvider
                widgets={{
                    // @ts-ignore
                    RootRenderer: null,
                    // @ts-ignore
                    GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [],
                }}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('root-renderer') === null).toBeTruthy()
        expect(consoleSpy.mock.calls[0] && consoleSpy.mock.calls[0][0]).toBe('Widget RootRenderer not existing')
    })
    it('No Schema', async () => {
        const {queryByText} = render(
            <MockSchemaProvider
                widgets={{
                    RootRenderer: MockRootRenderer,
                    // @ts-ignore
                    GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [],
                }}
                // @ts-ignore
                schema={undefined}
            />
        )
        expect(queryByText('root-renderer') === null).toBeTruthy()
        expect(consoleSpy.mock.calls[1] && consoleSpy.mock.calls[1][0]).toBe('schema must be set')
    })
    it('No Widgets', async () => {
        const {queryByText} = render(
            <MockSchemaProvider
                // @ts-ignore
                widgets={undefined}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('root-renderer') === null).toBeTruthy()
        expect(consoleSpy.mock.calls[2] && consoleSpy.mock.calls[2][0]).toBe('widgets must be set')
    })
})
