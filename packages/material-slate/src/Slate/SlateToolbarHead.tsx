import React from 'react'
import IcAlignCenter from '@material-ui/icons/FormatAlignCenter'
import IcAlignLeft from '@material-ui/icons/FormatAlignLeft'
import IcAlignRight from '@material-ui/icons/FormatAlignRight'
import IcAlignJustify from '@material-ui/icons/FormatAlignJustify'
import IcCode from '@material-ui/icons/Code'
import IcQuote from '@material-ui/icons/FormatQuote'
import IcListNumbered from '@material-ui/icons/FormatListNumbered'
import IcListBulleted from '@material-ui/icons/FormatListBulleted'
import IcListTodo from '@material-ui/icons/BallotOutlined'
import {
    HeadingToolbar,
    ToolbarAlign,
    ToolbarElement,
    ToolbarCodeBlock,
    ToolbarList,
} from '@udecode/slate-plugins'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'

export const SlateToolbarHead: React.ComponentType<{}> = () => {
    return <HeadingToolbar>
        <ToolbarList
            {...pluginOptions}
            typeList={pluginOptions.ul.type}
            icon={<IcListBulleted/>}
        />
        <ToolbarList
            {...pluginOptions}
            typeList={pluginOptions.ol.type}
            icon={<IcListNumbered/>}
        />
        <ToolbarElement
            type={pluginOptions.todo_li.type}
            icon={<IcListTodo/>}
        />

        <ToolbarElement
            type={pluginOptions.blockquote.type}
            icon={<IcQuote/>}
        />
        <ToolbarCodeBlock
            type={pluginOptions.code_block.type}
            icon={<IcCode/>}
            //options={options}
        />

        <ToolbarAlign icon={<IcAlignLeft/>}/>
        <ToolbarAlign
            type={pluginOptions.align_center.type}
            icon={<IcAlignCenter/>}
        />
        <ToolbarAlign
            type={pluginOptions.align_right.type}
            icon={<IcAlignRight/>}
        />
        <ToolbarAlign
            type={pluginOptions.align_justify.type}
            icon={<IcAlignJustify/>}
        />
    </HeadingToolbar>
}
