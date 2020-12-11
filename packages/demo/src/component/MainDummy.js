import React from 'react';
import {createEmptyStore, isInvalid, UIGenerator} from '@ui-schema/ui-schema';
import {browserT} from '../t';
import {storeUpdater} from '@ui-schema/ui-schema/UIStore/storeUpdater';

const MainDummy = ({schema, Debugger, Button, widgets}) => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')));

    const onChangeNext = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            const newStore = storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
            /*const newValue = newStore.getIn(prependKey(storeKeys, 'values'))
            const prevValue = prevStore.getIn(prependKey(storeKeys, 'values'))
            console.log(
                isImmutable(newValue) ? newValue.toJS() : newValue,
                isImmutable(prevValue) ? prevValue.toJS() : prevValue,
                storeKeys.toJS(),
                deleteOnEmpty, type,
            )*/
            return newStore
        })
    }, [setStore])

    return <React.Fragment>
        <UIGenerator
            schema={schema}
            store={store}
            //onChange={setStore}
            onChange={onChangeNext}
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
