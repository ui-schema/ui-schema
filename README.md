# UI-Schema

JSON-Schema form + ui generator for any design system, first-class support for [Material UI React](https://material-ui.com).

[![Travis (.org) branch](https://img.shields.io/travis/ui-schema/ui-schema/master?style=flat-square)](https://travis-ci.org/ui-schema/ui-schema) [![react compatibility](https://img.shields.io/badge/React-%3E%3D16.8-success?style=flat-square&logo=react)](https://reactjs.org/)

- @ui-schema/ui-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema) 
- @ui-schema/ds-material [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-material)

>
> ⚠️Work in progress!
>
> UI-Schema is an extract and rewrite of the form-generator logic used internally by our admin panel. --> maybe: read, write, update, delete?
> 
> The fundamentals are working, but a lot of JSON-schema stuff, code testing and widgets needs to be done.
>
> This readme currently serves as a mix of documentation, completion tracking and big-picture.
>

Simplified example:

```js
import React from "react";
import {SchemaEditor, isInvalid} from "@ui-schema/ui-schema";
import {widgets} from "@ui-schema/ds-material";
import {ImmutableEditor, themeMaterial} from 'react-immutable-editor';

const SchemaDebug = ({setSchema}) => {
     const {store, schema, onChange} = useSchemaData();

    return <React.Fragment>
        <ImmutableEditor
            data={store}
            onChange={(keys, value) => onChange(store.setIn(keys, value))}
            getVal={keys => store.getIn(keys)}
            theme={themeMaterial}
        />
        <ImmutableEditor
            data={schema} onChange={setSchema} getVal={keys => schema.getIn(keys)}
            theme={themeMaterial}/>
    </React.Fragment>
};

const schema1 = {};// todo: add schema w/ existing data example
const data1 = {};

const Editor = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(createMap());
    const [data, setData] = React.useState(createOrderedMap(data1));
    const [schema, setSchema] = React.useState(createOrderedMap(schema1));
    
    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={data}
            onChange={setData}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}

            {/* or write onChange / onValidity like: */}
            onChange={handler => setData(handler(data))}
            {/* handler must get the previous state as value, it must be an immutable map, will return updated map */}
            onValidity={handler => setValidity(handler(validity))}
        >
            <SchemaDebug setSchema={setSchema}/>
        </SchemaEditor>
       <button onClick={() => isInvalid(validity) ? setShowValidity(true) : doingSomeAction()}>send!</button>
    </div>
};

export {Editor}
```

## Schema

JSON-Schema included keywords are used to describe the data and create the UI based on the data-schema and special UI keywords. A data-schema with integrated ui-schema enforces the consistency of the UX across different apps and devices.

For compatibility, we conform to the JSON-Schema vocabulary. There are some additional keywords for own widgets.

[... more](./packages/docs/Schema.md)

## Widget Design Systems

The package `@ui-schema/ui-schema` supports rendering widgets for JSON-schema `type` and rendering own widgets for any type.

It is possible to connect any design system to the renderer, included or planned support:

- `@ui-schema/ds-material` adds binding to [@material-ui/core](https://material-ui.com/) to use [Material Design](https://material.io/)
- `@ui-schema/ds-bootstrap` adds binding to plain bootstrap semantic HTMLs **planned**
- `@ui-schema/ds-blueprint` adds binding to [blueprintjs](https://blueprintjs.com/docs/) **would be nice**
- `@ui-schema/ds-semanticui` adds binding to [semantic-ui](https://react.semantic-ui.com/usage/) **would be nice**
- `@ui-schema/ds-antdesign` adds binding to [Ant Design](https://ant.design/docs/react/introduce) **would be nice**
- `@ui-schema/ds-pulse` adds binding to [.pulse](https://pulse.heartbeat.ua/components/box) **would be nice**

> You want to add a design system binding?
>
> Reach out to us, we help you to get started and we are open to make it an official binding!
>
> [I want to help!](https://ui-schema.bemit.codes/contribute)

A match by `widget` supersedes the `type` matching.

Match by `type` in schema and each type component must handle its own formats:

| Type         | Format      | Component            | Material-UI | Bootstrap | ? |
| :---         | :---        | :---                 | ---: | ---: | ---: | 
| `string`     | -           | [Normal Text Input](packages/docs/TextField.md)    | ⬛ | ⬜ | ⬜ |
| `string`     | `date`      | Date Input           | ⬛ | ⬜ | ⬜ |
| `string`     | `date-time` | Date+Time Input      | ⬜ | ⬜ | ⬜ |
| `string`     | `time`      | Time Input           | ⬜ | ⬜ | ⬜ |
| `string`     | `email`     | Email Input          | ⬜ | ⬜ | ⬜ |
| `string`     | `tel`       | Tel. No. Input       | ⬜ | ⬜ | ⬜ |
| `number`     | -           | Number Input         | ⬛ | ⬜ | ⬜ |
| `bool` or `boolean` | -    | Toggle Input (true/false) | ⬛ | ⬜ | ⬜ |
| `object`     | -           | Native Objects       | ⬛ | ⬜ | ⬜ |
| `array`      | -           | only supported through widgets | - | - | - |

> Date + Time als Beschreibung: Timestamp??

Included widgets (match by `widget` in schema), each widget could have multiple types and formats:

| Widget     | Component | Expected Type(s) | Formats | Material-UI | Bootstrap | ? |
| :---       | :----     | ---: | ---: | ---: | ---: | ---: |
| StringList | multiple strings as list  | `array<string>` | - | ⬜ | ⬜ | ⬜ |
| Text       | multiline text input  | `string` | - | ⬛ | ⬜ | ⬜ |
| TextRich   | multiline rich text editor | `string` or `array` or `object` | **`html`** or `md` | ⬜ | ⬜ | ⬜ |
| TextRichInline | single-line rich text editor | `string` or `array` or `object` | **`html`** or `md` | ⬜ | ⬜ | ⬜ |
| Code       | text editor with syntax highlight | `string` or `array` or `object` | *multiple* | ⬜ | ⬜ | ⬜ |
| Color      | color input  | `string` | - | ⬜ | ⬜ | ⬜ |
| File       | single file selector  | `object` | - | ⬜ | ⬜ | ⬜ |
| Files      | multiple files selector  | `object` | - | ⬜ | ⬜ | ⬜ |
| Folder     | single folder selector  | `object` | - | ⬜ | ⬜ | ⬜ |
| Folders    | multiple folder selector  | `object` | - | ⬜ | ⬜ | ⬜ |
| MediaImage | single/multiple image selector, may enable embed of external (like from youtube) | `object` | - | ⬜ | ⬜ | ⬜ |
| MediaVideo | single/multiple video selector, may enable embed of external | `object` | - | ⬜ | ⬜ | ⬜ |
| MediaAudio | single/multiple audio selector, may enable embed of external | `object` | - | ⬜ | ⬜ | ⬜ |
| MediaGallery | multiple media files selector, may enable embed of external | `object` | - | ⬜ | ⬜ | ⬜ |
| Table      | table editor  | `object` or `string` | - | ⬜ | ⬜ | ⬜ |
| Grid       | drag-drop grid  | `object` | - | ⬜ | ⬜ | ⬜ |
| GenericList | list with sub-schema  | `array` | - | ⬜ | ⬜ | ⬜ |
| Card | card with headline and any sub-schema  | `array` or `object` | - | ⬜ | ⬜ | ⬜ |
| ExpansionPanel | list headlines and sub-schema  | `array` or `object` | - | ⬜ | ⬜ | ⬜ |
| Step       | list with sub-schema as steppers | `array` or `object` | - | ⬜ | ⬜ | ⬜ |
| Tabs       | list with sub-schema as tabs | `array` or `object` | - | ⬜ | ⬜ | ⬜ |
| BoolIcon   |   | `bool` | - | ⬜ | ⬜ | ⬜ |
| OptionsCheck | group of checkboxes  | `array` | - | ⬛ | ⬜ | ⬜ |
| OptionsRadio | group of radio buttons  | `string` | - | ⬛ | ⬜ | ⬜ |
| Select     |  select one out of n | `string` | - | ⬛ | ⬜ | ⬜ |
| SelectMulti  |   | `array` (`List`) | - | ⬛ | ⬜ | ⬜ |
| [SelectGroup](https://material-ui.com/components/selects/#grouping)  |   | `array` | - | ⬜ | ⬜ | ⬜ |
| Dialog     | sub-schema as dialog | `object` | - | ⬜ | ⬜ | ⬜ |
| TransferList | double select list | `array` or `object` | - | ⬜ | ⬜ | ⬜ |
| NumberSlider | slider as input | `int` | - | ⬜ | ⬜ | ⬜ |

... more to follow
> Link also (relative, absolute path) --> validity: pattern verifies if encoded chars

⬛ only means some working example is existing during the current dev-state.

[... more on providing/overriding Widgets](./packages/docs/Widgets.md)

## Docs

- [UI-JSON-Schema](./packages/docs/Schema.md), on which types and keywords are supported
- [Widget System](./packages/docs/Widgets.md), how to create design-system bindings and override widgets
- [Creating Widgets](./packages/docs/Widgets.md#creating-widgets)
- Widgets
    - [TextField](./packages/docs/widgets/TextField.md)
    - [Stepper](./packages/docs/widgets/TextField.md)
- [Widget Plugins](./packages/docs/WidgetPlugins.md)
- [Localization / Translation](./packages/docs/Localization.md)
- [Performance](./packages/docs/Performance.md) insights and tips

## Contributing

1. Fork/Clone Repository
2. Install root dev-dependencies (like lerna, webpack): `npm i`
3. Bootstrap [lerna](https://lerna.js.org/), install all dependencies: `npm run bootstrap`
4. Start dev-server: `npm start` (will clean-dist + symlink-es-modules + hoist)
5. Open browser on [localhost:4200](http://localhost:4200)
6. Explore [packages](packages)
7. Code -> Commit -> Pull Request -> Being Awesome!

Changes from any package are reflected inside the demo package.

- Build: `npm run build`
- Clean node_modules and build dirs: `npm run clean`
- Clean build dirs: `npm run clean-dist`
- Add new node_module to one package: `lerna add <npm-package-name> --scope=@ui-schema/demo [--dev] [--peer]`, without `--scope` in all packages

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

© 2019 bemit UG (haftungsbeschränkt)

### Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the MIT License attached to the repository.

***

Created by [Michael Becker](https://mlbr.xyz)
