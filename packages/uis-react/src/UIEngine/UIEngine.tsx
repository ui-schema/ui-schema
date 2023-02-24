import { Deco, DecoDataPluck, DecoDataResult } from '@tactic-ui/engine/Deco'
import {
    TreeEngine,
    ReactLeafsRenderMatcher,
    createLeafsContext, ReactLeafsNodeSpec,
} from '@tactic-ui/react/LeafsProvider'
import { defineLeafNode } from '@tactic-ui/react/LeafNode'
import { WidgetProps } from '@ui-schema/react/Widgets'

// todo: `Deco` must receive "props without those which Deco injects", so maybe two `PropsSpec` mappings? or data? or ...?
//       e.g. impacts "required by component and injected by decorator" together with `LeafNode`/`DataPluck` typings: not removing the required `props` from `Deco.PG`
//       note: using only `DecoTW` would work correctly for user etc. BUT impacts the `decorator.run` input-typing
// const dec = new Deco<DecoTW>()

// todo: `Deco` must receive "props without those which Deco injects", so maybe two `PropsSpec` mappings? or data? or ...?
//       e.g. impacts "required by component and injected by decorator" together with `LeafNode`/`DataPluck` typings: not removing the required `props` from `Deco.PG`
//       note: using only `DecoTW` would work correctly for user etc. BUT impacts the `decorator.run` input-typing
// const dec = new Deco<DecoTW>()
export type WidgetPropsMap = { [k: string]: WidgetProps }

export const dec = new Deco<WidgetProps>()
    .use(<P extends WidgetProps>(p: P): WidgetProps & { required: boolean } => ({...p, required: true}))
    .use(<P extends WidgetProps & { required?: boolean }>(p: P): WidgetProps & { valid: boolean } => ({...p, valid: false}))

export type DecoDataPl = DecoDataPluck<WidgetProps, typeof dec>
export type DecoDataRe = DecoDataResult<WidgetPropsMap[keyof WidgetPropsMap], typeof dec>
// export type CustomLeafsNodeSpec = Partial<ReactLeafsNodeSpec<CustomLeafPropsSpec, typeof dec>>
export type CustomLeafsNodeSpec = ReactLeafsNodeSpec<WidgetPropsMap, typeof dec>

export type CustomLeafComponents = {}
export type ContentMarkLeafProps = DecoDataResult<WidgetPropsMap[keyof WidgetPropsMap], typeof dec>

export const uiEngine: TreeEngine<WidgetPropsMap, typeof dec, ReactLeafsRenderMatcher<typeof dec, WidgetPropsMap, CustomLeafComponents>> = {
    decorator: dec,
    matcher: (leafs, ld) => {
        // todo: use distinct schema type
        // todo: add distinct schema type pass-down of value for better inference
        const schemaType = ld.schema?.get('type') as string | undefined
        const schemaWidget = ld.schema?.get('widget')
        console.log('schemaType', schemaType, schemaWidget, leafs)
        if (schemaWidget && leafs[schemaWidget]) {
            return leafs[schemaWidget]
        }
        if (typeof schemaType === 'string') {
            const widgetName = 'type' + schemaType.slice(0, 1).toUpperCase() + schemaType.slice(1)
            if (leafs[widgetName]) {
                return leafs[widgetName]
            }
        }
        throw new Error('No Widget found.')
    },
    identifier: (ld) => ({
        toString: () => ld.storeKeys?.join('/') || '',
        toArray: () => ld.storeKeys?.toArray() || [],
    }),
}

export const uiEngineContext = createLeafsContext<WidgetPropsMap, CustomLeafComponents, typeof dec>(
    // @ts-ignore
    uiEngine, {},
)

const {Leaf} = defineLeafNode(uiEngineContext)
export const WidgetEngine = Leaf
