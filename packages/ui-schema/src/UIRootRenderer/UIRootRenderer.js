import React from 'react';
import {List} from 'immutable';
import {useUIMeta, useUI} from '../UIStore';
import {PluginStack} from '../PluginStack';
import {memo} from '../Utils/memo';

/**
 * @type {function({rootRenderer: *, ...}): *}
 */
let DumpRootRenderer = ({rootRenderer: RootRenderer, ...props}) => {
    return props.isVirtual ?
        <PluginStack {...props}/> :
        <RootRenderer>
            <PluginStack {...props}/>
        </RootRenderer>;
};
DumpRootRenderer = memo(DumpRootRenderer);

const mustBeSet = name => {
    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.error(name + ' must be set');
    }
    return null;
};

/**
 * Initial rendering of root container and invoking the first schema-group with the root-level-data of `schema`
 *
 * @return {null|*}
 */
export const UIRootRenderer = () => {
    // getting the root level schema, all other schemas within an editor are property calculated
    const {schema} = useUI();
    const {widgets} = useUIMeta();

    if(!schema) {
        return mustBeSet('schema');
    }
    if(!widgets) {
        return mustBeSet('widgets');
    }

    const {RootRenderer} = widgets;

    if(!RootRenderer) {
        if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            console.error('Widget RootRenderer not existing');
        }
        return null;
    }

    return <DumpRootRenderer
        rootRenderer={RootRenderer} isVirtual={schema?.get('hidden')}
        schema={schema} storeKeys={List([])}
    />;
};
