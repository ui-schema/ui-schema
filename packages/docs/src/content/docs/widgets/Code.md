# Code / Text with Syntax Highlighting

Widgets for code editing, design-system implementation.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `string`
- widget keywords:
    - `Code`
- `format` keyword is used to select which language
- todo: multiple languages need to be saved as object/array: content including the selected language
    
## Design System

### Material-UI

Code editor with syntax highlighting using codemirror:

```bash
npm i --save @ui-schema/material-code react-codemirror2 codemirror
```

- special keywords:
    - `view.bg` when `true` it does not turn the background off
- see [full list of modes in codemirror repo](https://github.com/codemirror/CodeMirror/tree/master/mode)
    - `css`, `htmlmixed`, `jsx`, `markdown`, `php`, `sass`, `shell`, `sql`, `yaml` and a lot more
- theming is optional but recommended, can be controlled from your app
    - import the stylesheets like needed
    - wrap all editor that should inherit the style with `WidgetCodeProvider` and pass down the string id of the theme

Add needed modes in your app/script:

```js
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
// ... add further needed modes
```

In this example we use the style-load with `lazySingletonStyleTag` to be able to inject/remove themes on theme switch and mount/dismount of the provider component:

```js
import React from 'react';

import {SchemaEditor} from "@ui-schema/ui-schema";
import {WidgetCodeProvider} from "@ui-schema/material-code";

import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";

import style from "codemirror/lib/codemirror.css";

import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';

import themeMaterial from 'codemirror/theme/material.css';
import theme3024Day from 'codemirror/theme/3024-day.css';
import theme3024Night from 'codemirror/theme/3024-night.css';
import themeBbase16Dark from 'codemirror/theme/base16-dark.css';
import themeBase16Light from 'codemirror/theme/base16-light.css';
import themeDarcula from 'codemirror/theme/darcula.css';
// and more

const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use();
        return () => styles.unuse();
    }, [styles]);
};

const StyledCodeEditor = props => {
    const {palette} = useTheme();

    useStyle(style);
    useStyle(palette.type === 'dark' ? themeDark : themeLight);

    return <WidgetCodeProvider theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'}>
        <SchemaEditor {...props}/>
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
