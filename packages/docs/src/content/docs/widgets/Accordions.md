# Accordions

Widgets for `object` which makes each property an accordion dropdown.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui)

- type: `object`
- widgets:
    - `Accordions`

## Material-UI

**Supports extra keywords:**

- `onClosedHidden`, `boolean`, when `true` renders the whole PluginStack virtually when it is closed, for some edge case performance optimizing
- `defaultExpanded`, `string`, name of the by-default expanded property
- `view.ev`, `number`, only for variant `elevation` to control the elevation level
- `view.variant`, `elevation | outlined`, the used `Accordion` variant for the summary
- `view.titleVariant`, `string`, the used `Typography` variant for the summary
- on property-schema:
    - `info`, to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Supports `props`:**

- `SummaryTitle` to render a custom summary component instead of the standard title
    - supported by `AccordionsRenderer`, `AccordionStack` components of `@ui-schema/ds-material/Widgets/Accordions`
