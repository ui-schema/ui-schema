# Rich-Text & Rich-Content

Widgets for rich-text and rich-content inputs, design-system implementation.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- types: `string`, `array`
- widget keywords:
    - `RichText`: only DraftJS, in future also for SlateJS
    - `RichTextInline`: only DraftJS, in future also for SlateJS
    - `RichContent`: only SlateJS
    - `RichContentInline`: only SlateJS (very experimental)
    - `RichContentPane`: only SlateJS, for a more typical editor without looking like a typical text input, without title/label

## Design System

### Material-UI w/ SlateJS

> 🚧 Work in progress, only basic integration atm.
>
> Some aria labels will stay hardcoded in english until UIMetaProvider [is optimized](https://github.com/ui-schema/ui-schema/issues/80)

Rich text editor based on [SlateJS](https://www.slatejs.org/) with the styles like any other Material-UI TextField.

- toolbar for selecting styles like headlines, lists, blog
- markdown syntax shortcuts while writing
    - headline (`#` to `######`)
    - *buggy* lists:
        - bullet lists: `ul` (`*`, `-`)
        - numbered lists: `ol` (any `number.`, like `1.`, `2.`)
    - blockquotes (`>`)
- own types of rich content inputs with native React components
- keyboard shortcuts (current default, may change)
    - cross-platform
        - `MOD` = `CTRL` on Windows or `CMD` on Mac
        - `OPT` = `ALT` on Windows or `OPTIONS` on Mac
    - formats:
        - format bold: `MOD + B`
        - format italic: `MOD + I`
        - format underline: `MOD + U`
        - format strikethrough: `MOD + OPT + S`
        - subscript: `MOD + ,`
        - superscript: `MOD + .`
    - elements:
        - headlines 1 to 6: `MOD + SHIFT + 1` = `h1` ... `MOD + SHIFT + 6` = `h6`
        - blockquote: `MOD + SHIFT + .`
        - block code: `MOD + OPT + B` or `MOD + SHIFT + B`
        - inline code: `MOD + E`
        - action item / todo list: `MOD + SHIFT + I`
        - paragraph `MOD + OPT + 0` or `MOD + SHIFT + 0`

Supports extra keywords:

- `view`:
    - `view.dense` when `true` applies less margins (only `RichContent`, `RichContentInline`)
    - `view.hideTitle` when `true` doesn't show the title (only `RichContent`, `RichContentInline`)
    - `view.noUnderline` when `true` doesn't show the input underline (only `RichContent`, `RichContentInline`)
    - `view.hideMd`: when `true` doesn't show the markdown label
    - `view.linkMd`: absolute url to some markdown examples, target of the markdown label, defaults to [this cheatsheet]('https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet')
    - `view.enableKeyMd`: when `true` the user can reach the markdown label by keyboard/tabulator
- `editor`
    - `editor.placeholder`: single language placeholder, when set turns of the editor label (todo: multi language support)
    - `editor.spellCheck`: when `true` enables browser spellcheck
    - `editor.autoFocus`: when `true` autofocus the input, **not recommended**
    - `editor.enableOnly`: optional array of blocks, marks, formats etc. enabled, when not set enables all available
        - notice: when enabling `ul` or `ol`, also `li` must be enabled
        - *todo:* doesn't forbid keyboard shortcuts atm.
    - `editor.initialRoot`: optional string of the default root block, defaults to `p`
    - `editor.hideToolbar`: when `true` doesn't show the header toolbar
    - `editor.hideBalloon`: when `true` doesn't show the balloon toolbar

```bash
npm i --save @ui-schema/material-slate @material-ui/lab slate slate-react slate-history slate-hyperscript styled-components @udecode/slate-plugins
```

> needs ~0.60 of slate packages and ~0.75 of @udecode/slate-plugins

#### SlateJS Schema Examples

```js
const schema = {
    type: 'array',
    widget: 'RichContent',
    editor: {
        placeholder: 'Write something great!',
    },
    view: {
        hideMd: true,
    },
}
```

```js
const schema = {
    type: 'array',
    widget: 'RichContent',
    editor: {
        spellCheck: true,
        enableOnly: [
            'p',
            'h1',
            'h2',
            'h3',
            'bold',
        ],
        initialRoot: 'h1',
    },
    view: {
        noUnderline: true,
        linkMd: 'https://example.org/markdown',
        enableKeyMd: true,
    },
}
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
