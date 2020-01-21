# UI-Schema

JSON-Schema form + ui generator for any design system, first-class support for [Material Design React UI](https://material-ui.com).

[![Travis (.org) branch](https://img.shields.io/travis/ui-schema/ui-schema/master?style=flat-square)](https://travis-ci.org/ui-schema/ui-schema) [![react compatibility](https://img.shields.io/badge/React-%3E%3D16.8-success?style=flat-square&logo=react)](https://reactjs.org/)

- @ui-schema/ui-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema) 
- @ui-schema/ds-material [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-material)

>
> ⚠️Work in progress!
>
> UI-Schema is an extract and rewrite of the form-generator logic used internally by our admin panel.
> 
> The fundamentals are working, but a lot of JSON-schema stuff, code testing and widgets needs to be done.
>
> This readme currently serves as a mix of documentation, completion tracking and big-picture.
>

```json
{
  "$id": "https://example.com/some-ui.schema.json",
  "$schema": "http://ui-schema.bemit.codes/draft-07/schema#",
  "description": "A representation of some user data definition",
  
  "type": "object",

  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" },
    "avatar": { 
      "type": "object",
      "widget": "FileUpload"
    }
  },

  "required": ["name"],

  "dependencies": {// dynamic content & toggles etc.
    "post-office-box": [ "street-address" ],
    "extended-address": [ "street-address" ],
    // needs existing property
    "credit_card": ["billing_address"],
    // supplies new property needed when credit_card
    "credit_card": {
      "properties": {
        "billing_address": { "type": "string" }
      },
      "required": ["billing_address"]
    }
  }
}
```

- Dependencies: 
    - [Property](https://json-schema.org/understanding-json-schema/reference/object.html#property-dependencies)
    - [Schema](https://json-schema.org/understanding-json-schema/reference/object.html#schema-dependencies)
    - outdated in draft-7
    
## Schema

We are using the JSON-Schema included keywords to describe the data and create the UI based on the data-schema and special UI keywords. A data-schema with integrated ui-schema enforces the consistency of the UX across different apps and devices.

This JSON-Schema vocabulary is used:
 
- `type` valid types currently supported: `string`, `number`, `boolean`, `object`
- `format` e.g. `date` when the `type` is `string`
- `properties` object sub-schemas
- `headline` what will be used as headline for the current UI
- `default` what will be used if the field hasn't existing data
- `required` for enforcing the fill-out of an field
- `dependencies` for on-the fly sub-schemas and interaction based UI visibility
    - or more precisly using the next Draft-7: `dependentSchemas` and `dependentRequired`
- `enum` for creating multi-selects, checkboxes, radios etc.
- `minLength` string min. length
- `maxLength` string max. length
- `minimum` number min. length
- `maximum` number max. length

It got extended with special only-UI keywords:

- `view` currently only used for the grid system
- `widget` to render the data-ui as a special widget, not using the default type based binding

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

- ⬛ only means some working example is existing during the current dev-state.

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
