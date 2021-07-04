import React from 'react';
import {applyPluginStack} from '@ui-schema/ui-schema/applyPluginStack';
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable';

const ObjectGroupBase = ({schema, children, onSchema}) => {
    const currentSchema = useImmutable(schema)

    React.useEffect(() => {
        if(onSchema) {
            onSchema(currentSchema)
        }
    }, [onSchema, currentSchema])

    return <>
        {children}
    </>
};
export const ObjectGroup = applyPluginStack(ObjectGroupBase);
