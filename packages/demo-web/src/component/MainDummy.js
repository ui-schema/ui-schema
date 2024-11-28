import React from 'react';
import {isInvalid} from '@ui-schema/react/ValidityReporter';
import {injectWidgetEngine} from '@ui-schema/react/applyWidgetEngine';
import {createEmptyStore, UIStoreProvider} from '@ui-schema/react/UIStore';
import {storeUpdater} from '@ui-schema/react/storeUpdater';
import {GridContainer} from '@ui-schema/ds-material/GridContainer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

    const invalid = isInvalid(store.getValidity())
    return <React.Fragment>
        <UIStoreProvider
            store={store}
            onChange={onChangeNext}
            showValidity={showValidity}
        >
            <GridStack isRoot schema={schema}/>

            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Button
                    onClick={() => setShowValidity(!showValidity)} sx={{flexGrow: 1}}
                >
                    {`${showValidity ? 'hide' : 'show'} validity`}
                </Button>
                <Typography
                    fontWeight={'bold'}
                    variant={'caption'}
                    sx={{
                        backgroundColor: `${invalid ? 'error' : 'success'}.main`,
                        color: `${invalid ? 'error' : 'success'}.contrastText`,
                        borderRadius: 3,
                        px: 1,
                        py: 0.5,
                        mr: 'auto',
                    }}
                >
                    {invalid ? 'invalid' : 'valid'}
                </Typography>
            </Box>

            <Debugger schema={schema}/>
        </UIStoreProvider>
    </React.Fragment>
};

export {MainDummy}
