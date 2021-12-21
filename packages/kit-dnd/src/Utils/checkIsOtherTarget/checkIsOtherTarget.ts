import { DataKeys } from '@ui-schema/kit-dnd/KitDnd'

export const checkIsOtherTarget = (
    {
        toIndex, toDataKeys,
        fromIndex, fromDataKeys,
    }: {
        toIndex: number
        toDataKeys: DataKeys
        fromIndex: number
        fromDataKeys: DataKeys
    }
): boolean => {
    const sameKeys = fromDataKeys.equals(toDataKeys)
    return !sameKeys || (toIndex !== fromIndex)
}
