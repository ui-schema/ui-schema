import React from 'react';
import {createEmptyStore, isInvalid, UIGenerator} from '@ui-schema/ui-schema';
import {browserT} from '../t';

const MainDummy = ({schema, Debugger, Button, widgets}) => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')));

    return <React.Fragment>
        <UIGenerator
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
        >
            <Debugger/>
        </UIGenerator>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
    </React.Fragment>
};

const useDummy = () => {
    const [showDummy, setShowVDummy] = React.useState({});

    // todo: make real hook/using useCallback
    const toggleDummy = id => {
        let tmp = {...showDummy};
        tmp[id] = !tmp[id];
        setShowVDummy(tmp);
    };
    const getDummy = id => {
        return !!showDummy[id];
    };

    return {
        toggleDummy, getDummy,
    }
};

export {MainDummy, useDummy}
