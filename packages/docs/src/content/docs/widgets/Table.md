# Table

Widget for data tables.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `array(array(string | number | integer))`,
- widget keywords:
    - `Table`
- view
    - does not support grid keywords, disables grid for own stack

- [Type Properties](/docs/schema#type-boolean)

## Design System

### Material-UI

> 🚧 Work in progress
>
> At the moment: basic working concept for simple array tuple schemas.
>
> Not included in `widgets`, must be added additionally

```js
import {widgets} from '@ui-schema/ds-material';
import {Table} from '@ui-schema/ds-material/Widgets/Table';
import {NumberRendererCell, StringRendererCell, TextRendererCell} from '@ui-schema/ds-material/Widgets/TextFieldCell';

const CustomTable = ({widgets, ...props}) => {

    // dynamic overwrite for all widgets, which need an special TableCell formatting
    // you can also only enable specific widgets here
    const customWidgets = React.useMemo(() => ({
        ...widgets,
        types: {
            ...widgets.types,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
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

> todo: more code sharing through utils

- `TextRendererCell` supports multi-line text
    - extra keywords:
        - `view`
            - `rows` minimum rows visible
            - `rowsMax` maximum rows visible
            - if both are set, the `textarea` grows until `rowsMax` is reached
            - `hideTitle` does not show the title, but will use it as aria-label
- `NumberRendererCell` supports `number`, `integer`
- `StringRendererCell` base component used by both others and for `string`
