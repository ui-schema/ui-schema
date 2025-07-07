import React from 'react';
import {ImmutableEditor} from 'react-immutable-editor';
import {SchemaDebug} from './SchemaDebug';
import clsx from 'clsx';

const themeOneLight = {
    scheme: 'One Light',
    author: 'Daniel Pfeifer (http://github.com/purpleKarrot)',
    base00: '#fafafa',
    base01: '#f0f0f1',
    base02: '#e5e5e6',
    base03: '#a0a1a7',
    base04: '#696c77',
    base05: '#383a42',
    base06: '#202227',
    base07: '#090a0b',
    base08: '#ca1243',
    base09: '#d75f00',
    base0A: '#c18401',
    base0B: '#50a14f',
    base0C: '#0184bc',
    base0D: '#4078f2',
    base0E: '#a626a4',
    base0F: '#986801',
};

const BtsJsonEditor = ({title, ...p}) => <div className={clsx('shadow-sm', 'px-4', 'py-4', 'my-4', 'bg-light', 'border')} /*style={{backgroundColor: "#002b36"}} */>
    {title}
    <ImmutableEditor
        {...p}
        theme={themeOneLight}
    />
</div>;

const BtsSchemaDebug = p => <SchemaDebug StyledEditor={BtsJsonEditor} {...p}/>;

export {BtsSchemaDebug}
