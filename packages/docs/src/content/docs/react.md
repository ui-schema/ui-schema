# UI-Schema React

The UI Schema react part consists of `Providers`, `Renderers`~~, the plugin system and validators~~.

It supports different ways of creation and UI orchestration, focused for a great developer experience and fast UIs.

- [Generator & Renderer](/docs/core-renderer): components which start the whole form or are part of the automatic/autowired rendering flow
- [Store](/docs/core-store): internal data handling and the needed providers, each new UI Generator needs its own store
- [Meta](/docs/core-meta): available `widgets` and translation `t` options, best is to have one [lifted up](https://reactjs.org/docs/lifting-state-up.html) `UIMetaProvider` for many `UIStoreProvider`
- [PluginStack](/docs/react/widgetengine): wraps each widget and executes plugins / validators
- [UIApi](/docs/core-uiapi): utilities for network connected forms
- [Utils](/docs/core-utils): common utilities for immutable and other logic parts

## Flowchart

New [0.5.x architecture flowchart](https://github.com/ui-schema/ui-schema/blob/develop/Flowchart.md) can be found in github.

Legacy 0.4.x flowchart:

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
