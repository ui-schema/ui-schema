import { schema } from '@ui-schema/ui-schema/CommonTypings'

export interface additionalProps {
    hideTabs: boolean,
    ampm: boolean,
    minutesStep: number,
}

export function addAdditionalProps(schema: schema): additionalProps
