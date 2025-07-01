# Migration and Update Notes

Check the [github release notes](https://github.com/ui-schema/ui-schema/releases) for latest releases, this page focuses on breaking changes of core logic and migration guides.

Check [this discussion](https://github.com/ui-schema/ui-schema/discussions/184) for the current roadmap.

- [v0.4.0 to **v0.5.0**](/updates/v0.4.0-v0.5.0) *(next)*
- [v0.3.0 to **v0.4.0**](/updates/v0.3.0-v0.4.0) *(latest)*
- [v0.2.0 to **v0.3.0**](/updates/v0.2.0-v0.3.0)

## Changelog

> - the code tag `mui` refers to `ds-material` or is used as `material-*` package prefix
> - the code tag `ui-schema` refers to `ui-schema` or is used as core package prefix
> - [meaning of emojis](https://gist.github.com/elbakerino/1cd946c4269681d659eede5c828920b7)

### v0.4.7

> @ 2024-12-03

*None breaking.*

#### `ui-schema@0.4.7`

- ✨ support `type: "object"` widget binding
    - only intended for supplying a custom `ObjectRenderer`, adding a default widget for `object` is safer via a [SimplePlugin](/docs/core-pluginstack#simple-plugins)
      as the `object` binding is used in e.g. ds-material for rendering the object content inside container widgets like `FormGroup`
- 🔧 include immutable v5 in peer dependency range
- 🔧 add `sideEffects: false` to root `package.json`
- 🐛 fix `DefaultHandler` plugin, which caused the following plugin to run twice
    - using default plugins, this did not affect behaviour, as the subsequent plugins behave idempotent

#### `ds-material@0.4.3`

- ✨ add `widgetsBindingBasic`, for easier setup of custom bindings without increased bundle size
    - does not include any default widgets
    - does not include any default plugins and validators
- ✨ move widget binding type exports to `BindingType`, while keeping existing exports in `widgetsBinding` for backwards compatibility
- ✨ add missing types for all supported `type` bindings: `array`, `object`, `null`; make all `type` widget bindings optional
- 🔧 include immutable v5 in peer dependency range
    - fix stricter typing in v5: in `TableRenderer`, added `5` as default for rows-per-page
- 🔧 add `sideEffects: false` to root `package.json`

Example of `widgetsBindingBasic`:

```tsx
import { MuiWidgetBinding } from '@ui-schema/ds-material/BindingType'
import { pluginStack } from '@ui-schema/ds-material/pluginStack'
import { validators } from '@ui-schema/ui-schema/Validators/validators'
import { BoolRenderer, NumberRenderer, Select, SelectMulti, StringRenderer, TextRenderer } from '@ui-schema/ds-material/Widgets'
import { widgets } from '@ui-schema/ds-material/widgetsBindingBasic'

const customWidgets: MuiWidgetBinding = {
    ...widgets,

    // add the default plugins or provide your own:
    pluginSimpleStack: validators,
    pluginStack: pluginStack,

    // add support for `type` keyword widgets
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
    },

    // add some widgets for the `widget` keyword
    custom: {
        Text: TextRenderer,
        Select: Select,
        SelectMulti: SelectMulti,
    },
}
```

#### Misc

Include immutable v5 in peer dependency range and add `sideEffects: false` to all root `package.json`:

- `ds-bootstrap@0.4.3`
- `dictionary@0.0.13`
- `material-pickers@0.4.0-alpha.6`
- `pro@0.0.14`
- `kit-dnd@0.0.8`
- `material-dnd@0.0.17`
- `material-editorjs@0.0.14`
- `material-slate@0.0.13`

### v0.4.6

> @ 2024-11-01
>
> *General fixes of invalid `import`/`export`, which led to some CJS-ESM mix-up in bundlers.* Fixed with adjusted import paths and backwards compatible new directories and index files.
>
> *Update dev tools and deps, e.g. React v18, less babel plugins.*

*None breaking.*

#### `ui-schema@0.4.6`

- 🐛 fix invalid `import`/`export`
- 🐛 fix some types for React v18

#### `ds-bootstrap@0.4.2`

- ✨ add `readOnly` keyword support in `TextField`

#### `ds-material@0.4.2`

- 🐛 fix invalid `import`/`export`
- 🐛 fix some types for React v18
- 🐛 fix `SelectMulti` invalid casting to `string` of selected value
    - fixes that only `string` `oneOf.const` where possible for rendering selected value labels [#226](https://github.com/ui-schema/ui-schema/pull/226)
- 🐛 fix `OptionsBoolean` shows two `*` when `required`
- ✨ add `TableFooter` overflow, allowing TableFooter to overflow in `Table` to not overflow outside of it
- ✨ add `TextFieldCell` `minWidth` with default `40px` and `view.minWidth` as keyword
    - to prevent inputs in cells with a small column header to disappear when Table is resized

#### Misc

Fixes of `import`/`export` and React 18 types in:

- `dictionary@0.0.12`
- `material-pickers@0.4.0-alpha.5`
- `pro@0.0.13`
- only small patches, just that build succeeds
    - `kit-dnd@0.0.7`
    - `material-dnd@0.0.16`
    - `material-editorjs@0.0.13`
    - `material-slate@0.0.12`

### v0.4.5

> @ 2023-02-03

- 🪥 `ui-schema` `Utils/useDebounceValue` adjusted internal state flow to flush in layout effects
- ✨ `ui-schema` simple-plugin [`SortPlugin`](/docs/plugins#sortplugin)
- ✨ `ui-schema` simple-plugin [`InheritKeywords`](/docs/plugins#inheritkeywords) [#204](https://github.com/ui-schema/ui-schema/issues/204)
- 📚 docs links and icons fixes, [new read-widgets demos](/docs/ds-material/widgets-read/BooleanRead#demo-ui-generator)

[Release notes](https://github.com/ui-schema/ui-schema/releases/tag/0.4.5)

### v0.4.4

> @ 2022-09-01

*Changed json-schema validation implementations / mui widget features.*

- 🐛 `ui-schema` fix `ConditionalHandler`
- ♻️ `ui-schema` adjust validators to support recursive validations of objects
- ♻️ `ui-schema` adjusted value-type specific validators to no longer rely on `type` keyword
- ✨ `mui` widget `OptionsBoolean` (`Switch`) new keywords and props
- ✨ `mui` widget `SelectChips` add `view.color` keyword
- 🐛 `mui` widget `WidgetOptionsRead` label for empty entries
- ♻️ `mui` read widgets remove `useMeta` usage
- 🪥 `mui-pickers` optimize `@mui/material` import paths

[Release notes](https://github.com/ui-schema/ui-schema/releases/tag/0.4.4)

### v0.4.3

> @ 2022-06-28

*None breaking* update of `ui-schema`, `ds-material`, `dictionary`

- fix `ds-material` usage of `oneOf` `title`
- add error context to `oneOf` validation error
- added translation for `oneOf` error in `/dictionary`
- `ds-material` **deprecated:** `WidgetOneOfRead`, `WidgetEnumRead`
- `ds-material` new universal `WidgetOptionsRead` for `enum`, `oneOf` and `items.oneOf` (single and multi select)

[Release notes](https://github.com/ui-schema/ui-schema/releases/tag/0.4.3)

### v0.4.2

> @ 2022-06-26

Version bumps, new features, repository cleanup and a few fixes.

Only users of `material-code` need to adjust their code, everything else is *none breaking*.

- `ui-schema` now on `v0.4.2`, work on `v0.5.0` will start in a feature branch - develop will be for 0.4.x fixes and features until further notice
- `ds-material` now on `v0.4.0-alpha.6` using a new unified rendering for `enum`/`oneOf`
- `ds-material` fixed some esm loading issues, most likely because of some unknown babel changes / or nodejs version stuff
- fixed a few rule-of-hooks breaks in all released packages
- moved `material-color` to [new repository](https://github.com/ui-schema/react-color)
    - added new `material-colorful` widgets as basic integration with [react-colorful](https://www.npmjs.com/package/react-colorful)
- moved material-code to [new repository](https://github.com/ui-schema/react-codemirror)
    - switched to CodeMirror v6
    - added new kit-code package, which is used as React integration for CodeMirror and can be used without any UI-Schema/immutable dependencies
    - full recode of widgets, build them for the features you need, check new docs vs. old docs

Full release notes:

- [Core 0.4.1 / DS-Material ... / move material-code](https://github.com/ui-schema/ui-schema/releases/tag/0.4.1)
- [Core 0.4.2 / DS-Material ... / move material-color](https://github.com/ui-schema/ui-schema/releases/tag/0.4.2)
- [Kit: CodeMirror, Material Code 0.4.0-beta.1](https://github.com/ui-schema/react-codemirror/releases/tag/code-0.4.0-beta.1)
- [Material Color 0.4.0 / Material Colorful 0.0.1](https://github.com/ui-schema/react-color/releases/tag/colorful-0.0.2)

### v0.4.0-beta.1

> @ 2022-05-06

[New UI-Schema & DS Material Release](https://github.com/ui-schema/ui-schema/releases/tag/material-0.4.0-alpha.3).

### v0.4.0-beta.0

> @ 2022-05-05

[Release notes](https://github.com/ui-schema/ui-schema/releases/tag/0.4.0-beta.0)

Typing cleanup of prev. alpha in `ui-schema`, now on `0.4.0-beta.0`.

`ds-material` is now on `v0.4.0-alpha.2` and just waits for some usage feedback before beta. I've also found some time to add a roadmap discussion.

The docs page got a few upgrades, like:

- new search system
- some parts got automatic generated component docs (which still need work on)
    - like the [InfoRenderer](https://ui-schema.bemit.codes/docs/ds-material/Component/InfoRenderer)
- begin to convert to new structure, where each package got its own folder for technical details
