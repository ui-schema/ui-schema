import { Map } from 'immutable'

export function mapSchema<K>(inputProps: {}, schema: Map<K, undefined>): string

export function checkNativeValidity(currentRef: {}, valid: boolean): string
