import { Map } from 'immutable'
import { addNestKey, Validity } from '@ui-schema/react/UIStore'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'

export function getValidity(storeKeys: StoreKeys, validity: Map<string, unknown> | undefined): Validity | undefined {
    const validityTmp = storeKeys.size ? validity?.getIn(addNestKey('children', storeKeys)) : validity
    return Map.isMap(validityTmp) ? validityTmp as unknown as Validity : undefined
}

/**
 * @deprecated use `getValidity` instead
 */
export const doExtractValidity = getValidity
