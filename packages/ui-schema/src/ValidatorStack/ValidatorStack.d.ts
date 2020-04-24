import * as React from "react"
import { widgetsBase } from "../widgetsBase"

export interface ValidatorStackProps {
    widgets: widgetsBase
}

export function ValidatorStack<P extends ValidatorStackProps>(props: P): React.Component<P>
