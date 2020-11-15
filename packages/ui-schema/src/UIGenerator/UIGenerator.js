import React from 'react';
import {UIStoreProvider, UIMetaProvider, UIStore} from '../UIStore';
import {UIRootRenderer} from '../UIRootRenderer';

/**
 * Main Component to create a schema based UI generator
 */
export const UIGenerator = ({
                                children,
                                ...props
                            }) => (
    <UIProvider {...props}>
        <UIRootRenderer/>
        {children}
        {/* providing a dynamic ui context and rendering the root renderer */}
    </UIProvider>
);

export const UIProvider = ({
                               children,
                               schema,
                               store, onChange, onChangeNext,
                               widgets, t,
                               showValidity,
                           }) => {
    if(!(store instanceof UIStore)) {
        console.error('given store must be a valid UIStore')
        return null;
    }
    return <UIStoreProvider store={store} onChange={onChange} onChangeNext={onChangeNext} schema={schema}>
        <UIMetaProvider widgets={widgets} t={t} showValidity={showValidity}>
            {children}
        </UIMetaProvider>
    </UIStoreProvider>
};
