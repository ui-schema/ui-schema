---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    fromPath: "UIApi"
    files:
        - "UIApi/*"
---

# UIApi

> ❗ Deprecated, will be removed in a future version. New $ref handling moves loading to user code, outside of widget rendering.

> ❗ Only for loading schemas.

Add the `UIApiProvider`, should be above all UI renderers, to not load the same schema multiple times.

The `loadSchema` property needs a function which accepts the url and must return the schema in json. If the api fails, either don't catch or re-throw the error. This way the internal caching can correctly allow retries for errors.

```jsx
const loadSchema = (url) => {
    return fetch(url).then(r => r.json())
}
const Provider = ({children}) => <UIApiProvider
    loadSchema={loadSchema}
    /* disables localStorage cache of e.g. loaded schemas */
    noCache={false}
>
    {children}
</UIApiProvider>
```

With this variable you get the used cache key in the `localStorage`

```jsx
import {schemaLocalCachePath} from '@ui-schema/ui-schema/UIApi'
```
