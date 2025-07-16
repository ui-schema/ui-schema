---
docModule:
    package: '@ui-schema/pro'
    modulePath: "pro/src/"
    files:
        - "**/*"
---


# UI Schema PRO Documentation

Component and helpers for even more advanced usages.

```bash
npm i --save @ui-schema/pro
```

## UIStorePro

Store hook with integrated debouncing and history.

See the dev-demo [source code](https://github.com/ui-schema/ui-schema/tree/master/packages/demo/src/material-ui/material-ui-pro.js) for an easy implementation with Material-UI.

Checkout the [example video](https://ui-schema.bemit.codes/UISchemaPro-History-Demo.mp4).

```jsx
import {toHistory, useStorePro} from '@ui-schema/pro/UIStorePro'

const DemoComponent = ({schema}) => {
    const {
        reset,
        onChange, store, setStore,
        redoHistory, undoHistory,
    } = useStorePro({
        // type must be given, when empty initialState it must know what store to create
        type: schema.get('type'),
        initialStore: undefined,
        debounceTime: undefined,
        updateRate: undefined,
    })

    return <UIGenerator
        store={store.current}
        onChange={onChange}
        // add also:
        // schema={schema}
        // widgets={customWidgets}
        // showValidity={showValidity}
        // t={browserT}
    />
}
```
