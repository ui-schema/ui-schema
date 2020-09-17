import React from 'react';
import {UIMetaProvider, useUIMeta,} from "../UIStore";
import {PluginStack} from "../PluginStack";

/**
 * Simple nested-schema renderer, begins directly at `group`/`widget` level and reuses the context/hooks of the parent UIGenerator
 *
 * @todo it should be possible to also attach on `onChange` of store
 */
export const UIGeneratorNested = ({
                                       schema, parentSchema, storeKeys,
                                       showValidity, widgets, t,
                                       level = 0, ...props
                                   }) => {
    const meta = useUIMeta();

    return <UIMetaProvider
        {...meta}
        showValidity={showValidity || meta.showValidity}
        widgets={widgets || meta.widgets}
        t={t || meta.t}
    >
        <PluginStack
            schema={schema}
            parentSchema={parentSchema}
            storeKeys={storeKeys}
            level={level}
            {...props}
        />
    </UIMetaProvider>
};
