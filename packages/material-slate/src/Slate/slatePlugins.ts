import { ReactEditor } from 'slate-react'
import {
    SlatePlugin,
    ParagraphPlugin,
    HeadingPlugin,
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    ListPlugin,
    AlignPlugin,
    BlockquotePlugin,
    CodeBlockPlugin,
    ResetBlockTypePlugin, ResetBlockTypePluginOptions,
    TodoListPlugin,
    ExitBreakPlugin,
    withList,
    withCodeBlock,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
} from '@udecode/slate-plugins'
import { SlateHocType } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { headingTypes, pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { withShortcuts } from '@ui-schema/material-slate/Slate/withShortcuts'

const resetBlockTypesCommonRule = {
    types: ['blockquote', 'todo_li'],
    defaultType: 'p',
}

export const optionsResetBlockTypes: ResetBlockTypePluginOptions = {
    rules: [
        {
            ...resetBlockTypesCommonRule,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
        },
        {
            ...resetBlockTypesCommonRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
        },
    ],
}
export const slatePlugins: SlatePlugin[] = [
    ResetBlockTypePlugin(optionsResetBlockTypes),
    ParagraphPlugin(pluginOptions),
    HeadingPlugin(pluginOptions),
    BoldPlugin(pluginOptions), ItalicPlugin(pluginOptions), UnderlinePlugin(pluginOptions),
    ListPlugin(pluginOptions), TodoListPlugin(pluginOptions),
    AlignPlugin(pluginOptions), BlockquotePlugin(pluginOptions), CodeBlockPlugin(pluginOptions),
    ExitBreakPlugin({
        rules: [
            {
                hotkey: 'mod+enter',
            },
            {
                hotkey: 'mod+shift+enter',
                before: true,
            },
            {
                hotkey: 'enter',
                query: {
                    start: true,
                    end: true,
                    allow: headingTypes,
                },
            },
        ],
    }),
]

export const withPlugins: SlateHocType<ReactEditor>[] = [
    withList(pluginOptions),
    withCodeBlock(pluginOptions),
    withShortcuts,
]
