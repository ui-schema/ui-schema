import React from "react";
import clsx from "clsx";
import {
    LooksOne, LooksTwo, Looks3, Looks4, Looks5, Looks6,
    FormatQuote, FormatListBulleted, FormatListNumbered, Code, FormatBold, FormatItalic, FormatUnderlined
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Fade from "@material-ui/core/Fade";
import {EditorState,} from 'draft-js';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useControlStyles,} from "../styles";
import {RichUtils,} from 'draft-js';
import {memo} from "@ui-schema/ui-schema";
import {AccessTooltipIcon} from "@ui-schema/ds-material/Component/Tooltip";
import {useRichText} from "../RichTextProvider/RichTextProvider";

const buttonStyle = makeStyles(theme => ({
    root: {
        color: ({active}) => active ?
            theme.palette.primary.main :
            theme.palette.text.secondary,
    }
}));

const ControlButton = memo(({classes, size, inline, toggleInlineStyle, toggleBlockType, Label, style}) => <IconButton
    classes={classes}
    size={'small'}
    style={{
        margin: size === 'medium' ? '2px 1px' : 'auto 1px',
        fontSize: size === 'medium' ? '1.25rem' : undefined
    }}
    onClick={(e) => {
        e.preventDefault();
        if(inline) {
            toggleInlineStyle(style);
        } else {
            toggleBlockType(style);
        }
    }}>
    {typeof Label === 'function' ? <Label/> : Label}
</IconButton>);

const Button = ({Label, style, inline, size}) => {
    const {editorState, handleChange,} = useRichText();

    const toggleInlineStyle = React.useCallback((inlineStyle) => {
        handleChange(prevEditorState => {
            let currentState = EditorState.forceSelection(
                prevEditorState,
                prevEditorState.getSelection(),
            );
            currentState = RichUtils.toggleInlineStyle(
                currentState,
                inlineStyle
            );
            return currentState
        });
    }, [handleChange]);

    const toggleBlockType = React.useCallback((blockType) => {
        handleChange(prevEditorState => {
            let currentState = EditorState.forceSelection(
                prevEditorState,
                prevEditorState.getSelection(),
            );
            currentState = RichUtils.toggleBlockType(
                currentState,
                blockType
            );
            return currentState
        });
    }, [handleChange]);

    let currentInlineStyle = editorState.getCurrentInlineStyle();

    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    const active = inline ? currentInlineStyle.has(style) : style === blockType;

    const classes = buttonStyle({active});

    return <ControlButton
        classes={classes}
        size={size}
        inline={inline}
        handleChange={handleChange}
        toggleInlineStyle={toggleInlineStyle}
        toggleBlockType={toggleBlockType}
        Label={Label}
        style={style}
    />;
};

const BLOCK_TYPES = [
    {
        key: 1,
        label: () => <AccessTooltipIcon title={'Headline 1'}>
            <LooksOne fontSize={'inherit'}/>
        </AccessTooltipIcon>,

        style: 'header-one'
    },
    {
        key: 2,
        label: () => <AccessTooltipIcon title={'Headline 2'}>
            <LooksTwo fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'header-two'
    },
    {
        key: 3,
        label: () => <AccessTooltipIcon title={'Headline 3'}>
            <Looks3 fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'header-three'
    },
    {
        key: 4,
        label: () => <AccessTooltipIcon title={'Headline 4'}>
            <Looks4 fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'header-four'
    },
    {
        key: 5,
        label: () => <AccessTooltipIcon title={'Headline 5'}>
            <Looks5 fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'header-five'
    },
    {
        key: 6,
        label: () => <AccessTooltipIcon title={'Headline 6'}>
            <Looks6 fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'header-six'
    },
    {
        key: 7,
        label: () => <AccessTooltipIcon title={'Quote'}>
            <FormatQuote fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'blockquote'
    },
    {
        key: 8,
        label: () => <AccessTooltipIcon title={'Bullet List'}>
            <FormatListBulleted fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'unordered-list-item'
    },
    {
        key: 9,
        label: () => <AccessTooltipIcon title={'Number List'}>
            <FormatListNumbered fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'ordered-list-item'
    },
    {
        key: 10,
        label: () => <AccessTooltipIcon title={'Code Block'}>
            <Code fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'code-block'
    },
    /*{key: 11, label: <MdInsertLink size={'1.25em'}/>, style: 'link'},*/
];

let INLINE_STYLES = [
    {
        key: 1,
        label: () => <AccessTooltipIcon title={'Format Bold'}>
            <FormatBold fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'BOLD'
    },
    {
        key: 2,
        label: () => <AccessTooltipIcon title={'Format Italic'}>
            <FormatItalic fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'ITALIC'
    },
    {
        key: 3,
        label: () => <AccessTooltipIcon title={'Format Underline'}>
            <FormatUnderlined fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'UNDERLINE'
    },
    {
        key: 4,
        label: () => <AccessTooltipIcon title={'Code Part'}>
            <Code fontSize={'inherit'}/>
        </AccessTooltipIcon>,
        style: 'CODE'
    },
];

const BlockStyleControls = ({btnSize,}) => {
    return BLOCK_TYPES.map((type) =>
        <Button
            key={type.key}
            Label={type.label}
            style={type.style}
            size={btnSize}
        />
    );
};

const InlineStyleControls = ({btnSize,}) => {
    return INLINE_STYLES.map(type =>
        <Button
            key={type.key}
            Label={type.label}
            style={type.style}
            size={btnSize}
            inline
        />
    );
};

let EditorControls = ({
                          focused, showBlockControl,
                          topControls, dense, btnSize,
                      }) => {
    const classes = useControlStyles({dense});

    return <Fade
        in={topControls && focused || !topControls}
        timeout={{enter: 400, exit: 600,}}
    >
        <div
            className={clsx(
                classes.wrapper,
                topControls ? classes.controlsTop : classes.controlsBottom
            )}
        >
            <div className={classes.controls}>
                {showBlockControl ?
                    <React.Fragment>
                        <BlockStyleControls btnSize={btnSize}/>
                    </React.Fragment>
                    : null}
                <div>
                    <InlineStyleControls btnSize={btnSize}/>
                </div>
            </div>
        </div>
    </Fade>;
};
EditorControls = memo(EditorControls);

export {EditorControls}
