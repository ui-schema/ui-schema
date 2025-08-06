<p align="center">
  <a href="https://ui-schema.bemit.codes" rel="noopener noreferrer" target="_blank"><img width="125" src="https://ui-schema.bemit.codes/logo.svg" alt="UI Schema Logo"></a>
</p>

<h1 align="center">UI Schema</h1>

Generate forms and UIs from JSON Schema. Use the headless React components to create powerful schema-driven apps, compatible with any design system. Get started quickly with [Material UI React](https://ui-schema.bemit.codes/quick-start?ds=mui) or [Bootstrap](https://ui-schema.bemit.codes/quick-start?ds=bts) and easily create your own widgets and plugins.

Create smart apps faster, with less code — thanks to auto-generated UIs, built-in validation, and easy customization.

> [!CAUTION]
>
> You're **exploring the [*next* version](https://github.com/ui-schema/ui-schema/discussions/184#discussioncomment-3100010)**! If you spot odd behaviour or have feedback, please [open an issue](https://github.com/ui-schema/ui-schema/issues/new?template=bug.md&title=0.5.x%40next%20Bug%20&labels=bug&type=bug).
>
> The **published documentation is still for version 0.4.x**. The new documentation for 0.5.x is not yet complete. However, the repository includes [a basic migration guide from 0.4.x to 0.5.x](./packages/docs/src/content/updates/v0.4.0-v0.5.0.md), and the [example code below is updated for 0.5.x](#example-ui-schema). You can [preview the new documentation locally](./CONTRIBUTING.md#documentation-app) by setting up the repository.
>
> To use the `next` version you must specify the exact version or use `@ui-schema/ui-schema@next` during installation.

[![Github actions Build](https://github.com/ui-schema/ui-schema/actions/workflows/blank.yml/badge.svg)](https://github.com/ui-schema/ui-schema/actions)
[![react compatibility](https://img.shields.io/badge/React-18,%2019-success?style=flat-square&logo=react)](https://reactjs.org/)
[![MIT license](https://img.shields.io/npm/l/@ui-schema/ui-schema?style=flat-square)](https://github.com/ui-schema/ui-schema/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Coverage Status](https://img.shields.io/codecov/c/github/ui-schema/ui-schema/master.svg?style=flat-square)](https://codecov.io/gh/ui-schema/ui-schema/branch/master)
![Typed](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

- @ui-schema/ui-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema)
- @ui-schema/react [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/react?style=flat-square)](https://www.npmjs.com/package/@ui-schema/react)
- @ui-schema/json-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/json-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/json-schema)
- @ui-schema/json-pointer [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/json-pointer?style=flat-square)](https://www.npmjs.com/package/@ui-schema/json-pointer)
- @ui-schema/ds-material [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-material)
- @ui-schema/ds-bootstrap [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-bootstrap?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-bootstrap)
- @ui-schema/pro [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/pro?style=flat-square)](https://www.npmjs.com/package/@ui-schema/pro)
- @ui-schema/dictionary [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/dictionary?style=flat-square)](https://www.npmjs.com/package/@ui-schema/dictionary)

- Additional Material-UI Widgets:
    - Date-Time Picker: `@ui-schema/material-pickers` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-pickers?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-pickers) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://ui-schema.bemit.codes/docs/material-pickers/Overview)
    - Codemirror as Material Input: `@ui-schema/material-code` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-code?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-code) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://ui-schema.bemit.codes/docs/material-code/material-code) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-codemirror/tree/main/packages/material-code)
    - `react-color` picker: `@ui-schema/material-color` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-color?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-color) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://ui-schema.bemit.codes/docs/material-color/material-color) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-color/tree/main/packages/material-color)
    - `react-colorful` picker: `@ui-schema/material-colorful` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-colorful?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-colorful) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://ui-schema.bemit.codes/docs/material-colorful/material-colorful) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-color/tree/main/packages/material-colorful)
    - 🚧 Drag 'n Drop with `react-dnd`: `@ui-schema/material-dnd` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-dnd?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-dnd) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://ui-schema.bemit.codes/docs/material-dnd/overview)
- Additional Packages, not only for UI Schema:
    - CodeMirror v6 kit: `@ui-schema/kit-codemirror` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/kit-codemirror?style=flat-square)](https://www.npmjs.com/package/@ui-schema/kit-codemirror) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=0a6e8a&color=61dafb&logoColor=ffffff&style=flat-square&logo=react)](https://ui-schema.bemit.codes/docs/kit-codemirror/kit-codemirror) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-codemirror/tree/main/packages/kit-codemirror)
    - 🚧 Drag 'n Drop kit: `@ui-schema/kit-dnd` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/kit-dnd?style=flat-square)](https://www.npmjs.com/package/@ui-schema/kit-dnd) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=0a6e8a&color=61dafb&logoColor=ffffff&style=flat-square&logo=react)](https://ui-schema.bemit.codes/docs/kit-dnd/kit-dnd)

## Get Started

- [Quick-Start](https://ui-schema.bemit.codes/quick-start)
- [Schema Examples + Live Editor](https://ui-schema.bemit.codes/examples)
- [Demo App: UI Schema + Material Design](https://github.com/ui-schema/demo-cra)
    - [CodeSandbox](https://codesandbox.io/s/github/ui-schema/demo-cra/tree/master/?autoresize=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2FSchema%2FDemoEditor.js) | [StackBlitz](https://stackblitz.com/github/ui-schema/demo-cra)
- [Documentation](https://ui-schema.bemit.codes)
- [Get Help on Discord](https://discord.gg/MAjgpwnm36)

## Schema

Use JSON Schema to validate data and automatically create UIs with it - UI-Schema makes it easy to write widgets based on schema structures, use custom UI keywords to make it look great!

*[Schema Documentation](https://ui-schema.bemit.codes/docs/schema)*

## Features

- add any design-system or custom widget
    - easily create isolated and atomic widgets, with autowired data and validations
    - customize design system behaviour with e.g. widget compositions
    - easy binding of own design systems and custom widgets
    - easily add advanced features like [read-or-write mode](https://ui-schema.bemit.codes/docs/react/meta#read-context)
- [auto-rendering by data & schema](https://ui-schema.bemit.codes/quick-start) or [full-custom forms](https://ui-schema.bemit.codes/quick-start?render=custom) with autowired widgets
- flexible translation of widgets
    - with any library ([`t` prop (Translator)](https://ui-schema.bemit.codes/docs/localization#translation), [`Translate`/`TranslateTitle` components](https://ui-schema.bemit.codes/docs/localization#trans-component))
    - in-schema translations ([`t` keyword](https://ui-schema.bemit.codes/docs/localization#translation-in-schema))
    - label text transforms ([`tt`/`ttEnum` keyword](https://ui-schema.bemit.codes/docs/localization#text-transform))
    - single or multi-language
    - for labels, titles, errors, icons...
    - (optional) [tiny integrated translation library](https://ui-schema.bemit.codes/docs/localization#immutable-as-dictionary)
    - (optional) [translation dictionaries](./packages/dictionary)
- modular, extensible and slim core
    - add own [plugins](https://ui-schema.bemit.codes/docs/react/widgetengine)
    - add own validators
    - add own base renderers
    - add own widget matchers & render strategies
    - use what you need
- [performance optimized](https://ui-schema.bemit.codes/docs/performance), only updates HTML which must re-render, perfect for big schemas
- code-splitting, with custom widget mappings / lazy-loading widgets
- includes helper functions for store and immutable handling
- easy nesting for custom object/array widgets with [`WidgetEngine`](https://ui-schema.bemit.codes/docs/react/widgetengine)
- validate hidden/auto-generated values, virtualize schema levels ([`hidden` keyword](https://ui-schema.bemit.codes/docs/schema#hidden-keyword--virtualization))
- handle store update from anywhere and however you want
- extensive documentations of core, widgets
- typed components and definitions for JSON Schema and UI Schema
- complex conditionals schemas
- loading / referencing schemas by URL, connect any API or e.g. babel dynamic loading instead
- definitions and JSON-Pointer references in schemas
- JSON Schema extension: UI Schema, change design and even behaviour of widgets
- **JSON Schema versions** supported: Draft 2019-09 / Draft-08, Draft-07, Draft-06, Draft-04

*[Design-System and Widgets Overview](https://ui-schema.bemit.codes/docs/overview)*

## Versions

This project adheres to [semver](https://semver.org/), until `1.0.0` and beginning with `0.1.0`: all `0.x.0` releases are like MAJOR releases and all `0.0.x` like MINOR or PATCH, modules below `0.1.0` should be considered experimental.

**Get the latest version - or [help build it](CONTRIBUTING.md):**

- [latest releases](https://github.com/ui-schema/ui-schema/releases) (GitHub release notes)
- [update and migration notes](https://ui-schema.bemit.codes/updates) (docs page)
- [current roadmap](https://github.com/ui-schema/ui-schema/discussions/184) (GitHub discussion)

## Example UI Schema

First time? [Take the quick-start](https://ui-schema.bemit.codes/quick-start) or take a look into the MUI demo repos: [create-react-app & JS (simple)](https://github.com/ui-schema/demo-cra) or [create-react-app & Typescript (advanced)](https://github.com/ui-schema/demo-cra-ts).

Example setup of the React engine, followed by a [simple text widget](#example-simple-text-widget) - with @mui as design system.

If you haven’t already [set up @mui](https://mui.com/getting-started/installation/), install it first; then install the @ui-schema dependencies:

```shell
npm i --save @ui-schema/ui-schema@next @ui-schema/json-schema@next @ui-schema/json-pointer@next @ui-schema/ds-material@next
```

Then add the example code:

```js
import React from 'react';
// Import UI providers and render engine, adapters
import { UIStoreProvider, createStore } from '@ui-schema/react/UIStore';
import { storeUpdater } from '@ui-schema/react/storeUpdater';
import { UIMetaProvider, useUIMeta } from '@ui-schema/react/UIMeta';
import { WidgetEngine } from '@ui-schema/react/WidgetEngine';
import { DefaultHandler } from '@ui-schema/react/DefaultHandler';
import { ValidityReporter } from '@ui-schema/react/ValidityReporter';
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter';
import { isInvalid } from '@ui-schema/react/isInvalid';
import { createOrderedMap } from '@ui-schema/ui-schema/createMap';
import { keysToName } from '@ui-schema/ui-schema/Utils/keysToName';
// basic in-schema translator / `t` keyword support
import { translatorRelative } from '@ui-schema/ui-schema/TranslatorRelative';
// Validator engine, validators and adapter plugin to react
import { Validator } from '@ui-schema/json-schema/Validator';
import { standardValidators } from '@ui-schema/json-schema/StandardValidators';
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy';
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin';
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin';
// Get the widgets binding for your design-system
// import type { MuiBinding } from '@ui-schema/ds-material/BindingType';
import { bindingComponents } from '@ui-schema/ds-material/Binding/Components'
import { widgetsDefault } from '@ui-schema/ds-material/Binding/WidgetsDefault';
import { widgetsExtended } from '@ui-schema/ds-material/Binding/WidgetsExtended';
import { GridContainer } from '@ui-schema/ds-material/GridContainer';
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'; // MUI v5/v6
// import { GridItemPlugin } from '@ui-schema/ds-material/GridItemPlugin'; // MUI v7
import Button from '@mui/material/Button';

// could be fetched from some API or bundled with the app
const schemaBase = {
    type: 'object',
    properties: {
        country: {
            type: 'string',
            widget: 'Select',
            enum: [
                'mx',
                'my',
                'fj',
            ],
            default: 'fj',
            ttEnum: 'upper',
        },
        name: {
            type: 'string',
            maxLength: 20,
        },
    },
    required: [
        'country',
        'name',
    ],
};

// or fetch from API
const data = {};

export const DemoForm = () => {
    // optional state for display errors/validity
    const [showValidity, setShowValidity] = React.useState(false);

    // needed variables and setters for the render engine, create wherever you like
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(data)));
    const [schema/*, setSchema*/] = React.useState(() => createOrderedMap(schemaBase));

    // `useUIMeta` can be used safely, without performance impact (while `useUIStore` impacts performance)
    const {t} = useUIMeta()

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity={showValidity}
        >
            <GridContainer>
                <WidgetEngine isRoot schema={schema}/>
            </GridContainer>
        </UIStoreProvider>

        <Button
            /* show the validity only at submit (or pass `true` to `showValidity`) */
            onClick={() => {
                if(isInvalid(store.getValidity())) {
                    setShowValidity(true)
                    return
                }
                console.log('doingSomeAction:', store.valuesToJS())
            }}
        >
            submit
        </Button>
    </>
};

/**
 * @type {MuiBinding}
 */
const customBinding = {
    ...bindingComponents,

    // Widget mapping by schema type or custom ID.
    widgets: {
        ...widgetsDefault,
        ...widgetsExtended,
    },

    // Plugins that wrap each rendered widget.
    widgetPlugins: [
        DefaultHandler, // handles `default` keyword

        // Runs SchemaPlugins, connects to SchemaResource (if enabled)
        schemaPluginsAdapterBuilder([
            // runs `validate` and related schema postprocessing
            validatorPlugin,

            // injects the `required` prop
            requiredPlugin,
        ]),

        SchemaGridHandler, // MUI v5/6 Grid item
        // GridItemPlugin, // MUI v7 Grid item

        ValidityReporter, // keeps `valid`/`errors` in sync with `store`
    ],
};

const validator = Validator([
    ...standardValidators,
    requiredValidatorLegacy, // opinionated validator, HTML-like, empty-string = invalid
])
const validate = validator.validate

export default function App() {
    return <UIMetaProvider
        // the components and widgets bindings for the app
        binding={customBinding}

        // optional, needed for any validation based plugin
        validate={validate}

        // optional, generate labels, error messages,
        // support embedded translations
        t={translatorRelative}

        // optional, enable `name` attribute generation
        keysToName={keysToName}

        // never pass down functions like this - always use e.g. `React.useCallback`
        // or use functions defined outside rendering, check performance docs for more
        //t={(text, context, schema) => {/* add translations */}}
    >
        {/*
          * Use one UIMetaProvider with multiple forms.
          * it's possible to nest `UIMetaProvider` if you need to have different `binding`,
          * e.g. depending on some lazy loaded component tree
          */}
        <DemoForm/>
    </UIMetaProvider>
}
```

> Instead of using a `WidgetEngine` at root level (automatic rendering of full schema), it's also possible to use [full custom rendering](https://ui-schema.bemit.codes/quick-start?render=custom).

## Example Simple Text Widget

Easily create new widgets, this is all for a simple text (`type=string`) widget:

```typescript jsx
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps } from '@ui-schema/react/Widget'

const Widget = (
    {
        value, storeKeys, onChange, keysToName,
        required, schema,
        errors, valid,
    }: WidgetProps,
) => {
    // as any value could come in, from e.g. remote sources,
    // typeguard `value` for the actual input you implement
    const inputValue = typeof value === 'string' || typeof value === 'number' ? value : ''
    return <>
        <label>
            <span><TranslateTitle schema={schema} storeKeys={storeKeys}/></span>

            <input
                type={'text'}
                required={required}
                name={keysToName?.(storeKeys)}
                value={inputValue}
                onChange={(e) => {
                    onChange({
                        storeKeys,
                        scopes: ['value'],
                        // or use another StoreAction like `update`
                        type: 'set',
                        data: {
                            value: e.target.value,
                            //internalValue: undefined
                            //valid: undefined
                        },
                        schema,
                        required,
                    })
                }}
            />
        </label>
    </>
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Released under the [MIT License](LICENSE).
