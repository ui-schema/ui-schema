import * as React from "react"
import { OrderedMap, List } from 'immutable'

export interface validate {
    schema: OrderedMap<{}, undefined>,
    value: any,
    errors: List<{}>,
    valid: boolean
}
