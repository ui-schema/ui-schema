import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export type SimpleListItemProps = Pick<WidgetProps, 'showValidity' | 'schema' | 'storeKeys' | 'notDeletable' | 'btnSize' | 'readOnly' | 'required' | 'onChange' | 'level' | 'index'>

export function SimpleListItem<P extends SimpleListItemProps>(props: P): React.ReactElement

export function SimpleList<P extends WidgetProps>(props: P): React.ReactElement
