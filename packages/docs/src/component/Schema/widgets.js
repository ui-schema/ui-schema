import React from 'react';
import {Step, Stepper, widgets} from '@ui-schema/ds-material';
import Loadable from 'react-loadable';
import {
    Color, ColorDialog,
    ColorSwatches,
    ColorCircle, ColorCompact, ColorMaterial,
    ColorBlock, ColorTwitter, ColorSlider,
    ColorAlpha, ColorHue, ColorSketch,
    ColorSliderStatic, ColorStatic,
    ColorCircleStatic, ColorTwitterStatic,
    ColorSketchStatic, ColorSketchDialog,
} from '@ui-schema/material-color';
import {LoadingCircular} from '@control-ui/kit/Loading/LoadingCircular';
import {BlockPanel} from '@ui-schema/material-dnd/DraggableBlock/BlockPanel';
import {DroppableRootContent} from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent';
import {NumberRendererCell, StringRendererCell, TextRendererCell} from '@ui-schema/ds-material/Widgets/TextFieldCell';
import {Table} from '@ui-schema/ds-material/Widgets/Table';

const customWidgets = {...widgets};

customWidgets.DraggableBlock = BlockPanel
customWidgets.DroppableRootContent = DroppableRootContent

const CustomTable = ({widgets, ...props}) => {

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

customWidgets.custom = {
    ...widgets.custom,
    Stepper: Stepper,
    Step: Step,
    Table: CustomTable,
    Color,
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
    Code: Loadable({
        loader: () => import('@ui-schema/material-code').then(r => r.Code),
        loading: () => <LoadingCircular title={'Loading Code Widget'}/>,
    }),
    CodeSelectable: Loadable({
        loader: () => import('@ui-schema/material-code').then(r => r.CodeSelectable),
        loading: () => <LoadingCircular title={'Loading Code Widget'}/>,
    }),
    DateTime: Loadable({
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
    }),
    RichText: Loadable({
        loader: () => import('@ui-schema/material-richtext/RichText').then(r => r.RichText),
        loading: () => <LoadingCircular title={'Loading RichText Widget'}/>,
    }),
    RichTextInline: Loadable({
        loader: () => import('@ui-schema/material-richtext/RichTextInline').then(r => r.RichTextInline),
        loading: () => <LoadingCircular title={'Loading RichText Widget'}/>,
    }),
    EditorJS: Loadable({
        loader: () => import('./EditorJSComp').then(r => r.EditorJSComp),
        loading: () => <LoadingCircular title={'Loading EditorJS'}/>,
    }),
    SimpleDroppableRootMultiple: Loadable({
        loader: () => import('@ui-schema/material-rbd/Widgets/DroppableRootMultiple').then(r => r.DroppableRootMultiple),
        loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
    }),
    SimpleDroppableRootSingle: Loadable({
        loader: () => import('@ui-schema/material-rbd/Widgets/DroppableRootSingle').then(r => r.DroppableRootSingle),
        loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
    }),
    DroppableRootMultiple: Loadable({
        loader: () => import('@ui-schema/material-dnd/Widgets/DroppableRootMultiple').then(r => r.DroppableRootMultiple),
        loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
    }),
    DroppableRootSingle: Loadable({
        loader: () => import('@ui-schema/material-dnd/Widgets/DroppableRootSingle').then(r => r.DroppableRootSingle),
        loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
    }),
    DroppablePanel: Loadable({
        loader: () => import('@ui-schema/material-dnd/Widgets/DroppablePanel').then(r => r.DroppablePanel),
        loading: () => <LoadingCircular title={'Loading drag \'n drop'}/>,
    }),
};

export {customWidgets}
