// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
export * from './ColorBase'
export * from './ColorDialogBase'
export * from './ColorStaticBase'

export function restrictColors(pickerProps: string[], schema: StoreSchemaType, nestedArray: false): Function

export type DEFAULT_CONVERTER = string
export type converters = object
