import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { MuiBinding } from '@ui-schema/ds-material/Binding'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { SchemaGridItem } from '@ui-schema/ds-material/Grid'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd'
import { DefaultHandler } from '@ui-schema/react-json-schema/DefaultHandler'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react-json-schema/SchemaPluginsAdapter'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { WidgetProps } from '@ui-schema/react/Widget'
import { TableRendererExtractor as TableRenderer, TableFooter, TableHeader, TableRowRenderer, TableRendererExtractorProps } from '@ui-schema/ds-material/BaseComponents/Table'
/*import {
    Color, ColorDialog,
    ColorSwatches,
    ColorCircle, ColorCompact, ColorMaterial,
    ColorBlock, ColorTwitter, ColorSlider,
    ColorAlpha, ColorHue, ColorSketch,
    ColorSliderStatic, ColorStatic,
    ColorCircleStatic, ColorTwitterStatic,
    ColorSketchStatic, ColorSketchDialog,
} from '@ui-schema/material-color';*/
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
// import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { DragDropBlockSelector } from '@ui-schema/material-dnd/DragDropBlockSelector'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets'
import { ErrorNoWidgetMatches, matchWidget, WidgetMatch } from '@ui-schema/ui-schema/matchWidget'
import { List } from 'immutable'
import React, { memo, useMemo } from 'react'
import { browserT } from '../../t'
import { useSchemaInspector } from './SchemaInspector'
//import {WidgetColorful} from '@ui-schema/material-colorful'
/*import {
    HexColorPicker,
    HslaColorPicker,
    RgbaColorPicker,
    RgbaStringColorPicker,
} from 'react-colorful'*/

/*const ColorfulHex = (props) => <WidgetColorful ColorfulPicker={HexColorPicker} {...props}/>
const ColorfulHslaBase = (props) => <WidgetColorful ColorfulPicker={HslaColorPicker} {...props}/>
const ColorfulHsla = extractValue(memo(ColorfulHslaBase))
const ColorfulRgbaBase =
    (props) =>
        <WidgetColorful
            // todo: find a way to safely type the inner `ColorfulPicker`, as this is not incorrect per-se,
            //       as the widget handles string vs. object on change / rendering
            // @ts-ignore
            ColorfulPicker={props.schema.get('type') === 'string' ? RgbaStringColorPicker : RgbaColorPicker}
            {...props}
        />
const ColorfulRgba = extractValue(memo(ColorfulRgbaBase))*/

// the same as the default Table component, but components available for equality check in inspector plugin
const TableHeaderMemo = memo(TableHeader)
const TableRowRendererMemo = memo(TableRowRenderer)

const rowsPerPageDefault = List([5, 10, 25, 50])

export const Table: React.FC<WidgetProps> = (props) => {
    return <TableRenderer
        {...props}
        TableRowRenderer={TableRowRendererMemo}
        TableFooter={TableFooter}
        TableHeader={TableHeaderMemo}
        rowsPerPage={(props.schema.getIn(['view', 'rowsPerPage']) as TableRendererExtractorProps['rowsPerPage']) || rowsPerPageDefault}
        rowsShowAll={props.schema.getIn(['view', 'rowsShowAll']) as TableRendererExtractorProps['rowsShowAll']}
    />
}


const CustomTable = ({binding, ...props}: WidgetProps) => {

    // dynamic overwrite for all widgets, which need a special TableCell formatting
    // you can also only enable specific widgets here
    const customWidgets = useMemo(() => ({
        ...binding,
        widgets: {
            ...binding?.widgets,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
            Text: TextRendererCell,
        },
    }), [binding])

    return <Table
        {...props}
        binding={customWidgets}
    />
}

/**
 * Super simple inspector.
 *
 * @todo make grid focusable for keyboard navigation support for context menu?
 */
const SchemaGridHandlerWithInspector = <P extends WidgetPluginProps>(props: P): React.ReactElement => {
    const {onOpen, openStoreKeys} = useSchemaInspector()
    const {schema, storeKeys, noGrid: noGridProp, isVirtual, Next} = props
    const {palette} = useTheme()

    const align = schema.getIn(['view', 'align'])
    const isOpen = openStoreKeys?.equals(storeKeys)
    const style: React.CSSProperties = React.useMemo(() => ({
        textAlign: align as React.CSSProperties['textAlign'],
    }), [align])

    // todo: support `hidden: true` for object type here? e.g. only available after if/else/then eval
    // todo: using `noGrid` may produce an empty `GridContainer` (when all props e.g. hidden/noGrid), can this be optimized?
    const noGrid = (noGridProp || isVirtual || schema.getIn(['view', 'noGrid']))
    const nestedNext = <Next.Component {...props}/>

    // @ts-ignore
    const WidgetOverride = props.WidgetOverride

    const onContextMenu = (evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        let match: WidgetMatch | Error | null = null
        try {
            match = matchWidget({
                schemaType: schema.get('type'),
                widgetName: schema.get('widget'),
                widgets: props.binding?.widgets,
            })
        } catch (e) {
            if (e instanceof ErrorNoWidgetMatches) {
                match = e
            } else {
                throw e
            }
        }
        onOpen?.({
            storeKeys: storeKeys,
            schema: schema,
            element: evt.currentTarget,
            WidgetOverride: WidgetOverride,
            matchedWidget: match,
        })
        // window.alert(`On Schema at ${JSON.stringify(props.storeKeys.toArray())}`)
    }

    const inspectorStyle = {
        outline: isOpen ? `4px dashed ${palette.info.main}` : undefined,
        outlineOffset: isOpen ? `-2px` : undefined,
        borderRadius: isOpen ? 4 : undefined,
    }

    if (noGrid) {
        // we need to wrap anything, even table cells, to wrap any schema layer with context menu event

        const isTableRow = WidgetOverride === TableRowRendererMemo
        if (isTableRow) {
            // can't wrap table row without breaking HTML
            return nestedNext
        }

        // note: this won't work in production build, due to mangled names, but can provide some insights when coding
        // console.log('prop', props.WidgetOverride, props.WidgetOverride?.displayName)

        return <Box
            style={inspectorStyle}
            onContextMenu={onOpen ? onContextMenu : undefined}
        >
            {nestedNext}
        </Box>
    }

    return <SchemaGridItem
        schema={schema}
        style={style}
        // onContextMenu={onContextMenu}
    >
        {/* need a nested box, for better styling, but also allows right click in nested areas which target the parent object layer */}
        <Box
            style={inspectorStyle}
            onContextMenu={onOpen ? onContextMenu : undefined}
        >
            {nestedNext}
        </Box>
    </SchemaGridItem>
}


const customWidgets: MuiBinding & {
    DndBlockSelector?: DragDropBlockComponentsBinding['DndBlockSelector']
} = {
    ...baseComponents,
    InfoRenderer: InfoRenderer,
    widgetPlugins: [
        DefaultHandler,
        schemaPluginsAdapterBuilder([
            validatorPlugin,
            requiredPlugin,
        ]),
        SchemaGridHandlerWithInspector,
        ValidityReporter,
    ],
    DndBlockSelector: DragDropBlockSelector,
    widgets: {
        ...typeWidgets,
        ...bindingExtended,
        SelectChips: SelectChips,
        Table: CustomTable,
        TableAdvanced: TableAdvanced,

        /*Color,
        ColorDialog,
        ColorStatic,
        ColorSwatches,
        ColorCircle,
        ColorCompact,
        ColorMaterial,
        ColorTwitter,
        ColorBlock,
        ColorSlider,
        ColorAlpha,
        ColorHue,
        ColorSketch,
        ColorSliderStatic,
        ColorCircleStatic,
        ColorTwitterStatic,
        ColorSketchStatic,
        ColorSketchDialog,
        Colorful: ColorfulHex,
        ColorfulHsla: ColorfulHsla,
        ColorfulRgba: ColorfulRgba,*/
        // Code: Loadable({
        //     loader: () => import('../CustomCodeWidgets').then(r => r.CustomWidgetCode),
        //     loading: () => <LoadingCircular title={'Loading Code Widget'}/>,
        // }),
        // CodeSelectable: Loadable({
        //     loader: () => import('../CustomCodeWidgets').then(r => r.CustomWidgetCodeSelectable),
        //     loading: () => <LoadingCircular title={'Loading Code Widget'}/>,
        // }),
        /*DateTime: Loadable({
            loader: () => import('@ui-schema/material-pickers').then(r => r.DateTimePicker),
            loading: () => <LoadingCircular title={'Loading DateTime Widget'}/>,
        }),
        Date: Loadable({
            loader: () => import('@ui-schema/material-pickers').then(r => r.DatePicker),
            loading: () => <LoadingCircular title={'Loading Date Widget'}/>,
        }),
        Time: Loadable({
            loader: () => import('@ui-schema/material-pickers').then(r => r.TimePicker),
            loading: () => <LoadingCircular title={'Loading Time Widget'}/>,
        }),*/
        // EditorJS: (props) => <Suspense>
        //     <LazyEditorJs {...props}/>
        // </Suspense>,
        //     Loadable({
        //     loader: () => import('./EditorJSComp').then(r => r.EditorJSComp),
        //     loading: () => <LoadingCircular title={'Loading EditorJS'}/>,
        // }),
        // SortableList: Loadable({
        //     loader: () => import('@ui-schema/material-dnd/Widgets/SortableList').then(r => r.SortableList),
        //     loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
        // }),
        // DragDropArea: Loadable({
        //     loader: () => import('@ui-schema/material-dnd/Widgets/DragDropArea').then(r => r.DragDropArea),
        //     loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
        // }),
        // DropArea: Loadable({
        //     loader: () => import('@ui-schema/material-dnd/Widgets/DropArea').then(r => r.DropArea),
        //     loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
        // }),
    },
}

export const uiMeta = {
    validate: Validator([
        ...standardValidators,
        requiredValidatorLegacy,
    ]).validate,
    binding: customWidgets,
    t: browserT,
}
