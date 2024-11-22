import React from 'react'
import { EditorJSWidget } from '@ui-schema/material-editorjs/Widgets'
import Paragraph from '@editorjs/paragraph'
import CheckList from '@editorjs/checklist'
import List from '@editorjs/list'
import Header from '@editorjs/header'
import Table from '@editorjs/table'

const tools: any = {
    paragraph: Paragraph,
    checkList: CheckList,
    list: List,
    header: Header,
    table: Table,
}

export const EditorJSComp = (props: any = {}) => {
    return <EditorJSWidget
        {...props}
        tools={tools}
    />
}
