import {
    Editor,
    Transforms,
    Range,
    Point,
    Element as SlateElement,
} from 'slate'
import { ReactEditor } from 'slate-react'
import { BulletedListElement, SlateHocType } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { CustomOptions } from '@ui-schema/material-slate/Slate/slatePlugins'
import { editorIsEnabled } from '@ui-schema/material-slate/Slate/editorIsEnabled'

const SHORTCUTS: { [k: string]: string } = {
    '-': pluginOptions.li.type,
    '+': pluginOptions.li.type,
    '1': pluginOptions.ol.type,
    '>': pluginOptions.blockquote.type,
    '#': pluginOptions.h1.type,
    '##': pluginOptions.h2.type,
    '###': pluginOptions.h3.type,
    '####': pluginOptions.h4.type,
    '#####': pluginOptions.h5.type,
    '######': pluginOptions.h6.type,
}

export const withShortcuts: (options: CustomOptions) => SlateHocType<ReactEditor> = (options) => (editor) => {
    if(options.onlyInline){
        return editor
    }
    const {deleteBackward, insertText} = editor

    editor.insertText = (text: string) => {
        const {selection} = editor

        if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const {anchor} = selection
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            })
            const path = block ? block[1] : []
            const start = Editor.start(editor, path)
            const range = {anchor, focus: start}
            let beforeText = Editor.string(editor, range)
            const dotPos = beforeText.indexOf('.')
            if (dotPos !== -1 && !isNaN(Number(beforeText.substr(0, dotPos)))) {
                beforeText = '1'
            }
            const type = SHORTCUTS[beforeText]

            if (
                type &&
                editorIsEnabled(options.enableOnly, type) &&
                // only apply shortcuts when not inside a li, as this may produce invalid data
                // @ts-ignore
                !(block && block[0].type === pluginOptions.li.type)
            ) {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                const newProperties: Partial<SlateElement> = {
                    // @ts-ignore
                    type: type === pluginOptions.ol.type ? pluginOptions.li.type : type,
                }
                Transforms.setNodes(editor, newProperties, {
                    match: n => Editor.isBlock(editor, n),
                })

                if (type === pluginOptions.ol.type) {
                    const list: BulletedListElement = {
                        type: pluginOptions.ol.type,
                        children: [],
                    }
                    // todo: here seems to be the `li` error, currently missing `ul` around `li`
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            // @ts-ignore
                            n.type === pluginOptions.li.type,
                    })
                } else if (type === pluginOptions.li.type) {
                    const list: BulletedListElement = {
                        type: pluginOptions.ul.type,
                        children: [],
                    }
                    // todo: here seems to be the `li` error, currently missing `ul` around `li`
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            // @ts-ignore
                            n.type === pluginOptions.li.type,
                    })
                }

                return
            }
        }

        insertText(text)
    }

    editor.deleteBackward = (...args) => {
        const {selection} = editor

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            })

            if (match) {
                const [block, path] = match
                const start = Editor.start(editor, path)
                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    // @ts-ignore
                    block.type !== pluginOptions.p.type &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        // @ts-ignore
                        type: pluginOptions.p.type,
                    }
                    Transforms.setNodes(editor, newProperties)

                    // @ts-ignore
                    if (block.type === pluginOptions.li.type) {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                (
                                    // @ts-ignore
                                    n.type === pluginOptions.ul.type ||
                                    // @ts-ignore
                                    n.type === pluginOptions.ol.type
                                ),
                            split: true,
                        })
                    }

                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}
