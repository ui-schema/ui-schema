import React from 'react'
import IcBold from '@mui/icons-material/FormatBold'
import IcItalic from '@mui/icons-material/FormatItalic'
import IcUnderlined from '@mui/icons-material/FormatUnderlined'
import IcStrikethrough from '@mui/icons-material/FormatStrikethrough'
import IcCode from '@mui/icons-material/Code'
import { useSlate } from 'slate-react'
import { Theme } from '@mui/material/styles'
import makeStyles from "@mui/styles/makeStyles"
import {
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE,
    MARK_STRIKETHROUGH,
    MARK_CODE,
    MARK_SUPERSCRIPT,
    MARK_SUBSCRIPT,
    PortalBody,
    useBalloonShow, useBalloonMove,
} from '@udecode/slate-plugins'
import { IcSuperscript } from '@ui-schema/material-slate/Icons/IcSuperscript'
import { IcSubscript } from '@ui-schema/material-slate/Icons/IcSubscript'
import { ToolbarMark } from '@ui-schema/material-slate/Slate/SlateToolbarButtons'
import { editorEnableOnly } from '@ui-schema/material-slate/Slate/SlateRenderer'
import { editorIsEnabled } from '@ui-schema/material-slate/Slate/editorIsEnabled'

export interface SlateToolbarProps {
    direction?: 'top' | 'bottom' | undefined
    hiddenDelay?: number
    enableOnly?: editorEnableOnly
}

const useStyles = makeStyles<Theme, { hidden: boolean, hiddenDelay: number, direction: 'top' | 'bottom' }>(theme => ({
    wrapper: {
        position: 'absolute',
        zIndex: 500,
        background: theme.palette.background.paper,
        whiteSpace: 'nowrap',
        display: ({hidden}) => hidden ? 'none' : 'flex',
        border: '1px solid ' + theme.palette.divider,

        borderRadius: theme.shape.borderRadius,

        padding: theme.spacing(1),
        marginTop: ({direction}) => direction === 'top' ? -9 : 9,
        transition: ({hiddenDelay}) =>
            hiddenDelay ? '' : 'top 75ms ease-out,left 75ms ease-out',
        boxShadow: theme.shadows[3],

        '&:before': {
            left: '50%',
            content: '" "',
            position: 'absolute' as const,
            transform: 'translateX(-50%)',
            borderColor: theme.palette.divider + ' transparent',
            borderStyle: 'solid',
            top: ({direction}) => direction === 'top' ? '100%' : 'auto',
            bottom: ({direction}) => direction === 'top' ? 'auto' : '100%',
            borderWidth: ({direction}) => direction === 'top' ? '9px 9px 0px' : '0px 8px 8px',
        },
        '&:after': {
            left: '50%',
            content: '" "',
            position: 'absolute' as const,
            marginTop: '-1px',
            transform: 'translateX(-50%)',
            borderColor: theme.palette.divider + ' transparent',
            borderStyle: 'solid',
            top: ({direction}) => direction === 'top' ? '100%' : 'auto',
            bottom: ({direction}) => direction === 'top' ? 'auto' : '100%',
            borderWidth: ({direction}) => direction === 'top' ? '8px 8px 0px' : '0px 8px 8px',
        },
    },
}))

export const SlateToolbarBalloon: React.ComponentType<SlateToolbarProps> = (
    {
        direction = 'top',
        hiddenDelay = 0,
        enableOnly,
    }
) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const editor = useSlate()
    const [hidden] = useBalloonShow({editor, ref, hiddenDelay})
    const classes = useStyles({hidden, hiddenDelay, direction})

    useBalloonMove({editor, ref, direction})
    return <PortalBody>
        <div
            className={classes.wrapper}
            ref={ref}
        >
            {editorIsEnabled(enableOnly, MARK_BOLD) &&
            <ToolbarMark
                type={MARK_BOLD}
                icon={<IcBold/>}
            />}
            {editorIsEnabled(enableOnly, MARK_ITALIC) &&
            <ToolbarMark
                type={MARK_ITALIC}
                icon={<IcItalic/>}
            />}
            {editorIsEnabled(enableOnly, MARK_UNDERLINE) &&
            <ToolbarMark
                type={MARK_UNDERLINE}
                icon={<IcUnderlined/>}
            />}
            {editorIsEnabled(enableOnly, MARK_STRIKETHROUGH) &&
            <ToolbarMark
                type={MARK_STRIKETHROUGH}
                icon={<IcStrikethrough/>}
            />}

            {editorIsEnabled(enableOnly, MARK_CODE) &&
            <ToolbarMark
                type={MARK_CODE}
                icon={<IcCode/>}
            />}

            {editorIsEnabled(enableOnly, MARK_SUPERSCRIPT) &&
            <ToolbarMark
                type={MARK_SUPERSCRIPT}
                clear={MARK_SUBSCRIPT}
                icon={<IcSuperscript/>}
            />}

            {editorIsEnabled(enableOnly, MARK_SUBSCRIPT) &&
            <ToolbarMark
                type={MARK_SUBSCRIPT}
                clear={MARK_SUPERSCRIPT}
                icon={<IcSubscript/>}
            />}
        </div>
    </PortalBody>
}
