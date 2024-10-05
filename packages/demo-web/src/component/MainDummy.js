import React from 'react';
import {isInvalid} from '@ui-schema/react/ValidityReporter';
import {injectWidgetEngine} from '@ui-schema/react/applyWidgetEngine';
import {createEmptyStore, UIStoreProvider} from '@ui-schema/react/UIStore';
import {storeUpdater} from '@ui-schema/react/storeUpdater';
import {GridContainer} from '@ui-schema/ds-material/GridContainer';

const GridStack = injectWidgetEngine(GridContainer)
const MainDummy = ({schema, Debugger, Button}) => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')));

    const onChangeNext = React.useCallback((actions) => {
        setStore(prevStore => {
            const newStore = storeUpdater(actions)(prevStore)
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
        <UIStoreProvider
            store={store}
            onChange={onChangeNext}
            showValidity={showValidity}
        >
            <GridStack isRoot schema={schema}/>
            <Debugger schema={schema}/>
        </UIStoreProvider>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
    </React.Fragment>
};

export {MainDummy}
