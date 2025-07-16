# Code / Text with Syntax Highlighting

Widgets for code editing, design-system implementation.

[![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui)

>
> 🚧 (deprecated) docs for `<=v0.4.0-alpha.0` of `@ui-schema/material-code` for CodeMirror, see [Material: Code](/docs/material-code/material-code) and [Kit: CodeMirror](/docs/kit-codemirror/kit-codemirror) for replacements
>

- type: `string`, `array`
- widget keywords:
    - `Code` for single `format`
    - `CodeSelectable` for selectable `format` and data as `[format, code]` tuple
        - does not support `deleteOnEmpty`, workaround: `{"items": [ {"type": "string"}, {"type": "string", "minLength": "1", "default": ""}], }`
- `format` keyword to select the enabled language mode, `string` or `string[]`

## Design System

### Material-UI

Code editor with syntax highlighting using codemirror:

```bash
npm i --save @ui-schema/material-code react-codemirror2 codemirror
```

- special keywords:
    - `view.bg` when `true` it does not turn the background off
    - `view.hideTitle` when `true` it does not show the title, only the current format
- see [full list of modes in codemirror repo](https://github.com/codemirror/CodeMirror/tree/master/mode)
    - `css`, `htmlmixed`, `jsx`, `markdown`, `php`, `sass`, `shell`, `sql`, `yaml` and a lot more
- uses translations: `formats.<schema.format>` for nicer labels, check [examples in docs](https://github.com/ui-schema/ui-schema/blob/master/packages/dictionary/src/en/formats.js)

#### WidgetCodeProvider

Props:

- `modes`, mode mapping, where the `mode` key is accessed with `schema.format`
    - when not set, uses format directly
    - e.g. needed for JSON, not needed for CSS
    - [see codemirror docs](https://codemirror.net/doc/manual.html#option_mode)
- `theme` string id of the imported theme css
    - import the stylesheets like needed

Add needed modes in your app/script:

```js
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
// ... add further needed modes
```

#### Example

In this example, the CSS is loaded with `lazySingletonStyleTag`, to be able to inject/remove themes on theme switch and mount/dismount of the provider component. **This is sadly not possible with standard create-react-app**, there the CSS imports will be global.

```js
import React from 'react';

import {UIGenerator} from "@ui-schema/ui-schema";
import {WidgetCodeProvider, WidgetCodeContextType} from "@ui-schema/material-code";

import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";

import style from "codemirror/lib/codemirror.css";

import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';

import themeMaterial from 'codemirror/theme/material.css';
import theme3024Day from 'codemirror/theme/3024-day.css';
import theme3024Night from 'codemirror/theme/3024-night.css';
import themeBase16Dark from 'codemirror/theme/base16-dark.css';
import themeBase16Light from 'codemirror/theme/base16-light.css';
import themeDarcula from 'codemirror/theme/darcula.css';
// and more

const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use();
        return () => styles.unuse();
    }, [styles]);
};

// ! only supported since `0.3.0-next.0`
const modes: WidgetCodeContextType['modes'] = {
    json: {
        name: 'javascript',
        json: true,
    },
}

const StyledCodeEditor = props => {
    const {palette} = useTheme();

    useStyle(style);
    useStyle(palette.mode === 'dark' ? themeDark : themeLight);

    return <WidgetCodeProvider
        theme={palette.mode === 'dark' ? 'duotone-dark' : 'duotone-light'}
        // only supported since `0.3.0-next.0`
        modes={modes}
    >
        <UIGenerator {...props}/>
    </WidgetCodeProvider>
}

export {StyledCodeEditor}
```

Example webpack style-loader config for importing all css files from `node_modules` with `lazySingletonStyleTag`:

```js
const webpack = {
    modules: {
        rules: [
            {
                test: /\.css$/i,
                include: [/node_modules/],
                use: [
                    {loader: 'style-loader', options: {injectType: 'lazySingletonStyleTag'}},
                    'css-loader',
                ],
            },
        ]
    }
}
```
