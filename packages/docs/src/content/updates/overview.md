# Migration and Update Notes

Check the [github release notes](https://github.com/ui-schema/ui-schema/releases) for latest releases, these page focuses on breaking changes of core logic.

Check [this discussion](https://github.com/ui-schema/ui-schema/discussions/184) for the current roadmap.

- [v0.2.0 to **v0.3.0**](/updates/v0.2.0-v0.3.0)
- [v0.3.0 to **v0.4.0**](/updates/v0.3.0-v0.4.0) *(stable)*

## Changelog

This serves as overview of releases and changes - follow the [#releases channel in slack](https://ui-schema.slack.com/archives/C03DMRE88Q7) for the same content, but with the option for direct help and feedback ([slack invite link in readme](https://github.com/ui-schema/ui-schema/tree/0.4.3#ui-schema-for-react)).

> - the code tag `mui` refers to `ds-material` or is used as `material-*` package prefix
> - the code tag `uis`/`ui-schema` refers to `ui-schema` or is used as core package prefix
> - [meaning of emojis](https://gist.github.com/elbakerino/1cd946c4269681d659eede5c828920b7)

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
