import * as React from 'react'

export type RichTextContext = React.Context<{}>

export type RichTextProvider = (props: React.PropsWithChildren<RichTextContext>) => React.Component
export function useRichText(): RichTextContext
