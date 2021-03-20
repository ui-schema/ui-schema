# Rich-Text

Widgets for rich-text inputs, design-system implementation.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `string`
- widget keywords:
    - `RichText`: only DraftJS, in future also for SlateJS
    - `RichTextInline`: only DraftJS, in future also for SlateJS
    - `RichContent`: only SlateJS
    - `RichContentInline`: only SlateJS

## Design System

### Material-UI w/ SlateJS

> 🚧 Work in progress, only basic integration atm.

Rich text editor based on [SlateJS](https://www.slatejs.org/) with the styles like any other Material-UI TextField.

- toolbar for selecting styles like headlines, lists, blog
- markdown syntax support for shortcuts while writing
- own types of rich content inputs with native React components

```bash
npm i --save @ui-schema/material-slate slate-react slate-history slate-hyperscript styled-components @udecode/slate-plugins
```

### Material-UI w/ DraftJS

Rich text editor based on [DraftJS](https://draftjs.org/) with the styles like any other Material-UI TextField.

- toolbar for selecting styles like headlines, lists, blog
- markdown syntax support to automatic transform markdown input into rich-text

> ℹ️ as DraftJS seems to be abandoned / without active development, it is recommended to use the SlateJS integration

```bash
npm i --save @ui-schema/material-richtext draft-js draft-js-plugins-editor
```

- special keywords:
    - `view.topControls` when `false` the control buttons are visible below the input, always on instead of only when focused
    - `view.dense` when `true` applies less margins
    - `view.btnSize` when `medium` applies a slightly bigger font-size (but not the normal mui `medium` font-size)
- only for `RichText` (currently):
    - `view.hideMd` when `true` does not show the markdown label
- todo: content is not really mui-style
