# Stepper / Sequential

A stepper is a widget that renders a sub-schema after another, it is only possible to enter the next if the current is validated.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- each property/sub-schema of a stepper is used as a step
- validation of whole stepper is completed after all steps have been rendered
- creates an object out of all
- the stepper controls it's own `showValidity`, this overwrites an existing `false` to `true`
  - this highlights only the invalid of the stepper, not the containing schema
  - if the containing schema should display validity, the stepper will do it also
  - it reset's it's own `showValidity` on switching steps
- type: `object`
- widget keywords:
    - `Stepper` for the root object containing steps
- view
    - grid keywords

- [Object Type Keywords](/docs/schema#type-object)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    Stepper, Step,
} from "@ui-schema/ds-material/es/Widgets/Stepper";

const widgets = {
    custom: {
        Stepper,
        Step,
    },
};
```

Components:

- `Stepper` main widget handling the root object
- `Step` - not used currently
- See also [mui stepper component](https://material-ui.com/components/steppers/)
