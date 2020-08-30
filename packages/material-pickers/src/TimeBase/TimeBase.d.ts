// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface additionalProps {
    hideTabs: boolean
    ampm: boolean
    minutesStep: number
}

export function addAdditionalProps(schema: StoreSchemaType): additionalProps
