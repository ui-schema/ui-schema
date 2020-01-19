# UI-Schema

JSON-Schema form + ui generator for any design system, available binding to [Material Design React UI](https://material-ui.com).

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

## Widgets

A widget is responsible to render the UI and either display or make the editing of the data possible, it handles one schema level and may connect to another nested SchemaEditor if it handles a special object/group.

- `RootRenderer` main wrapper around everything
- `GroupRenderer` wraps an object that is not a widget
    - props: `schema`
- `WidgetRenderer` is wrapped arround all final widgets
- `custom` contains widgets mapping with schema's `widget`
    - `Text`
- `types` contains widgets mapping with schema's `type`
    - `string`
    
Example default binding `material-ui`:

```js
import React from "react";
import Grid from "@material-ui/core/Grid";

const SchemaGridItem = ({schema, children}) => {
    return <Grid
        item
        xs={schema ? schema.getIn(['view', 'sizeXs']) : undefined}
        sm={schema ? schema.getIn(['view', 'sizeSm']) : undefined}
        md={schema ? schema.getIn(['view', 'sizeMd']) : undefined}
        lg={schema ? schema.getIn(['view', 'sizeLg']) : undefined}
        xl={schema ? schema.getIn(['view', 'sizeXl']) : undefined}
    >
        {children}
    </Grid>
};

const WidgetRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
    {children}
</SchemaGridItem>;

const RootRenderer = props => <Grid container spacing={0}>{props.children}</Grid>;

const GroupRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
    <Grid container spacing={2} wrap={'wrap'}>
        {children}
    </Grid>
</SchemaGridItem>;

const widgets = {
    RootRenderer,// wraps the whole editor
    GroupRenderer,// wraps any `object` that has no custom widget
    WidgetRenderer,// optional: wraps any rendered widget
    types: {
        // supply your needed native-type widgets
    },
    custom: {
        // supply your needed custom widgets
    },
};

export {widgets}
```

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
| `string`     | -           | [Normal Text Input](packages/docs/TextField.md)    | ☑ | ☐ | ☐ |
| `string`     | `date`      | Date Input           | ☑ | ☐ | ☐ |
| `string`     | `date-time` | Date+Time Input      | ☐ | ☐ | ☐ |
| `string`     | `time`      | Time Input           | ☐ | ☐ | ☐ |
| `string`     | `email`     | Email Input          | ☐ | ☐ | ☐ |
| `string`     | `tel`       | Tel. No. Input       | ☐ | ☐ | ☐ |
| `number`     | -           | Number Input         | ☑ | ☐ | ☐ |
| `bool` or `boolean` | -    | Toggle Input (true/false) | ☑ | ☐ | ☐ |
| `object`     | -           | Native Objects       | ☑ | ☐ | ☐ |
| `array`      | -           | only supported through widgets | - | - | - |

Included widgets (match by `widget` in schema), each widget could have multiple types and formats:

| Widget     | Component | Expected Type(s) | Formats | Material-UI | Bootstrap | ? |
| :---       | :----     | ---: | ---: | ---: | ---: | ---: |
| StringList | multiple strings as list  | `array<string>` | - | ☐ | ☐ | ☐ |
| Text       | multiline text input  | `string` | - | ☑ | ☐ | ☐ |
| TextRich   | multiline rich text editor | `string` or `array` or `object` | **`html`** or `md` | ☐ | ☐ | ☐ |
| TextRichInline | single-line rich text editor | `string` or `array` or `object` | **`html`** or `md` | ☐ | ☐ | ☐ |
| Code       | text editor with syntax highlight | `string` or `array` or `object` | *multiple* | ☐ | ☐ | ☐ |
| Color      | color input  | `string` | - | ☐ | ☐ | ☐ |
| File       | single file selector  | `object` | - | ☐ | ☐ | ☐ |
| Files      | multiple files selector  | `object` | - | ☐ | ☐ | ☐ |
| Folder     | single folder selector  | `object` | - | ☐ | ☐ | ☐ |
| Folders    | multiple folder selector  | `object` | - | ☐ | ☐ | ☐ |
| MediaImage | single/multiple image selector, may enable embed of external (like from youtube) | `object` | - | ☐ | ☐ | ☐ |
| MediaVideo | single/multiple video selector, may enable embed of external | `object` | - | ☐ | ☐ | ☐ |
| MediaAudio | single/multiple audio selector, may enable embed of external | `object` | - | ☐ | ☐ | ☐ |
| MediaGallery | multiple media files selector, may enable embed of external | `object` | - | ☐ | ☐ | ☐ |
| Table      | table editor  | `object` or `string` | - | ☐ | ☐ | ☐ |
| Grid       | drag-drop grid  | `object` | - | ☐ | ☐ | ☐ |
| GenericList | list with sub-schema  | `array` | - | ☐ | ☐ | ☐ |
| Card | card with headline and any sub-schema  | `array` or `object` | - | ☐ | ☐ | ☐ |
| ExpansionPanel | list headlines and sub-schema  | `array` or `object` | - | ☐ | ☐ | ☐ |
| Step       | list with sub-schema as steppers | `array` or `object` | - | ☐ | ☐ | ☐ |
| Tabs       | list with sub-schema as tabs | `array` or `object` | - | ☐ | ☐ | ☐ |
| BoolIcon   |   | `bool` | - | ☐ | ☐ | ☐ |
| OptionsCheck | group of checkboxes  | `array` | - | ☑ | ☐ | ☐ |
| OptionsRadio | group of radio buttons  | `string` | - | ☑ | ☐ | ☐ |
| Select     |  select one out of n | `string` | - | ☑ | ☐ | ☐ |
| SelectMulti  |   | `array` (`List`) | - | ☑ | ☐ | ☐ |
| [SelectGroup](https://material-ui.com/components/selects/#grouping)  |   | `array` | - | ☐ | ☐ | ☐ |
| Dialog     | sub-schema as dialog | `object` | - | ☐ | ☐ | ☐ |
| TransferList | double select list | `array` or `object` | - | ☐ | ☐ | ☐ |
| NumberSlider | slider as input | `int` | - | ☐ | ☐ | ☐ |

... more to follow, ☑ only means some working example is existing during the current dev-state.

## Performance

This editor has multiple levels of performance optimization:

- immutables as internal store
    - does not apply to `widgets`, storing memoized components in immutable are a problem 
- memoization of `setData` and `setSchema` action creators
- no html re-rendering of no-changed scopes
    - **previously**: e.g. `setData` updates the hook `useSchemaStore`, thus typing in inputs lags
        - within the core this hook is used to access the context
        - all hook consuming components are re-rendering, you got 100 input fields, all will re-render
    - to **not re-render any HTML** that must not be re-rendered this approach is used:
        - multiple components are like `React.PureComponent` with logic-html separation
        - the root component accesses the hook, prepares the values, but doesn't render html by itself 
        - this wraps another component that receives props and is a memoized function component 
        - this wraps the actual component (e.g. widget.RootRenderer), and passes it's props down and may decide on what to render based on the props
        - *all rendering widgets are wrapped like that*
    - if you introduce a hook in a widget it is advised that the producing HTML components are also made "dump"
        - pure without using a hook that relies on the onChange of the SchemaEditorStore context
        - e.g. use `useSchemaEditor` only in a parent components and wrap a React.PureComponent (or function equivalent) which may render HTML
    - only the `store` immutable is changing, for each current field it's value is retrieved and pushed to the widget, this way only the widget which's value was changing is re-rendering.
- memoization in the core:
    - widgets:
        - `RootRenderer` is wrapped inside a memoized dump-renderer, will re-render on `schema` and `widgets` change
        - `GroupRenderer` is wrapped inside the memoized dump-renderer `DumpSwitchingRenderer`
        - any `types.<Component>`, `custom.<Component>` is wrapped in the memoized `DumpWidgetRenderer`
    - core:
        - `SchemaEditorRenderer` wraps `DumpSwitchingRenderer` which decides if the current child-schema should be rendered as widget or normal group
            - re-renders on changes of current schema-levels: `type`, `widget`, `schema`, `storeKeys`, `level`, `properties` and `GroupRenderer`
        - `SchemaWidgetRenderer` wraps `DumpWidgetRenderer` which is the abstraction layer to the final widgets
            - re-renders on changes of **current** widgets: `renderer`, `value`, `lastKey`, `storeKeys`, `setData`, `level`, `schema`


## Contributing

1. Fork/Clone Repository
2. Install root dev-dependencies (like lerna, webpack): `npm i`
3. Bootstrap [lerna](https://lerna.js.org/), install all dependencies: `npm run hoist`
4. Start dev-server: `npm start`
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
