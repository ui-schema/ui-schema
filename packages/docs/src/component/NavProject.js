import React from 'react';
import GithubLogo from '../asset/GithubLogo';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {Markdown} from './Markdown';

export default () => <React.Fragment>
    <Markdown content source={`
- [![react compatibility](https://img.shields.io/badge/React-%3E%3D16.8-success?style=flat-square&logo=react)](https://reactjs.org/) [![MIT license](https://img.shields.io/npm/l/@ui-schema/ui-schema?style=flat-square)](https://github.com/ui-schema/ui-schema/blob/master/LICENSE)
- @ui-schema/ui-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema)
- @ui-schema/ds-material [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-material?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-material)
- @ui-schema/ds-bootstrap [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ds-bootstrap?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ds-bootstrap)
- @ui-schema/pro [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/pro?style=flat-square)](https://www.npmjs.com/package/@ui-schema/pro)
- @ui-schema/dictionary [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/dictionary?style=flat-square)](https://www.npmjs.com/package/@ui-schema/dictionary)

- Additional Material-UI Widgets:
    - Date-Time Picker: \`@ui-schema/material-pickers\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-pickers?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-pickers) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/material-pickers/Overview)
    - Codemirror as Material Input: \`@ui-schema/material-code\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-code?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-code) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/material-code/material-code) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-codemirror/tree/main/packages/material-code)
    - \`react-color\` picker: \`@ui-schema/material-color\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-color?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-color) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/material-color/material-color) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-color/tree/main/packages/material-color)
    - \`react-colorful\` picker: \`@ui-schema/material-colorful\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-colorful?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-colorful) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/material-colorful/material-colorful) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-color/tree/main/packages/material-colorful)
    - 🚧 Drag 'n Drop with \`react-dnd\`: \`@ui-schema/material-dnd\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-dnd?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-dnd) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/material-dnd/overview)
    - 🚧 EditorJS as Material TextField: \`@ui-schema/material-editorjs\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-editorjs?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-editorjs) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/widgets/EditorJS)
    - 🚧 SlateJS as Material TextField: \`@ui-schema/material-slate\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/material-slate?style=flat-square)](https://www.npmjs.com/package/@ui-schema/material-slate) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](/docs/widgets/RichText)
- Additional Packages, not only for UI Schema:
    - CodeMirror v6 kit: \`@ui-schema/kit-codemirror\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/kit-codemirror?style=flat-square)](https://www.npmjs.com/package/@ui-schema/kit-codemirror) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=0a6e8a&color=61dafb&logoColor=ffffff&style=flat-square&logo=react)](/docs/kit-codemirror/kit-codemirror) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-codemirror/tree/main/packages/kit-codemirror)
    - 🚧 Drag 'n Drop kit: \`@ui-schema/kit-dnd\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/kit-dnd?style=flat-square)](https://www.npmjs.com/package/@ui-schema/kit-dnd) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=0a6e8a&color=61dafb&logoColor=ffffff&style=flat-square&logo=react)](/docs/kit-dnd/kit-dnd)
`}/>
    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
    <Typography component={'a'} variant={'subtitle1'} href={'https://github.com/ui-schema/ui-schema'} style={{textDecoration: 'none'}}>
        <GithubLogo width={32} style={{margin: 16}}/> <Link component={'span'}>Source Code, Issues</Link>
    </Typography>
    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>

    <Typography component={'a'} variant={'subtitle1'} href={'https://join.slack.com/t/ui-schema/shared_invite/zt-smbsybk5-dFIRLEPCJerzDwtycaA71w'} style={{textDecoration: 'none'}}>
        <svg
            role="img" style={{display: 'inline-block', padding: 1, margin: 1, boxSizing: 'border-box', height: 64, verticalAlign: 'middle'}}
            fill={'currentColor'} viewBox="0 0 270 270"
        >
            <g>
                <g fill={'#e01e5a'}>
                    <path d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"/>
                    <path d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9
			s-12.9-5.8-12.9-12.9V151.2z"/>
                </g>
                <g fill={'#36c5f0'}>
                    <path d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"/>
                    <path d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9
			s5.8-12.9,12.9-12.9H118.8z"/>
                </g>
                <g fill={'#2eb67d'}>
                    <path d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"/>
                    <path d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9
			c7.1,0,12.9,5.8,12.9,12.9V118.8z"/>
                </g>
                <g fill={'#ecb22e'}>
                    <path d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"/>
                    <path d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9
			c0,7.1-5.8,12.9-12.9,12.9H151.2z"/>
                </g>
            </g>
        </svg>

        {' '}
        <Link component={'span'}>Get Help on Slack!</Link>
    </Typography>
</React.Fragment>;
