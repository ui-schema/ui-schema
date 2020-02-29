# Rich-Text

Widgets for rich-text inputs, design-system implementation.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `string`
- widget keywords:
    - `RichText`
    - `RichTextInline`

## Design System

### Material-UI

Rich text editor based on DraftJS with the styles like any other Material-UI TextField.

- toolbar for selecting styles like headlines, lists, blog
- markdown syntax support to automatic transform markdown input into rich-text


```bash
npm i --save @ui-schema/material-richtext  draft-js draft-js-plugins-editor
```

- special keywords:
    - `view.topControls` when `false` the control buttons are visible below the input, always on instead of only when focused
    - `view.dense` when `true` applies less margins
    - `view.btnSize` when `medium` applies a slightly bigger font-size (but not the normal mui `medium` font-size)
- only for `RichText` (currently):
    - `view.hideMd` when `true` does not show the markdown label
- todo: content is not really mui-style
