import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { define, widgetsCustom, widgetsTypes } from '@ui-schema/ds-material/WidgetsDefault'
import { requiredValidator } from '@ui-schema/json-schema/Validators'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd'
import { CombiningHandler, ConditionalHandler, DefaultHandler, DependentHandler, ReferencingHandler } from '@ui-schema/react-json-schema'
import { validatorPlugin } from '@ui-schema/react-json-schema/ValidatorPlugin'
import { SchemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { WidgetProps } from '@ui-schema/react/Widgets'
import React, { lazy, Suspense } from 'react'
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
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets'
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

const CustomTable = ({widgets, ...props}: WidgetProps) => {

    // dynamic overwrite for all widgets, which need a special TableCell formatting
    // you can also only enable specific widgets here
    const customWidgets = React.useMemo(() => ({
        ...widgets,
        types: {
            ...widgets.types,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
        },
        custom: {
            ...widgets.custom,
            Text: TextRendererCell,
        },
    }), [widgets])

    return <Table
        {...props}
        widgets={customWidgets}
    />
}

export const customWidgets = define<{
    InfoRenderer?: React.ComponentType<InfoRendererProps>
    DndBlockSelector?: DragDropBlockComponentsBinding['DndBlockSelector']
}, {}>({
    InfoRenderer: InfoRenderer,
    widgetPlugins: [
        ReferencingHandler,// must be before AND maybe after combining/conditional?
        SchemaGridHandler,// todo: Grid must be after e.g. ConditionalHandler, but why was it this high? wasn't that because of e.g. conditional object grids?
        // ExtractStorePlugin,
        CombiningHandler,
        DefaultHandler,
        DependentHandler,
        ConditionalHandler,
        SchemaPluginsAdapterBuilder([
            validatorPlugin,
            requiredValidator,// must be after validator; todo: remove the compat. plugin
        ]),
        ValidityReporter,
        WidgetRenderer,
    ],
    DndBlockSelector: DragDropBlockSelector,
    types: widgetsTypes(),
    custom: {
        ...widgetsCustom(),
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
        EditorJS: (props) => <Suspense>
            <LazyEditorJs {...props}/>
        </Suspense>,
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
})

const LazyEditorJs = lazy(() => import('./EditorJSComp').then(r => ({default: r.EditorJSComp})))

export const uiMeta = {
    validate: Validator(standardValidators).validate,
    widgets: customWidgets,
    t: browserT,
}
