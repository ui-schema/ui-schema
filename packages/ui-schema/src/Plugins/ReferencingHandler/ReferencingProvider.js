import React from 'react';

const ReferencingContext = React.createContext({
    id: '',
    definitions: undefined,
});

export const isRelUrl = (schemaRef) => {
    return (
        schemaRef.indexOf('https://') !== 0 &&
        schemaRef.indexOf('http://') !== 0 &&
        schemaRef.indexOf('ftp://') !== 0 &&
        schemaRef.indexOf('ftps://') !== 0 &&
        schemaRef.indexOf('#') !== 0
    )
}

// todo: also remove GET params?
const removeFragmentFromRevUrl = (url) => url.substr(
    url.indexOf('#/') !== -1 ? url.indexOf('#/') + 2 :
        url.indexOf('#') !== -1 ? url.indexOf('#') + 1 : 0,
)

export const getFragmentFromUrl = (url) => {
    const revUrl = [...url].reverse().join('')
    const revUrlFragment = revUrl.substr(0,
        revUrl.indexOf('#/') !== -1 ? revUrl.indexOf('#/') :
            revUrl.indexOf('#') !== -1 ? revUrl.indexOf('#') : 0,
    )
    return [...revUrlFragment].reverse().join('')
}

export const getCleanRefUrl = (schemaRef) => {
    if(schemaRef) {
        const revId = [...schemaRef].reverse().join('')
        const revIdNoFragment = removeFragmentFromRevUrl(revId)
        schemaRef = [...revIdNoFragment].reverse().join('')
    }

    return schemaRef
}

export const makeUrlFromRef = (schemaRef, id) => {
    let schemaUrl = schemaRef
    if(id) {
        const revId = [...id].reverse().join('')
        const revIdNoFragment = removeFragmentFromRevUrl(revId)
        const uriBase = [...revIdNoFragment.substr(revIdNoFragment.indexOf('/'))].reverse().join('')
        schemaUrl = uriBase + schemaRef
    } else {
        console.warn('relative uri ref without root id', schemaRef)
    }
    return schemaUrl
}

export const ReferencingProvider = ({id, definitions, children}) => {
    // todo: it could be, for e.g. dynamically included schemas,
    //  that they introduce a new schema $id, $defs and so on,
    //  the subschema must use those, instead of the root-schema,
    //  but it should maybe inherit `$defs`, check spec.!
    const prevDef = React.useRef(undefined)
    const sameDef = prevDef.current?.equals(definitions)

    const context = React.useMemo(() => ({
        id,
        definitions,
    }), [id, sameDef])

    return <ReferencingContext.Provider value={context}>
        {children}
    </ReferencingContext.Provider>
}

export const useRefs = () => {
    return React.useContext(ReferencingContext);
}
