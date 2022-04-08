# Table

Widget for data tables.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `array(array | object)`
- widget keywords:
    - `Table` **(usable, beta)**
    - `TableAdvanced` **(in-dev)**
- view
    - does not support grid keywords in direct nested schemas, disables grid for own stack, but supported inside nested `object`
- [Array Type Properties](/docs/schema#type-array)
- [Object Type Properties](/docs/schema#type-object)

## Design System

### Material-UI

> 🚧 Work in progress [#73](https://github.com/ui-schema/ui-schema/issues/73)
>
> Not included in `widgets`, must be added additionally.
>
> Not intended for 1000s of entries, just a few hundred - depending on used schemas & plugins

Special `Table` component for complex, always validated, lists. Using custom widgets without labels. Hidden rows from pagination are still validated, using `isVirtual` prop.

> see the [table base components](/docs/ds-material/Table) for further customization

**Supports extra keywords:**

- `view`
    - `view.hideTitle` when `true` it does not show the table title
    - `view.hideItemsTitle` when `true` doesn't display titles of nested object widgets inside the table head
    - `view.btnSize`
    - `view.dense`
    - `view.rowsPerPage`, an array on numbers to specify the possible values for how many rows are visible
    - `view.rowsShowAll`, when `true` allows displaying all rows
- `readOnly`
- `sortOrder`: `string[]`, only for `object` types, relative key of the properties to render in that order
- `tableActionLabels` used for named-label translation with keys `remove`, `add`

**Restrictions (atm):**

- when `sortOrder` is defined, only renders & validates those properties

```js
import {widgets} from '@ui-schema/ds-material';
import {Table} from '@ui-schema/ds-material/Widgets/Table';
import {NumberRendererCell, StringRendererCell, TextRendererCell} from '@ui-schema/ds-material/Widgets/TextFieldCell';
import {BoolRenderer} from '@ui-schema/ds-material/Widgets/OptionsBoolean';

const CustomTable = ({widgets, ...props}) => {

    // dynamic overwrite for all widgets, which need a special TableCell formatting
    // you can also only enable specific widgets here
    const customWidgets = React.useMemo(() => ({
        ...widgets,
        types: {
            ...widgets.types,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
            boolean: BoolRenderer,
        },
        custom: {
            ...widgets.custom,
            Text: TextRendererCell,
        },
    }), [widgets])

    return <Table
        {...props}
        widgets={customWidgets}
    />
}

const customWidgets = {...widgets};

customWidgets.custom = {
    ...widgets.custom,
    Table: CustomTable,
}
```

**Components:**

Currently included cell components are based on the `TextField` components and support the same features - except label/title related options. The title related schema keywords are used by `Table` for the `TableHeader` cell contents.

- `TextRendererCell` supports multi-line text
    - **extra keywords:**
        - `view`
            - `rows` minimum rows visible
            - `rowsMax` maximum rows visible
            - if both are set, the `textarea` grows until `rowsMax` is reached
- `NumberRendererCell` supports `number`, `integer`
    - automatically aligns the content `right`, when not specified, and hides the number up/down in firefox
- `StringRendererCell` base component used by both others and for `string`
    - **extra keywords:**
        - `view`
            - `align` to control the `textAlign` in the table cell
