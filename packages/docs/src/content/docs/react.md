# UI-Schema React

The UI Schema react part consists of `Providers`, `Renderers`~~, the plugin system and validators~~.

It supports different ways of creation and UI orchestration, focused for a great developer experience and fast UIs.

- [Generator & Renderer](/docs/react/renderer): components which start the whole form or are part of the automatic/autowired rendering flow
- [Store](/docs/react/store): internal data handling and the needed providers, each form has it's own store
- [Meta](/docs/react/meta): context for the available `binding`, `validate` and translation `t`, shared across the whole application
- [WidgetEngine](/docs/react/widgetengine): wraps each widget and renders plugins, and through them e.g. validators
- [SchemaPluginsAdapter](/docs/react/schemapluginsadapter): runs schema plugins within the React rendering pipeline
- [Localization](/docs/react/localization): translation components, for [embedded in-schema](/docs/localization#translation-in-schema) and `t` fn as source
- [Utils](/docs/react/utils): common utilities for immutable and other logic parts

## Flowchart

New [0.5.x architecture flowchart](https://github.com/ui-schema/ui-schema/blob/develop/Flowchart.md) can be found in github.

Legacy 0.4.x flowchart:

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
