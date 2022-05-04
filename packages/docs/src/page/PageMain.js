import React from 'react';
import {Paper, Typography} from '@mui/material';
import {PageTitle, PageContent} from '@control-ui/kit/PageContent';
import NavProject from '../component/NavProject';
import {HeadMeta} from '@control-ui/kit/HeadMeta';
import {Logo} from '../asset/logo'
import Nav from '../component/Nav';
import {Link} from '@control-ui/kit';
import {Markdown} from '../component/Markdown';

export default function PageMain() {
    return (
        <>
            <HeadMeta
                title={'Automatic UIs with JSON-Schema + UI-Schema for React'}
                description={'Generate your UI from JSON-Schema, build advanced forms, easily implement own widgets! UI-Schema for React supports any design-system.'}
            />
            <PageContent maxWidth={'md'}>
                <PageTitle title={<span style={{display: 'flex', alignItems: 'center'}}>
                    <Logo width={55}/>
                    <span style={{marginLeft: 16, fontSize: '4rem'}}>Schema</span>
                </span>}/>

                <Paper style={{margin: '12px 0', padding: 24, borderRadius: 5}} variant={'outlined'}>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        <strong>UI and Form generator</strong> for React, build around a <strong>powerful widget system</strong>, made for <strong>beautiful and great experiences</strong>!
                    </Typography>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        Use <strong>JSON-Schema</strong> to define data-structures and <strong>render the UI automatically</strong>, customize everything with components - UI Schema handles all the validation and data-bindings to give you a great DX.
                    </Typography>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        Widgets are defined per <strong>design-system</strong>, use the ds-binding you need or <Link to={'/docs/widgets'} primary={<strong>create your own easily</strong>}/>.
                    </Typography>
                </Paper>

                <Paper style={{margin: '12px 0', padding: 24, borderRadius: 5}} variant={'outlined'}>
                    <Nav/>
                </Paper>

                <Paper style={{margin: '12px 0', padding: 24, borderRadius: 5}} variant={'outlined'}>
                    <NavProject/>
                </Paper>

                <Paper style={{margin: '12px 0', padding: 24, borderRadius: 5}} variant={'outlined'}>
                    <Markdown source={`
## Features

- add any design-system and custom widget
    - easily create isolated and atomic widgets, with autowired data and validations
    - customize design system behaviour with e.g. widget compositions
    - easy binding of own design systems and custom widgets
    - [auto-rendering by data & schema](/quick-start) or [full-custom forms](/quick-start?render=custom) with autowired widgets
    - easily add advanced features like [read-or-write mode](/docs/core-meta#read-context)
- flexible translation of widgets
    - with any library ([\`t\` prop (Translator)](/docs/localization#translation), [\`Trans\` component](/docs/localization#trans-component))
    - in-schema translations ([\`t\` keyword](/docs/localization#translation-in-schema))
    - label text transforms ([\`tt\`/\`ttEnum\` keyword](/docs/localization#text-transform))
    - single or multi-language
    - for labels, titles, errors, icons...
    - (optional) [tiny integrated translation library](/docs/localization#immutable-as-dictionary)
    - (optional) [translation dictionaries](./packages/dictionary)
- modular, extensible and slim core
    - add own [plugins](/docs/core-pluginstack)
    - add own validators
    - add own base renderers
    - add own widget matchers & render strategies
    - use what you need
- [performance optimized](/docs/performance), only updates HTML which must re-render, perfect for big schemas
- code-splitting, with custom widget mappings / lazy-loading widgets
- includes helper functions for store and immutable handling
- easy nesting for custom object/array widgets with [\`PluginStack\`](/docs/core-pluginstack)
- validate hidden/auto-generated values, virtualize schema levels ([\`hidden\` keyword](/docs/schema#hidden-keyword--virtualization))
- handle store update from anywhere and however you want
- extensive documentations of core, widgets
- typed components and definitions for JSON Schema and UI Schema
- complex conditionals schemas
- loading / referencing schemas by URL, connect any API or e.g. babel dynamic loading instead
- definitions and JSON-Pointer references in schemas
- JSON Schema extension: UI Schema, change design and even behaviour of widgets
- **JSON Schema versions** supported: Draft 2019-09 / Draft-08, Draft-07, Draft-06, Draft-04
                    `}/>
                </Paper>
            </PageContent>
        </>
    );
}
