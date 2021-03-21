import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export function mapSchema<K extends {}>(inputProps: K, schema: StoreSchemaType): K

export function checkNativeValidity(currentRef: {}, valid: boolean): boolean
