import React from 'react'
import IcBold from '@material-ui/icons/FormatBold'
import IcItalic from '@material-ui/icons/FormatItalic'
import IcUnderlined from '@material-ui/icons/FormatUnderlined'
import IcStrikethrough from '@material-ui/icons/FormatStrikethrough'
import IcCode from '@material-ui/icons/Code'
import { useSlate } from 'slate-react'
import { concatStyleSets, IStyle } from '@uifabric/styling'
import { memoizeFunction } from '@uifabric/utilities'
import {
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE,
    MARK_STRIKETHROUGH,
    MARK_CODE,
    MARK_SUPERSCRIPT,
    MARK_SUBSCRIPT,
    ToolbarMark,
    Toolbar, PortalBody,
    BalloonToolbarStyleProps,
    BalloonToolbarStyles,
    useBalloonShow, useBalloonMove,
} from '@udecode/slate-plugins'
import { IcSuperscript } from '@ui-schema/material-slate/Icons/IcSuperscript'
import { IcSubscript } from '@ui-schema/material-slate/Icons/IcSubscript'

export interface SlateToolbarProps {
    arrow?: boolean
    theme?: 'dark' | 'light' | undefined
    direction?: 'top' | 'bottom' | undefined
    hiddenDelay?: number
}

const classNames = {
    root: 'slate-BalloonToolbar',
}

const getBalloonToolbarStyles = memoizeFunction(
    (
        theme?: BalloonToolbarStyleProps['theme'],
        hidden?: BalloonToolbarStyleProps['hidden'],
        hiddenDelay?: BalloonToolbarStyleProps['hiddenDelay'],
        direction?: BalloonToolbarStyleProps['direction'],
        arrow?: BalloonToolbarStyleProps['arrow']
    ): BalloonToolbarStyles => {
        let color = 'rgb(157, 170, 182)'
        let colorActive = 'white'
        let background = 'rgb(36, 42, 49)'
        let borderColor = 'transparent'

        if (theme === 'light') {
            color = 'rgba(0, 0, 0, 0.50)'
            colorActive = 'black'
            background = 'rgb(250, 250, 250)'
            borderColor = 'rgb(196, 196, 196)'
        }

        let marginTop
        let arrowStyle: IStyle = {}
        let arrowBorderStyle: IStyle = {}

        if (arrow) {
            arrowStyle = {
                left: '50%',
                content: '" "',
                position: 'absolute',
                marginTop: '-1px',
                transform: 'translateX(-50%)',
                borderColor: `${background} transparent`,
                borderStyle: 'solid',
            }

            if (direction === 'top') {
                arrowStyle = {
                    ...arrowStyle,
                    top: '100%',
                    bottom: 'auto',
                    borderWidth: '8px 8px 0px',
                }

                if (theme === 'light') {
                    arrowBorderStyle = {
                        ...arrowStyle,
                        marginTop: 0,
                        borderWidth: '9px 9px 0px',
                        borderColor: `${borderColor} transparent`,
                    }
                }
            } else {
                arrowStyle = {
                    ...arrowStyle,
                    top: 'auto',
                    bottom: '100%',
                    borderWidth: '0px 8px 8px',
                }

                if (theme === 'light') {
                    arrowBorderStyle = {
                        ...arrowStyle,
                        marginTop: 0,
                        borderWidth: '0px 9px 9px',
                        borderColor: `${borderColor} transparent`,
                    }
                }
            }
        }

        if (direction === 'top') {
            marginTop = -9
        } else {
            marginTop = 9
        }

        return concatStyleSets(
            {
                root: [
                    classNames.root,
                    {
                        position: 'absolute',
                        zIndex: 500,

                        background,
                        color,

                        whiteSpace: 'nowrap',
                        //visibility: 'hidden',
                        display: 'none',
                        border: 'solid #000',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor,
                        padding: '0 4px',
                        marginTop,
                        transition: hiddenDelay
                            ? ''
                            : 'top 75ms ease-out,left 75ms ease-out',

                        selectors: {
                            '::before': arrowBorderStyle,
                            '::after': arrowStyle,
                            '.slate-ToolbarButton-active, .slate-ToolbarButton:hover': {
                                color: colorActive,
                            },
                        },
                    },
                    !hidden && {
                        display: 'flex',
                    },
                ],
            }
        )
    }
)

export const SlateToolbar: React.ComponentType<SlateToolbarProps> = (
    {
        arrow = true,
        theme = 'dark',
        direction = 'top',
        hiddenDelay = 0,
    }
) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const editor = useSlate()

    const [hidden] = useBalloonShow({editor, ref, hiddenDelay})
    useBalloonMove({editor, ref, direction})
    return <PortalBody>
        <Toolbar
            ref={ref}
            styles={getBalloonToolbarStyles(
                theme,
                hidden,
                hiddenDelay,
                direction,
                arrow
            )}
        >
            <ToolbarMark
                type={MARK_BOLD}
                icon={<IcBold/>}
            />
            <ToolbarMark
                type={MARK_ITALIC}
                icon={<IcItalic/>}
            />
            <ToolbarMark
                type={MARK_UNDERLINE}
                icon={<IcUnderlined/>}
            />
            <ToolbarMark
                type={MARK_STRIKETHROUGH}
                icon={<IcStrikethrough/>}
            />

            <ToolbarMark type={MARK_CODE} icon={<IcCode/>}/>

            <ToolbarMark
                type={MARK_SUPERSCRIPT}
                clear={MARK_SUBSCRIPT}
                icon={<IcSuperscript/>}
            />

            <ToolbarMark
                type={MARK_SUBSCRIPT}
                clear={MARK_SUPERSCRIPT}
                icon={<IcSubscript/>}
            />
        </Toolbar>
    </PortalBody>
}
