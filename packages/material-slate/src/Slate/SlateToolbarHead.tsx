import React, { FocusEventHandler } from 'react'
import IcAlignCenter from '@mui/icons-material/FormatAlignCenter'
import IcAlignLeft from '@mui/icons-material/FormatAlignLeft'
import IcAlignRight from '@mui/icons-material/FormatAlignRight'
import IcAlignJustify from '@mui/icons-material/FormatAlignJustify'
import IcCode from '@mui/icons-material/Code'
import IcQuote from '@mui/icons-material/FormatQuote'
import IcListNumbered from '@mui/icons-material/FormatListNumbered'
import IcListBulleted from '@mui/icons-material/FormatListBulleted'
import IcListTodo from '@mui/icons-material/BallotOutlined'
import {
    HeadingToolbar,
} from '@udecode/slate-plugins'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { ToolbarAlign, ToolbarCodeBlock, ToolbarElement, ToolbarList } from '@ui-schema/material-slate/Slate/SlateToolbarButtons'
import { editorEnableOnly } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { editorIsEnabled } from '@ui-schema/material-slate/Slate/editorIsEnabled'

export const SlateToolbarHead: React.ComponentType<{
    enableOnly?: editorEnableOnly
    onlyInline?: boolean
    onFocus: FocusEventHandler
    onBlur: FocusEventHandler
}> = (
    {
        enableOnly,
        onlyInline,
        onBlur,
        onFocus,
    }
) => {
    return <HeadingToolbar>
        {!onlyInline && editorIsEnabled(enableOnly, pluginOptions.ul.type) &&
        <ToolbarList
            {...pluginOptions}
            type={pluginOptions.ul.type}
            icon={<IcListBulleted/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}
        {!onlyInline && editorIsEnabled(enableOnly, pluginOptions.ol.type) &&
        <ToolbarList
            {...pluginOptions}
            type={pluginOptions.ol.type}
            icon={<IcListNumbered/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}
        {!onlyInline && editorIsEnabled(enableOnly, pluginOptions.todo_li.type) &&
        <ToolbarElement
            type={pluginOptions.todo_li.type}
            icon={<IcListTodo/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}

        {!onlyInline && editorIsEnabled(enableOnly, pluginOptions.blockquote.type) &&
        <ToolbarElement
            type={pluginOptions.blockquote.type}
            icon={<IcQuote/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}

        {!onlyInline && editorIsEnabled(enableOnly, pluginOptions.code_block.type) &&
        <ToolbarCodeBlock
            type={pluginOptions.code_block.type}
            icon={<IcCode/>}
            options={pluginOptions}
            onFocus={onFocus}
            onBlur={onBlur}
        />}

        {editorIsEnabled(enableOnly, pluginOptions.align_center.type) ||
        editorIsEnabled(enableOnly, pluginOptions.align_right.type) ||
        editorIsEnabled(enableOnly, pluginOptions.align_justify.type) ?
            <ToolbarAlign
                icon={<IcAlignLeft/>}
                type={''}
                onFocus={onFocus}
                onBlur={onBlur}
            /> : null}
        {editorIsEnabled(enableOnly, pluginOptions.align_center.type) &&
        <ToolbarAlign
            type={pluginOptions.align_center.type}
            icon={<IcAlignCenter/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}
        {editorIsEnabled(enableOnly, pluginOptions.align_right.type) &&
        <ToolbarAlign
            type={pluginOptions.align_right.type}
            icon={<IcAlignRight/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}
        {editorIsEnabled(enableOnly, pluginOptions.align_justify.type) &&
        <ToolbarAlign
            type={pluginOptions.align_justify.type}
            icon={<IcAlignJustify/>}
            onFocus={onFocus}
            onBlur={onBlur}
        />}
    </HeadingToolbar>
}
