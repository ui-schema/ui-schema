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

const DemoComponent = () => {
    const {
        reset,
        onChange, store, setStore,
        redoHistory, undoHistory,
    } = useStorePro({
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
