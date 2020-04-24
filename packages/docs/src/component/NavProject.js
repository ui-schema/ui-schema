import React from "react";
import GithubLogo from "../asset/GithubLogo";
import {Link, Typography} from "@material-ui/core";
import {Markdown} from "./Markdown";

export default () => <React.Fragment>
    <Markdown content source={`
- [![Travis (.org) branch](https://img.shields.io/travis/ui-schema/ui-schema/master?style=flat-square)](https://travis-ci.org/ui-schema/ui-schema) [![react compatibility](https://img.shields.io/badge/React-%3E%3D16.8-success?style=flat-square&logo=react)](https://reactjs.org/) [![MIT license](https://img.shields.io/npm/l/@ui-schema/ui-schema?style=flat-square)](https://github.com/ui-schema/ui-schema/blob/master/LICENSE)
- @ui-schema/ui-schema [![npm (@ui-schema/ui-schema)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema) 
- @ui-schema/ds-material [![npm (@ui-schema/ds-material)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-material)
- @ui-schema/ds-bootstrap [![npm (@ui-schema/ds-bootstrap)](https://img.shields.io/npm/v/@ui-schema/ds-bootstrap?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-bootstrap)

- Additional Material-UI Widgets:
    - Date-Time Picker: \`@ui-schema/material-picker\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-picker) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](/docs/widgets/DateTimePickers)
    - Codemirror as Material Input: \`@ui-schema/material-code\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-code) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](/docs/widgets/Code)
    - DraftJS as Material TextField: \`@ui-schema/material-richtext\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-richtext) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](/docs/widgets/RichText)
    - Color Pickers: \`@ui-schema/material-color\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-color) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](/docs/widgets/Color)
`}/>
    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
    <Typography component={'p'} variant={'body1'}>
        <GithubLogo style={{marginTop: -2}}/> <Link href={'https://github.com/ui-schema/ui-schema'}>Project, Issues</Link>
    </Typography>
    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
    <Typography component={'p'} variant={'body1'}>
        <svg role="img" style={{display: 'inline-block', padding: 1, margin: 1, boxSizing: 'border-box', width: 20, height: 20, verticalAlign: 'middle'}} viewBox="0 0 24 24" fill="#7B16FF" xmlns="http://www.w3.org/2000/svg">
            <title>Spectrum icon</title>
            <path d="M0 10.2A1.8 1.8 0 001.8 12h1.8a8.4 8.4 0 018.4 8.4v1.8a1.8 1.8 0 001.8 1.8h8.4a1.8 1.8 0 001.8-1.8v-1.8C24 9.133 14.867 0 3.6 0H1.8A1.8 1.8 0 000 1.8v8.4z"/>
        </svg>
        {' '}
        <Link href={'https://spectrum.chat/ui-schema'}>Chat on Spectrum</Link>
    </Typography>
    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
    <Typography component={'p'} variant={'body1'}>
        <span role={'img'} aria-label={'Quick Evaluate'}>🚀</span>{' '}
        <Link href={'https://codesandbox.io/s/github/ui-schema/demo-cra/tree/master/?autoresize=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2FSchema%2FDemoEditor.js'}>Example on CodeSandbox</Link>
    </Typography>
</React.Fragment>;
