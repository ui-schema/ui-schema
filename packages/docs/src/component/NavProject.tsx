import React from 'react'
import GithubLogo from '../asset/GithubLogo'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Markdown } from './Markdown'

export default function NavProject() {
    return <React.Fragment>
        <Markdown source={`
- @ui-schema/ui-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/ui-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/ui-schema)
- @ui-schema/react [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/react?style=flat-square)](https://www.npmjs.com/package/@ui-schema/react)
- @ui-schema/json-schema [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/json-schema?style=flat-square)](https://www.npmjs.com/package/@ui-schema/json-schema)
- @ui-schema/json-pointer [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/json-pointer?style=flat-square)](https://www.npmjs.com/package/@ui-schema/json-pointer)
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
- Additional Packages, not only for UI Schema:
    - CodeMirror v6 kit: \`@ui-schema/kit-codemirror\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/kit-codemirror?style=flat-square)](https://www.npmjs.com/package/@ui-schema/kit-codemirror) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=0a6e8a&color=61dafb&logoColor=ffffff&style=flat-square&logo=react)](/docs/kit-codemirror/kit-codemirror) [![repo](https://img.shields.io/badge/Repo-green?labelColor=000000&color=f4f6f7&logoColor=ffffff&style=flat-square&logo=github)](https://github.com/ui-schema/react-codemirror/tree/main/packages/kit-codemirror)
    - 🚧 Drag 'n Drop kit: \`@ui-schema/kit-dnd\` [![npm (scoped)](https://img.shields.io/npm/v/@ui-schema/kit-dnd?style=flat-square)](https://www.npmjs.com/package/@ui-schema/kit-dnd) [![Component Documentation](https://img.shields.io/badge/Docs-green?labelColor=0a6e8a&color=61dafb&logoColor=ffffff&style=flat-square&logo=react)](/docs/kit-dnd/kit-dnd)
`}/>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
        <Typography component={'a'} variant={'subtitle1'} href={'https://github.com/ui-schema/ui-schema'} style={{textDecoration: 'none'}}>
            <GithubLogo width={32} style={{margin: 16}}/> <Link component={'span'}>Source Code, Issues</Link>
        </Typography>
        <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>

        <Typography component={'a'} variant={'subtitle1'} href={'https://discord.gg/MAjgpwnm36'} style={{textDecoration: 'none'}}>
            <svg
                role="img" style={{display: 'inline-block', padding: 1, margin: 16, boxSizing: 'border-box', height: 32, width: 32, verticalAlign: 'middle'}}
                viewBox="0 -28.5 256 256"
            >
                <g>
                    <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fillRule="nonzero">
                    </path>
                </g>
            </svg>

            {' '}
            <Link component={'span'}>Get Help on Discord!</Link>
        </Typography>
    </React.Fragment>
}
