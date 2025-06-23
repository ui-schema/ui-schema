import { MuiWidgetsBinding } from '@ui-schema/ds-material'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd'
import { DefaultHandler } from '@ui-schema/react-json-schema'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react-json-schema/SchemaPluginsAdapter'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { WidgetProps } from '@ui-schema/react/Widgets'
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
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { DragDropBlockSelector } from '@ui-schema/material-dnd/DragDropBlockSelector'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets'
import { useMemo } from 'react'
import { browserT } from '../../t'
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

const CustomTable = ({binding, ...props}: WidgetProps) => {

    // dynamic overwrite for all widgets, which need a special TableCell formatting
    // you can also only enable specific widgets here
    const customWidgets = useMemo(() => ({
        ...binding,
        widgets: {
            ...binding?.widgets,
            types: {
                ...binding?.widgets?.types,
                string: StringRendererCell,
                number: NumberRendererCell,
                integer: NumberRendererCell,
            },
            custom: {
                ...binding?.widgets?.custom,
                Text: TextRendererCell,
            },
        },
    }), [binding])

    return <Table
        {...props}
        binding={customWidgets}
    />
}

const customWidgets: MuiWidgetsBinding & {
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
        SchemaGridHandler,
        ValidityReporter,
        WidgetRenderer,
    ],
    DndBlockSelector: DragDropBlockSelector,
    widgets: {
        types: typeWidgets,
        custom: {
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
