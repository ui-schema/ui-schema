import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WithOnChange, WithValue } from '@ui-schema/ui-schema'

export type SimpleListItemProps = Pick<WidgetProps, 'showValidity' | 'schema' | 'storeKeys' | 'notDeletable' | 'btnSize' | 'readOnly' | 'required' | 'onChange' | 'level' | 'index'>

export function SimpleListItem<P extends SimpleListItemProps>(props: P): React.ReactElement

export function SimpleListInner<P extends WidgetProps>(props: P & { listSize: number } & WithOnChange): React.ReactElement

export function SimpleListBase<P extends WidgetProps>(props: P & { listSize: number } & WithOnChange): React.ReactElement

export function SimpleListWrapper<P extends WidgetProps>(props: P & WithValue): React.ReactElement

export function SimpleList<P extends WidgetProps>(props: P): React.ReactElement
