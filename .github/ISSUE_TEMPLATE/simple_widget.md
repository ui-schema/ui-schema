---
name: New Simple Widget Blueprint
about: Issue Template for Contributors for simple / type-based widgets.
---

<!-- Add a summary in the title above -->
<!-- Selected checkbox is [X] -->

- [] I have checked for duplicates in: [issues](https://github.com/ui-schema/ui-schema/issues) and the [widget list](https://ui-schema.bemit.codes/en/docs/overview#widget-list)

<!-- add the abbreviation in the title! -->
- [] DS-Material **MUI**
- [] DS-Bootstrap **BTS**

## Summary

- [] New Widget
- [] New Feature for existing Widget
    - for Widget:

<!-- replace the placeholders, in each line are placeholders! -->    

Type support `<place:type>` in <place:design-system>.

- [Type Spec](https://ui-schema.bemit.codes/en/docs/schema#type-<place:spec>)
- [Base Widget](https://ui-schema.bemit.codes/en/docs/widgets/<place:spec>)

Must result in a new definition:

```js
import {<place:widget>} from '@ui-schema/ds-<place:design-system>'
const widgets = {
   // either add `type` or `custom`, delete the not needed (and this commment)
   type: {
      <place:matching>: <place:widget>
   },
   custom: {
      <place:matching>: <place:widget>
   }
}
```

<!-- Further Spec Pages Overview, add when needed: -->
<!-- Docs UI-Schema: https://ui-schema.bemit.codes/en/docs/schema -->
<!-- Docs JSON-Schema: https://json-schema.org/understanding-json-schema/reference/type.html -->
