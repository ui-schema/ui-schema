import CircularProgress from '@mui/material/CircularProgress'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { resourceFromSchema, SchemaResource, getBaseUrl } from '@ui-schema/ui-schema/SchemaResource'
import { createOrdered } from '@ui-schema/ui-schema/createMap'
import React, { useEffect, useMemo, useState } from 'react'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { SchemaResourceProvider } from '@ui-schema/react/SchemaResourceProvider'

const loadSchema = (url: string, versions?: string[]) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

export const MainDummy = ({schema, Debugger, Button}) => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')))

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

    // todo: refine remote resources injection, e.g. to not need re-building of the whole resource
    const [loading, setLoading] = useState<boolean>(false)
    const [resources, setResources] = useState<Record<string, SchemaResource>>({})
    const resource = useMemo(() => (schema ? resourceFromSchema(schema, {resources}) : undefined), [schema, resources])

    useEffect(() => {
        if (!resource?.unresolved) {
            setLoading(false)
            return
        }
        const abort = new AbortController()
        setLoading(true)
        // todo: improve handling async loading of remote resources
        //       - resolve nested resources
        //       - granular loading states/progress
        //       - no flashing of "unresolved" when not yet started to load
        // normalizing missing uris, e.g. remove json-pointer, to load it only once
        const schemaUris = Object.keys(resource?.unresolved)
            .map(uri => getBaseUrl(uri))
            // remove empty string uris, as those where no absolute uris
            .filter(uri => uri)

        // todo: this does not support loading further unresolved schemas of the loaded schemas
        // todo: use allSettled and use those which where successfull
        Promise.all(
            schemaUris.map(schemaUri => loadSchema(schemaUri)),
        )
            .then((loaded) => {
                if (abort.signal.aborted) return
                setLoading(false)
                const resolvedResources = schemaUris.reduce((resolvedResources, schemaUri, i) => {
                    const resolvedSchema = loaded[i]
                    resolvedResources[schemaUri] = resourceFromSchema(createOrdered(resolvedSchema))
                    return resolvedResources
                }, {})
                setResources(r => ({
                    ...r,
                    ...resolvedResources,
                }))
            })
            .catch((e) => {
                if (abort.signal.aborted) return
                setLoading(false)
                console.error('Failure while loading unresolved schema', e)
            })
        return () => abort.abort()
    }, [resource?.unresolved])

    const invalid = isInvalid(store.getValidity())
    return <React.Fragment>
        <UIStoreProvider
            store={store}
            onChange={onChangeNext}
            showValidity={showValidity}
        >
            <SchemaResourceProvider
                // schema={schema}
                resource={resource}
                // loadSchema={loadSchema}
            >
                {loading ? <CircularProgress sx={{mx: 'auto'}}/> : null}
                {!loading && resource?.unresolved ?
                    <Alert severity={'error'} variant={'outlined'}>
                        <AlertTitle>{'Unresolved Schemas'}</AlertTitle>
                        {Object.entries(resource?.unresolved).map(([refCanonical, dependingBranches]) =>
                            <Box key={refCanonical}>
                                <Typography>{refCanonical}</Typography>
                                <Typography color={'textSecondary'} fontStyle={'italic'}>{'is referenced by:'}</Typography>
                                <Box component={'ul'} mt={0}>
                                    {dependingBranches.map((branch, i) =>
                                        <li key={i}>
                                            <Typography>{branch.canonical.canonicalLocation}</Typography>
                                        </li>)}
                                </Box>
                            </Box>)}
                    </Alert> : null}
                {!loading ?
                    <GridContainer>
                        <WidgetEngine isRoot schema={resource?.branch.value()}/>
                    </GridContainer> : null}
            </SchemaResourceProvider>

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

            <Debugger schema={resource?.branch.value()}/>
        </UIStoreProvider>
    </React.Fragment>
}
