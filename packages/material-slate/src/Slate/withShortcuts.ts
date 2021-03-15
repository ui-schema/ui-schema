import {
    Editor,
    Transforms,
    Range,
    Point,
    Element as SlateElement,
} from 'slate'
import { ReactEditor } from 'slate-react'
import { BulletedListElement, SlateHocType } from '@ui-schema/material-slate/Slate/SlateRenderer'

const SHORTCUTS: { [k: string]: string } = {
    //'*': 'li',
    '-': 'li',
    '+': 'li',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six',
}

export const withShortcuts: SlateHocType<ReactEditor> = (editor) => {
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
            const beforeText = Editor.string(editor, range)
            const type = SHORTCUTS[beforeText]

            if (
                type &&
                // only apply shortcuts when not inside a li, as this may produce invalid data
                // @ts-ignore
                !(block && block[0].type === 'li')
            ) {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                const newProperties: Partial<SlateElement> = {
                    // @ts-ignore
                    type,
                }
                Transforms.setNodes(editor, newProperties, {
                    match: n => Editor.isBlock(editor, n),
                })

                if (type === 'li') {
                    const list: BulletedListElement = {
                        type: 'ul',
                        children: [],
                    }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            // @ts-ignore
                            n.type === 'li',
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
                    block.type !== 'p' &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        // @ts-ignore
                        type: 'p',
                    }
                    Transforms.setNodes(editor, newProperties)

                    // @ts-ignore
                    if (block.type === 'li') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                // @ts-ignore
                                n.type === 'ul',
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
