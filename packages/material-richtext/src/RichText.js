import React from "react";
import clsx from "clsx";
import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";
import FormControl from "@material-ui/core/FormControl";
import {ValidityHelperText} from "@ui-schema/ds-material/es/Component/LocaleHelperText";
import {styles as inputStyles} from "@material-ui/core/Input/Input";

import InputLabel from "@material-ui/core/InputLabel";
import DraftEditor from 'draft-js-plugins-editor';
import {
    DefaultDraftBlockRenderMap,
    EditorState,
    RichUtils,
} from 'draft-js';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createMarkdownShortcutsPlugin from 'draft-js-md-keyboard-plugin';
import {useEditorStyles,} from "./styles";
import {MarkdownLabel} from "./MarkdownLabel";
import {EditorControls} from "./EditorControls";
import {blockRendererFn, editorStateFrom, editorStateTo, getBlockStyle, inlineMap, styleMap} from "./EditorExtends";
import {RichTextProvider} from "./RichTextProvider";

const useInputStyles = makeStyles(inputStyles);

const plugins = [createMarkdownShortcutsPlugin()];

const RichText = ({
                      storeKeys, ownKey, schema, value, onChange, onlyInline,
                      showValidity, valid, errors, required,
                  }) => {
    const [mdFocus, setMdFocus] = React.useState(false);

    const topControls = schema.getIn(['view', 'topControls']) !== false;

    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty(),
    );

    const handleChange = (newState) => trace("draftjs handlechange", performance.now(), () => {
        setEditorState(newState);

        // only update text representation of state when it really changed, onChange gets also triggered when e.g. changing focus
        if(newState.getCurrentContent() === editorState.getCurrentContent()) {
            return;
        }

        onChange(updateValue(storeKeys, editorStateTo.markdown(newState)));
    });

    const handleKeyCommand = (command, editorState) => {
        if(onlyInline) return 'handled';
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState) {
            handleChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const onTab = (e) => {
        const maxDepth = 4;// somehow this doesn't restrict the ul/li depth
        handleChange(RichUtils.onTab(e, editorState, maxDepth));
    };

    const contentState = editorState.getCurrentContent();
    const anyContentExists = contentState.hasText() ||
        contentState.getBlockMap().first().getType() !== 'unstyled';

    // todo: check state convertion performance impact / better way of saving non-string in the schema store that won't get leaked to the endstore
    const sameOrEmpty = (!value && !anyContentExists) ||
        editorStateTo.markdown(editorState) === value;

    React.useEffect(() => {
        if(!sameOrEmpty) {
            handleChange(editorStateFrom.markdown(value));
        }
    }, [sameOrEmpty]);

    const selection = editorState.getSelection();
    const focused = !!selection.get('hasFocus');

    return <RichTextProvider editorState={editorState} handleChange={handleChange}>
        <RichTextLayout
            btnSize={schema.getIn(['view', 'btnSize'])}
            dense={schema.getIn(['view', 'dense'])}
            error={!valid && showValidity}
            hideMd={schema.getIn(['view', 'hideMd']) || onlyInline}
            label={beautifyKey(ownKey, schema.get('tt')) + (required ? ' *' : '')}
            focused={focused}
            anyContentExists={anyContentExists}
            mdFocus={mdFocus} setMdFocus={setMdFocus}
            onlyInline={onlyInline} topControls={topControls}
        >
            <DraftEditor
                blockStyleFn={getBlockStyle}
                blockRendererFn={blockRendererFn}
                customStyleMap={styleMap}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={handleChange}
                onTab={onTab}
                placeholder={''}
                spellCheck
                plugins={onlyInline ? [] : plugins}
                blockRenderMap={onlyInline ? inlineMap : DefaultDraftBlockRenderMap}
            />
        </RichTextLayout>

        <ValidityHelperText
            errors={errors} showValidity={showValidity}
            schema={schema}
        />
    </RichTextProvider>
};

const RichTextLayout = ({
                            focused, anyContentExists,
                            dense, hideMd, btnSize, onlyInline, topControls, error,
                            mdFocus, setMdFocus, label,
                            children,
                        }) => {
    const classes = useEditorStyles({dense});
    const inputClasses = useInputStyles();

    return <FormControl className={classes.wrapper}>
        <InputLabel
            focused={focused} shrink={focused || anyContentExists}
            margin={dense ? 'dense' : undefined}
            error={error} className={classes.controlsLabel}>
            {label}
        </InputLabel>

        <div className={clsx(
            classes.editor,
            inputClasses.underline,
            focused ? inputClasses.focused : null,
        )}>
            {hideMd ? null : <MarkdownLabel focus={mdFocus} setFocus={setMdFocus}/>}

            {children}
        </div>

        <EditorControls
            topControls={topControls}
            btnSize={btnSize}
            dense={dense}
            focused={focused}
            showBlockControl={!onlyInline}
        />
    </FormControl>
};

export {RichText};
