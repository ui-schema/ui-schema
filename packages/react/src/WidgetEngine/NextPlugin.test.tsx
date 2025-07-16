/**
 * @jest-environment jsdom
 */
import { it, expect, describe, jest } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { NoWidget } from '@ui-schema/react/NoWidget'
import { makeNext, NextPluginMemo, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { List } from 'immutable'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'

describe('NextPlugin', () => {
    const mockProps = {
        storeKeys: List<string | number>(),
        onChange: undefined as any,
        value: undefined,
        internalValue: undefined,
        t: text => text,
    }
    it('Empty Plugins + No WidgetRenderer', async () => {
        const Next = makeNext(undefined, [] satisfies WidgetPluginType[])
        // disable default log inside react lib.
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

        await waitFor(
            () => expect(
                () => render(
                    <Next.Component
                        schema={createOrderedMap({type: 'string'})}
                        {...mockProps}
                    />,
                ),
            )
                .toThrow('WidgetPlugin overflow, no plugins and no WidgetRenderer.'),
        )

        jest.restoreAllMocks()
    })
    it('Single NextPluginRenderer - current', async () => {
        const Next = makeNext(WidgetRenderer, [
            ({Next, ...p}) => <>
                <span>plugin-1</span>
                <Next.Component {...p}/>
            </>,
        ] satisfies WidgetPluginType[])
        const {queryByText} = render(
            <Next.Component
                schema={createOrderedMap({type: 'string'})}
                binding={{
                    NoWidget: NoWidget,
                }}
                {...mockProps}
            />,
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current · memo', async () => {
        const Next = makeNext(WidgetRenderer, [
            (p) => <>
                <span>plugin-1</span>
                <NextPluginMemo {...p}/>
            </>,
        ] satisfies WidgetPluginType[])
        const {queryByText} = render(
            <Next.Component
                schema={createOrderedMap({type: 'string'})}
                binding={{
                    NoWidget: NoWidget,
                }}
                {...mockProps}
            />,
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    // (impossible now, when using <Next/>)
    // it('Single NextPluginRenderer - prev', async () => {
    //     const Next = makeNext([
    //         WidgetRenderer,
    //     ] satisfies WidgetPluginType[])
    //     const {queryByText} = render(
    //         <NextPluginRenderer
    //             binding={{
    //                 NoWidget: NoWidget,
    //                 widgetPlugins: [
    //                     (p) => <>
    //                         <span>plugin-1</span>
    //                         <NextPluginRenderer {...p}/>
    //                     </>,
    //                     WidgetRenderer,
    //                 ] satisfies WidgetPluginType[],
    //             }}
    //             schema={createOrderedMap({type: 'string'})}
    //         />,
    //     )
    //     expect(queryByText('plugin-1') === null).toBeTruthy()
    //     expect(queryByText('missing-type-string') !== null).toBeTruthy()
    // })
    // it('Single NextPluginRenderer - err', async () => {
    //     const Next = makeNext([
    //         WidgetRenderer,
    //     ] satisfies WidgetPluginType[])
    //     // disable default log inside react lib.
    //     jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    //
    //     await waitFor(
    //         () => expect(
    //             () => render(
    //                 <NextPluginRenderer
    //                     binding={{
    //                         NoWidget: NoWidget,
    //                         widgetPlugins: [
    //                             (p) => <>
    //                                 <span>plugin-1</span>
    //                                 <NextPluginRenderer {...p}/>
    //                             </>,
    //                         ] satisfies WidgetPluginType[],
    //                     }}
    //                     schema={createOrderedMap({type: 'string'})}
    //                 />,
    //             ),
    //         )
    //             .toThrow('WidgetPlugin overflow, no plugin at 1.'),
    //     )
    //
    //     jest.restoreAllMocks()
    // })
})
