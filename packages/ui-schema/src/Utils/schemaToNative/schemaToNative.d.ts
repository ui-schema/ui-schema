import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export function mapSchema<K>(inputProps: {}, schema: StoreSchemaType): string

export function checkNativeValidity(currentRef: {}, valid: boolean): string
