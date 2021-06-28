# UI-Schema Core

The UI Schema core consists of `Providers`, `Renderers`, the plugin system and validators.

It supports different ways of creation and UI orchestration, focused for a great developer experience and fast UIs.

> todo: document the entry point styles of the FlowChart and their usage here, use the other `Core` docs as component documentations

- [Generator & Renderer](/docs/core-renderer) is about components which start the whole form or are part of the automatic/autowired rendering flow
- [Store](/docs/core-store) is about the internal data handling and the needed providers, each new UI Generator needs an own store
- [Meta](/docs/core-meta) is about the available `widgets` and translation `t` options, best is to have one [lifted up](https://reactjs.org/docs/lifting-state-up.html) `UIMetaProvider` for many `UIStoreProvider`

## Flowchart

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
