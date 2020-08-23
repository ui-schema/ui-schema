import { widgetsBase } from "../widgetsBase"
import { NextPluginRendererProps } from '../EditorPluginStack'

export interface ValidatorStackProps {
    widgets: widgetsBase
}

export type nextPluginRendererProps = (props: ValidatorStackProps) => NextPluginRendererProps

// tslint:disable-next-line:no-empty-interface
export type ValidatorStack = nextPluginRendererProps
