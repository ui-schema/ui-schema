# UI-Schema

JSON-Schema form + ui generator for any design system, first-class support for [Material UI React](https://material-ui.com).

[![Travis (.org) branch](https://img.shields.io/travis/ui-schema/ui-schema/master?style=flat-square)](https://travis-ci.org/ui-schema/ui-schema)
[![react compatibility](https://img.shields.io/badge/React-%3E%3D16.8-success?style=flat-square&logo=react)](https://reactjs.org/)
[![MIT license](https://img.shields.io/npm/l/@ui-schema/ui-schema?style=flat-square)](https://github.com/ui-schema/ui-schema/blob/master/LICENSE)

- @ui-schema/ui-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema) 
- @ui-schema/ds-material [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-material)
- @ui-schema/ds-bootstrap [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-bootstrap?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-bootstrap)

- Additional Material-UI Widgets:
    - Date-Time Picker: `@ui-schema/material-picker` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-picker) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](https://ui-schema.bemit.codes/en/docs/widgets/DateTimePickers)
    - Codemirror as Material Input: `@ui-schema/material-code` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-code) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](https://ui-schema.bemit.codes/en/docs/widgets/Code)
    - DraftJS as Material TextField: `@ui-schema/material-richtext` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-richtext) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](https://ui-schema.bemit.codes/en/docs/widgets/RichText)
    - Color Pickers: `@ui-schema/material-color` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-color) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](https://ui-schema.bemit.codes/en/docs/widgets/Color)

[![Documentation](https://img.shields.io/badge/Documentation-blue?labelColor=fff&style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9InN2ZzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9ImJhY2tncm91bmQiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMzIiIHdpZHRoPSIzMi4wMDEiLz48L2c+PGcgaWQ9ImJvb2tfeDVGX3RleHRfeDVGX3NldHRpbmdzIj48cGF0aCBkPSJNMzIsMjMuMDAxYzAtMy45MTctMi41MDYtNy4yNC01Ljk5OC04LjQ3N1Y0aC0yVjEuOTk5aDJWMGgtMjNDMi45MTgsMC4wMDQsMi4yOTQtMC4wMDgsMS41NTYsMC4zNTQgICBDMC44MDgsMC42ODYtMC4wMzQsMS42NDUsMC4wMDEsM2MwLDAuMDA2LDAuMDAxLDAuMDEyLDAuMDAxLDAuMDE4VjMwYzAsMiwyLDIsMiwyaDIxLjA4MWwtMC4wMDctMC4wMDQgICBDMjguMDEzLDMxLjk1NSwzMiwyNy45NDYsMzIsMjMuMDAxeiBNMi44NTMsMy45ODFDMi42NzUsMy45NTUsMi40MTgsMy44NjksMi4yNzQsMy43NDNDMi4xMzYsMy42MDksMi4wMTcsMy41LDIuMDAyLDMgICBjMC4wMzMtMC42NDYsMC4xOTQtMC42ODYsMC40NDctMC44NTZjMC4xMy0wLjA2NSwwLjI4OS0wLjEwNywwLjQwNC0wLjEyNUMyLjk3LDEuOTk3LDMsMi4wMDUsMy4wMDIsMS45OTloMTlWNGgtMTkgICBDMyw0LDIuOTcsNC4wMDIsMi44NTMsMy45ODF6IE00LDMwVjZoMjB2OC4wNkMyMy42NzEsMTQuMDIzLDIzLjMzNywxNCwyMi45OTgsMTRjLTIuMTQyLDAtNC4xMDYsMC43NTEtNS42NTEsMkg2djJoOS41MTYgICBjLTAuNDEzLDAuNjE2LTAuNzQzLDEuMjg5LTAuOTk1LDJINnYyaDguMDU3Yy0wLjAzNiwwLjMyOS0wLjA1OSwwLjY2Mi0wLjA1OSwxLjAwMWMwLDIuODI5LDEuMzA3LDUuMzUsMy4zNDgsNi45OTlINHogTTIzLDMwICAgYy0zLjg2NS0wLjAwOC02Ljk5NC0zLjEzNS03LTYuOTk5YzAuMDA2LTMuODY1LDMuMTM1LTYuOTk1LDctN2MzLjg2NSwwLjAwNiw2Ljk5MiwzLjEzNSw3LDdDMjkuOTkyLDI2Ljg2NSwyNi44NjUsMjkuOTkyLDIzLDMweiAgICBNMjIsMTJINnYyaDE2VjEyeiIvPjxwYXRoIGQ9Ik0yOCwyNHYtMi4wMDFoLTEuNjYzYy0wLjA2My0wLjIxMi0wLjE0NS0wLjQxMy0wLjI0NS0wLjYwNmwxLjE4Ny0xLjE4N2wtMS40MTYtMS40MTVsLTEuMTY1LDEuMTY2ICAgYy0wLjIyLTAuMTIzLTAuNDUyLTAuMjIxLTAuNjk3LTAuMjk0VjE4aC0ydjEuNjYyYy0wLjIyOSwwLjA2OC0wLjQ0NiwwLjE1OC0wLjY1MiwwLjI3bC0xLjE0MS0xLjE0bC0xLjQxNSwxLjQxNWwxLjE0LDEuMTQgICBjLTAuMTEyLDAuMjA3LTAuMjAyLDAuNDI0LTAuMjcxLDAuNjUzSDE4djJoMS42NjJjMC4wNzMsMC4yNDYsMC4xNzIsMC40NzksMC4yOTUsMC42OThsLTEuMTY1LDEuMTYzbDEuNDEzLDEuNDE2bDEuMTg4LTEuMTg3ICAgYzAuMTkyLDAuMTAxLDAuMzk0LDAuMTgyLDAuNjA1LDAuMjQ1VjI4SDI0di0xLjY2NWMwLjIyOS0wLjA2OCwwLjQ0NS0wLjE1OCwwLjY1MS0wLjI3bDEuMjEyLDEuMjEybDEuNDE0LTEuNDE2bC0xLjIxMi0xLjIxICAgYzAuMTExLTAuMjA2LDAuMjAxLTAuNDIzLDAuMjctMC42NTFIMjh6IE0yMi45OTksMjQuNDk5Yy0wLjgyOS0wLjAwMi0xLjQ5OC0wLjY3MS0xLjUwMS0xLjVjMC4wMDMtMC44MjksMC42NzItMS40OTgsMS41MDEtMS41MDEgICBjMC44MjksMC4wMDMsMS40OTgsMC42NzIsMS41LDEuNTAxQzI0LjQ5NywyMy44MjgsMjMuODI4LDI0LjQ5NywyMi45OTksMjQuNDk5eiIvPjwvZz48L3N2Zz4=)](https://ui-schema.bemit.codes)

[![Quick-Start](https://img.shields.io/badge/Quick%20Start-blue?labelColor=fff&style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9InN2ZzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9ImJhY2tncm91bmQiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMzIiIHdpZHRoPSIzMiIvPjwvZz48ZyBpZD0ibm90ZXMiPjxwYXRoIGQ9Ik0yNCwxMkg4djJoMTVoMVYxMnogTTI4LDE1LjUxOFY0SDR2MjRoMTEuNTE4YzEuNjE0LDIuNDExLDQuMzYxLDMuOTk5LDcuNDgyLDRjNC45NzEtMC4wMDIsOC45OTgtNC4wMjksOS05ICAgQzMxLjk5OSwxOS44NzksMzAuNDExLDE3LjEzMiwyOCwxNS41MTh6IE0xNS41MTcsMThjLTAuNDEyLDAuNjE2LTAuNzQzLDEuMjg5LTAuOTk0LDJIOHYyaDYuMDU4QzE0LjAyMiwyMi4zMjksMTQsMjIuNjYxLDE0LDIzICAgYzAsMS4wNTQsMC4xOSwyLjA2MSwwLjUyMywzSDZWNmgyMHY4LjUyM0MyNS4wNjEsMTQuMTksMjQuMDU0LDE0LDIzLDE0Yy0yLjE0MywwLTQuMTA3LDAuNzUxLTUuNjUyLDJIOHYySDE1LjUxN3ogTTIzLDI5Ljg4MyAgIGMtMy44MDEtMC4wMDktNi44NzYtMy4wODQtNi44ODUtNi44ODNjMC4wMDktMy44MDEsMy4wODQtNi44NzYsNi44ODUtNi44ODRjMy43OTksMC4wMDgsNi44NzQsMy4wODMsNi44ODMsNi44ODQgICBDMjkuODc0LDI2Ljc5OSwyNi43OTksMjkuODc0LDIzLDI5Ljg4M3oiLz48cG9seWdvbiBwb2ludHM9IjE4LDIzIDIwLDIxIDIyLDIzIDI2LDE5IDI4LDIxIDIyLDI3ICAiLz48L2c+PC9zdmc+)](https://ui-schema.bemit.codes/en/quick-start)

[![Schema Examples + Live Editor](https://img.shields.io/badge/Schema%20Examples%20+%20Live%20Editor-green?labelColor=fff&color=1e970c&style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE3ElEQVR4nO2bX0xbVRzHz9TExKc9mBjjn+gLgcEA2wL33ra3pV0pf/uX3t6yMAQKEkahlQkBNavbMG6BYMzG4nxYYZBoycIMfxJ9cL4oI5CYGR7FLAtkeyA+oEHDgJ8PBnLPhULLbXt0nm/yfeltcn7fzzn3nHvOzUWIiooqHQqHw88lYkJlJk++en/kJMNvZ6gYUOK3dMWbvvqmj0jnSUi9fX0vnSjUKgoudS5r2CKdKSH1Dg6+nEwAeZzpvwUAIYTO+N/5Mpc1KL4F8rXG7ZrGpk9I5zmSotHos9lFOizQj7OzMD8/H9P52mLs/4Guy6+SzqFIcgCz9+7BwsJCTMsBhEKXXiGdQZEoAAqAAqAAKAAKgAKgACgACoACoAAoAAqAAqAAKID/HQDZ6bCJNYCZ5WM6U80+PQCi3d2vZ8kCJeqPAwE96RxH1qWa0z8rCZ+hYqDL7fmVdI4jaSIcPs4X6RWFz1AxoC7QwhdtbW+SzpOw+n21P0iDnFSzsOhwwgOX+0AvOV3AFHAYhA88vkXSeRLSTCDw/CkOfyt0vtgC4PXG5SFLKQaAKdRCfzj8IulccevTuoYZaYAsFQPLLnfcANY8HlBp8FEQ9p2eI50rLgFCx+xa0xY2kRnNcYffcb/ZigEwMPrtz5ubXyCd71BdrfePSQvPVLOw5HTFDLoSCsHkyAhMRSLwOBDY/X3VXQ25siW0r6b2W9L5DpVQXLIpLbqNNx3Y01+PjkI0GoVoNArTN29i1y6YLBgAC2fYRgg9QzpjTN1oavpMvowtOpyxAYgiTEgATEUi+OhwV8MJ2Si4XNfwFemcMVVnKtmQFtugKz70Xn947hxMjI7CnVu3YCUY3HO922DGANh48ybpnPsq0tr+vrz352yO+CY9UYx5bcnp2rM/GGj0D5HOu0ctJZXr0iJFzpDwzB/LAd6EAfAaT22QzotprL29Wd5LdyurkgZg0eHc84g82NwSJp17V8FK+xp2n7J80sLvuEFnxACcMZf+STo3Qgih8WCnK1vW+9PllbuFL0vW+Uft7UcGMGdz7BkFQ/7ms6Tzoy67axVbqxk9bAnCbuF3pMvc8LCiUSByBgxAk7Xqd6Lhb3d08HmyZ/bx0oqY6/zkyIgiAN9X2bC2MtUsXG05KxAD8KFTWMGe1wt18ETS++D1wsPOzgPX+URtY3kMQmuF7Tci4afC4RyNbN8+bC3bv3BRPHCtl3o5FILJ4eF/9gb7zBnT5ZVYm9lqFq77W0xpB3BREH/B9uwFHKzLej9hiyI2Z8j3BuD1wpYggIXBT5rerXI/Smv4bwYGXuMK8ePuIUup8uXukL3BjqNlFVjbeRoObrS25qcNwBVf7X1pASoNB2sej3IA3sP3BuD1woYgAC9739CbrsPTu4ODx42yIdhvtiYlfCJzRsRajtWgKeDgejD4RsoBXKtr/E7acK6ahVV3dXIBxOF1QYCiAvyly3mP737KAdSZrE+kjV4wxX/YmWxfkx2e2nXm1H9XID+s/MnugL8EgYgfuNxYLVkqBhBCx1IKgE3ilyDJdo6GTT2Angr7H6SDxvLblrLU7xBv9/TYrLLH0X+DDYwexjo6PCkHgBBCM+/1GK54fY+tLA/ZahZy1AwRZ6tZMDB6uOisXh3v7CxLS3gqKqqnSn8D0EwMpE6f7XEAAAAASUVORK5CYII=)](https://ui-schema.bemit.codes/examples)

[![Chat on Spectrum](https://img.shields.io/badge/Chat%20on%20Spectrum-blue?labelColor=fff&logoColor=505050&color=7B16FF&style=for-the-badge&logo=spectrum)](https://spectrum.chat/ui-schema)

**🚀 Demo: UI-Schema + Material Design + CRA**

[![Fullscreen Demo](https://img.shields.io/badge/Fullscreen%20Demo-green?labelColor=fff&color=1e970c&style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACRUlEQVR4nO3aTYiNUQDG8Z/xWRSFBRZYYSGSZCdFiZ0sFSuTjbJUdqMslGIhlmI3shGRJnZYkQVWZjNZmPIRNfIxr8Xt1JivO/ed95zzXvf917N/nn/3drvnHBoaGhoaGjphIU7iJq7jYNY2iVmCIRST8hDbMvZKxllTx4f8whWsytYuAY/NLCBkFKe1vir/Hc+1FxDyGvvz1IxHJwJC7mJzjrIxKCOgwA9cxIr0laulrICQDziBBamLV8V8BYS8wN7E3SuhKgEFxnEL65MumCdVCgj5jvNYlnBHaWIICBnGsXRTyhFTQMgT7Eg1qFNSCCjwBzewJs2suZNKQMhnrf8fi1OMmwupBYS8xaEE+9qSS0DIfWyJvnIWcgso8BOXsTLy1mmpg4CQjziFvqiLJ1EnASEvsS/m6InUUUDIIDbGm96izgIKjGEAy3tVQMgIDvSygPBp2NrLAgpc7XUB93pdwKVeFvBVhJ/FbhHwBrurHt8NAj7hDBbFGF9nAb9xDatjDQ/UUcAQtsccPZE6CXiPo3HnTqUOAr7hHJZG3jotOQWMa71KWRd95SzkEvAMexLsa0tqASM4rkaXqakEjOGCiP/ry5JCwCA2JdrTMTEFvJLwbK8sMQSMol/i092yVCkgnO931bO6qgQ8kPmGpyzzFfAOh5O3rpCyAr6o2S1vWToVEO751+YoG4NOBDzFziwtI/JI++HDuuCtT1n6zTy8q157laUPd/w7fBy3sSFjr+Qc0TpzH8CuzF0aGhoaGhoayvEXCYka61umCF0AAAAASUVORK5CYII=)](https://ui-schema-build.elbakerino.repl.co)

[![Run on CodeSandbox](https://img.shields.io/badge/run%20on%20CodeSandbox-blue?labelColor=fff&logoColor=505050&style=for-the-badge&logo=codesandbox)](https://codesandbox.io/s/github/ui-schema/demo-cra/tree/master/?autoresize=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2FSchema%2FDemoEditor.js)

[![Run on Repl.it](https://img.shields.io/badge/repl.it-grey?labelColor=fff&style=for-the-badge&logo=repl.it)](https://repl.it/@elbakerino/ui-schema-cra) [![Clone on Repl.it](https://img.shields.io/badge/repl.it%20clone-grey?labelColor=fff&style=for-the-badge)](https://repl.it/github/ui-schema/demo-cra)

*[Demo Source](https://github.com/ui-schema/demo-cra)*

---

>
> ⚠️Work in progress!
>
> UI-Schema is an extract and rewrite of the form-generator logic used internally by our admin panel.
> 
> The fundamentals are working, but a lot of JSON-schema stuff, code testing and widgets needs to be done.

## Schema

JSON-Schema included keywords are used to describe the data and create the UI based on the data-schema and special UI keywords. A data-schema with integrated ui-schema enforces the consistency of the UX across different apps and devices.

*[Schema Documentation](https://ui-schema.bemit.codes/en/docs/schema)*

## Basic Example

This example show all available props. First time? [Take the quick-start](https://ui-schema.bemit.codes/en/quick-start) or take a look into the [create-react-app UI-Schema example](https://github.com/ui-schema/demo-cra).

```js
import React from "react";
import {ImmutableEditor, themeMaterial} from 'react-immutable-editor';// optional

// Import Schema-Editor
import {SchemaEditor, isInvalid, createMap, createOrderedMap, createStore, createEmptyStore, updateValue} from "@ui-schema/ui-schema";
// Get the widgets binding for your design-system
import {widgets} from "@ui-schema/ds-material";

// could be fetched from some API or bundled with the app
const schemaBase = {
    type: "object",
    properties: {
        country: {
            type: "string",
            widget: 'Select',
            enum: [
                "usa",
                "canada",
                "eu"
            ],
            default: "eu"
        },
        name: {
            type: "string",
            minimum: 2,
            maximum: 1,
        }
    },
    required: [
        "country",
        "name",
    ],
};
const data = {};

const Editor = () => {
    // optional state for display errors/validity
    const [showValidity, setShowValidity] = React.useState(false);
    
    // needed variables and setters for the SchemaEditor, create where ever you like
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(data)));
    const [schema, setSchema] = React.useState(() => createOrderedMap(schemaBase));
    
    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={store}
            onChange={setStore}

            showValidity={showValidity}
            widgets={widgets}

            {/* 
              * or write onChange like:
              * handler must get the previous state as value, it must be an immutable map, will return updated map
            */}
            onChange={handler => setStore(handler(data))}
        >
            <SchemaDebug setSchema={setSchema}/>
        </SchemaEditor>
        <button
            {/* show the validity only at submit (or pass `true` to `showValidity`) */} 
            onClick={() => isInvalid(store.getValidity()) ? setShowValidity(true) : doingSomeAction()}
        >send!</button>
    </React.Fragment>
};

// Developer tool for live data and schema display and manipulation, optional
// Recommended for production:
//     use dynamic code-splitting to not bundle the SchemaDebug
//     use e.g. `react-loadable`
const SchemaDebug = ({setSchema}) => {
     const {valueStore, schema, onChange} = useSchemaStore();

    return <React.Fragment>
        <ImmutableEditor
            data={store}
            onChange={(keys, value) => onChange(updateValue(keys, value))}
            getVal={keys => valueStore.getIn(keys)}
            theme={themeMaterial}
        />
        <ImmutableEditor
            data={schema} onChange={setSchema} getVal={keys => schema.getIn(keys)}
            theme={themeMaterial}/>
    </React.Fragment>
};

export {Editor}
```

## Contributing

1. Fork/Clone Repository
2. Install root dev-dependencies (like lerna, webpack): `npm i`
3. Start dev-server: `npm start` (will clean-dist + symlink-es-modules + init & hoist packages + starting demo app)
4. Open browser on [localhost:4200](http://localhost:4200)
5. Explore [packages](packages)
8. Code -> Commit -> Pull Request -> Being Awesome!

Changes from any package are reflected inside the demo/docs package.

- Start Documentation: `npm run docs` (needs running demo server)
    - see [localhost:4200](http://localhost:4201)
    - write in [packages/docs/src/content/docs](./packages/docs/src/content/docs)
- or: starting Demo + Docs (after having initialized, hoisted it manually): `npm run serve`


Commands:
- Build: `npm run build`
- Clean node_modules and build dirs: `npm run clean`
- Clean build dirs: `npm run clean-dist`
- Add new node_module to one package: `lerna add <npm-package-name> --scope=@ui-schema/demo [--dev] [--peer]`, without `--scope` in all packages
- Do not change package.json of packages manually, and if Bootstrap [lerna](https://lerna.js.org/): `npm run bootstrap`
- Add new package `lerna create <name>` and follow on screen, e.g.: `lerna create material-pickers` add package name `@ui-schema/material-picker`, creates folder `./packages/material-pickers`


Publish, for main-repo only:

1. Currently manually `lerna version <semver> --no-git-tag-version` is needed
    - like `lerna version 0.0.2 --no-git-tag-version`, see [docs](https://github.com/lerna/lerna/tree/master/commands/version#lifecycle-scripts)
2. Then tag the commit with the same version
3. Push, CI will publish to npm using `npm run release -- --yes`
    - this leads to: `lerna publish from-package --no-git-reset --yes`
4. **todo:** automate version bump by git-tags w/ publish, and switch to independent lerna versioning

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

© 2020 bemit UG (haftungsbeschränkt)

### License Icons

The icons in the badges of the readme's are either from [simpleicons](https://simpleicons.org) or are licensed otherwise:

- [Play Icon © Chanut is Industries, CC BY 3.0](https://www.iconfinder.com/icons/928430/go_media_music_play_playing_start_icon) 
- [Experiment Icon © Ardiansyah Ardi, CC BY 3.0](https://www.iconfinder.com/icons/4951169/chemical_experiment_glass_lab_medical_icon) 
- [Doc Icons © PICOL, CC BY 3.0](https://www.iconfinder.com/iconsets/picol-vector) 

### Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the MIT License attached to the repository.

***

Created by [Michael Becker](https://mlbr.xyz)
