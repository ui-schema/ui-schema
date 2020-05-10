import * as React from "react"
import { widgetsBase } from "../widgetsBase"
import { NextPluginRendererProps } from '../EditorPluginStack'

export interface ValidatorStackProps {
    widgets: widgetsBase
}

export type nextPluginRendererProps = (props: ValidatorStackProps) => NextPluginRendererProps

// tslint:disable-next-line:no-empty-interface
export interface ValidatorStack extends  nextPluginRendererProps {
}
