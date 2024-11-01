import * as React from 'react'
import { useSlate } from 'slate-react'
import ToggleButton from '@mui/material/ToggleButton'
import {
    getPreventDefaultHandler,
    someNode, toggleNodeType,
    isMarkActive, toggleMark,
    toggleList, ListOptions,
    setDefaults,
    CodeBlockOptions, CodeLineOptions, CodeBlockInsertOptions, DEFAULTS_CODE_BLOCK, insertEmptyCodeBlock,
    ELEMENT_ALIGN_LEFT,
    ELEMENT_ALIGN_CENTER,
    ELEMENT_ALIGN_RIGHT,
    ELEMENT_ALIGN_JUSTIFY,
    upsertAlign,
} from '@udecode/slate-plugins'
import { FocusEventHandler } from 'react'

export interface ToolbarElementProps {
    type: string
    inactiveType?: string
    unwrapTypes?: string[]
    icon: React.JSX.Element
    onFocus?: FocusEventHandler
    onBlur?: FocusEventHandler
}

export interface ToolbarButtonProps {
    selected: boolean
    type?: string
    icon: React.JSX.Element
    onClick: (event: any) => void
    onFocus?: FocusEventHandler
    onBlur?: FocusEventHandler
}

export const ToolbarButton: React.ComponentType<ToolbarButtonProps> = (
    {
        selected,
        type,
        icon,
        onClick,
        onBlur,
        onFocus,
    }
) => {
    return (
        <ToggleButton
            selected={selected}
            onMouseDown={onClick}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    onClick(e)
                }
            }}
            aria-label={type}
            value={type as {}}
            size={'small'}
            style={{border: 0, padding: 3}}
            /*onFocus={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}*/
            onBlur={onBlur}
            onFocus={onFocus}
        >
            {icon}
        </ToggleButton>
    )
}

export const ToolbarElement: React.ComponentType<ToolbarElementProps> = (
    {
        type,
        inactiveType,
        icon,
        onBlur,
        onFocus,
    }
) => {
    const editor = useSlate()

    return (
        <ToolbarButton
            selected={someNode(editor, {match: {type}})}
            onClick={getPreventDefaultHandler(toggleNodeType, editor, {
                activeType: type,
                inactiveType,
            })}
            type={type}
            icon={icon}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}

export const ToolbarList: React.ComponentType<ToolbarElementProps & ListOptions> = (
    {
        type,
        icon,
        onBlur,
        onFocus,
        ...props
    }
) => {
    const editor = useSlate()

    return (
        <ToolbarButton
            selected={someNode(editor, {match: {type}})}
            onClick={getPreventDefaultHandler(toggleList, editor, {
                ...props,
                typeList: type,
            })}
            type={type}
            icon={icon}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}

export const ToolbarCodeBlock: React.ComponentType<ToolbarElementProps & {
    options?: CodeBlockOptions & CodeLineOptions & CodeBlockInsertOptions
}> = (
    {
        options = {},
        icon,
        onBlur,
        onFocus,
    }
) => {
    const {code_block} = setDefaults(options, DEFAULTS_CODE_BLOCK)
    const editor = useSlate()
    const type = code_block.type

    return (
        <ToolbarButton
            selected={someNode(editor, {match: {type}})}
            onClick={getPreventDefaultHandler(
                insertEmptyCodeBlock,
                editor,
                {select: true},
                options
            )}
            type={type}
            icon={icon}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}

export const ToolbarAlign: React.ComponentType<ToolbarElementProps> = (
    {
        type,
        icon,
        unwrapTypes = [
            ELEMENT_ALIGN_LEFT,
            ELEMENT_ALIGN_CENTER,
            ELEMENT_ALIGN_RIGHT,
            ELEMENT_ALIGN_JUSTIFY,
        ],
        onBlur,
        onFocus,
    }
) => {
    const editor = useSlate()

    return (
        <ToolbarButton
            selected={!!type && someNode(editor, {match: {type}})}
            onClick={getPreventDefaultHandler(upsertAlign, editor, {
                type,
                unwrapTypes,
            })}
            type={type}
            icon={icon}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}

export const ToolbarMark: React.ComponentType<ToolbarElementProps & { clear?: string | string[] }> = (
    {
        type,
        icon,
        clear,
    }
) => {
    const editor = useSlate()

    return (
        <ToolbarButton
            selected={isMarkActive(editor, type)}
            onClick={getPreventDefaultHandler(toggleMark, editor, type, clear)}
            type={type}
            icon={icon}
        />
    )
}
