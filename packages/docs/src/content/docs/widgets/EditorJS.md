# EditorJS

Widget for rich-content / block-type inputs, design-system implementation with EditorJS.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `object`
- widget keyword:
    - `EditorJS`

## Design System

### Material-UI

Rich text editor based on DraftJS with the styles like any other Material-UI TextField.

> 🚧 Only a working basic integration at this point, not optimized for all tools/design

```bash
npm i --save @ui-schema/material-editorjs react-editor-js @editorjs/editorjs @editorjs/paragraph
```

- special keywords:
    - `view.dense` when `true` applies less margins
    - `view.hideTitle` when `true` doesn't show any title, also existing as prop `hideTitle` on `EditorJSWidget`

```jsx
import React from 'react';
import {widgets} from '@ui-schema/ds-material';
import {EditorJSWidget} from '@ui-schema/material-editorjs/Widgets/EditorJSWidget';
import Paragraph from '@editorjs/paragraph'

const tools = {paragraph: Paragraph};

// create wrapper component to supply your tools
const EditorJSRichContent = (props) => {
    return <EditorJSWidget
        {...props}
        tools={tools}
    />
}

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    EditorJS: EditorJSRichContent,
};
```
