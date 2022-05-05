# Card

Widgets for `object` which makes each property an accordion dropdown.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui)

- type: `object`
- widgets:
    - `Card`

**Supports extra keywords:**

- `view.ev`, `number`, only for variant `elevation` to control the elevation level
- `view.variant`, `elevation | outlined`, the used `Accordion` variant for the summary
- `view.bg`, `boolean`, when `false`  the used `Typography` variant for the summary
- `view.hideTitle`, `boolean`, when `true` does not show the title
- `view.titleVariant`, `string`, the used `Typography` variant
- `view.titleComp`, `string`, the used `Typography` component
- on property-schema:
    - `info`, to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)
