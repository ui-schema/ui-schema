# Changes done

## Package Split up

> todo: add what was moved to which package/sub-path after first clean-up of a working demo-web/demo-server setup

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

### DS Material

- `widgetsBinding` case adjusted to `*W*idgetsBinding`, no longer exports `widgets`
- previous `widgetsBinding.widgets` now exported with multiple modular functions:
    - `defineBinding(partialBinding)` just generates the basic structure without any plugins or widgets
        - accepts the rest of the binding as parameter
    - `getStandardPlugins()` returns `schemaPlugins` and `widgetPlugins`
    - `getTypeWidgets()` just returns `types` widgets
    - `getCustomWidgets()` just returns some recommended `custom` widgets
- `pluginStack` removed, now included directly in `widgetsBinding`
