# Changes done

## Package Split up

> todo: add what was moved to which package/sub-path after first clean-up of a working demo-web/demo-server setup

- `@ui-schema/material-editorjs` removed from core monorepo, no replacement yet
- `@ui-schema/material-slate` removed from core monorepo, no replacement yet

## Renamed Code

List of renamed functions, components etc., most are also moved to other packages / paths - and some may be renamed/moved again until final `v0.5.0` release.

- `PluginSimple` > `SchemaPlugin`,
- `PluginSimpleStack` > `SchemaPluginsAdapter`,
- `PluginSimpleStack/handlePluginSimpleStack` > `SchemaPluginStack`
- `schemaToNative/mapSchema` > `schemaRulesToNative`
- `PluginStack` > `WidgetEngine`
- `ComponentPluginType` >`WidgetPluginType`
- `PluginProps` >`WidgetPluginProps`
- `WidgetProps` > `WidgetPayload` AND `WidgetProps`
- `CommonTypings/Errors` > `ValidatorErrorsType`
- `ObjectGroup` > `SchemaLayer`
- `Translate/Trans` > `Translate`
- `Translate/TransTitle` > `TranslateTitle`
- `Translate/relT` > `TranslatorRelative`
- `Translate/relT/relTranslator` > `translateRelative`

## General Changes

### System

- removed function `checkNativeValidity` in `schemaToNative`
- moved react-specific widget matching logic from `widgetMatcher` to `WidgetRenderer`

### React

#### WidgetsBinding

- `pluginStack` to `widgetPlugins`
- `pluginSimpleStack` to `schemaPlugins`
- added `ObjectRenderer` as `type.object` / no longer as hard coded default
- added `NoWidget` as `NoWidget` / no longer as hard coded default
- browser error translation switched from `"t": "browser"` to `"tBy": "browser"`

##### Tactic-UI Integration

> just a stub, a lot of things are not mentioned here yet

- widgets which rely on the widgets binding need to specify the required bindings for `leafs` and `components` manually
- the `render` prop now contains the injected binding, instead of `widgets`, with a new structure which is specified by `tactic-ui`

#### React Plugins

- ~~removed `ExtractStorePlugin`, included now in `WidgetEngine` directly (for the moment, experimenting performance/typing)~~ back as normal plugin
- removed `level` property, use `schemaKeys`/`storeKeys` to calc. that when necessary

### DS Material

- adjusted root import paths, no longer exports the actual widgets directly - only with sub-folder
    - e.g. `import { StringRenderer } from '@ui-schema/ds-material'` change to: `import { StringRenderer } from '@ui-schema/ds-material/Widgets'` or even better: `import { StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'`
- `widgetsBinding` case adjusted to `*W*idgetsBinding`, no longer exports `widgets`
- `WidgetBinding | WidgetsBinding | MuiWidgetsBinding` types, folder and file names normalized to be `WidgetsBinding`
- previous predefined `widgetsBinding.widgets` not yet added again
    - todo: export with multiple modular factory functions
- `pluginStack` removed, use a custom `ReactDeco`

## Plugin & Validator System

> no longer valid, needs adjustments with current tactic-ui usage

- new widget structure, internally similar to previously
- very strict typings possible
- each `PluginStack` (now other namings) must be setup and configured with the plugins before adding them to the actual binding
- a new `.use()` function is used to specify each plugin separately, this function's typing will collect all props of the actual plugin
- validators work similar to before, but are contained in a `Validator` container with hooks for level-based or full-nested validation and e.g. conditional / ref. handling
