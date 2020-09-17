import * as React from "react"
import { UIMetaContext, UIStoreContext } from "../UIStore"

export function UIProvider<P extends React.PropsWithChildren<UIMetaContext & UIStoreContext>>(props: P): React.ReactElement

export function UIGenerator<P extends React.PropsWithChildren<UIMetaContext & UIStoreContext>>(props: P): React.ReactElement
