import React from 'react';
import clsx from 'clsx';
import {beautifyKey, createMap} from '@ui-schema/ui-schema';
import FormControl from '@material-ui/core/FormControl';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText';
import {styles as inputStyles} from '@material-ui/core/Input/Input';

import InputLabel from '@material-ui/core/InputLabel';
import DraftEditor from 'draft-js-plugins-editor';
import {
    DefaultDraftBlockRenderMap,
    EditorState,
    RichUtils,
} from 'draft-js';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createMarkdownShortcutsPlugin from 'draft-js-md-keyboard-plugin';
import {useEditorStyles} from '../styles';
import {MarkdownLabel} from '../MarkdownLabel/MarkdownLabel';
import {EditorControls} from '../EditorControls/EditorControls';
import {blockRendererFn, editorStateFrom, editorStateTo, getBlockStyle, inlineMap, styleMap} from '../EditorExtends/EditorExtends';
import {RichTextProvider} from '../RichTextProvider';
import {Map} from 'immutable';

const useInputStyles = makeStyles(inputStyles);

const plugins = [createMarkdownShortcutsPlugin()];

export const RichText = ({
                             storeKeys, ownKey, schema,
                             showValidity, valid, errors, required,
                             value, onChange, internalValue,
                             onlyInline,
                         }) => {
    const prevStoreKeys = React.useRef();
    const prevInternalValue = React.useRef();
    React.useEffect(() => {
        prevStoreKeys.current = storeKeys;
        prevInternalValue.current = internalValue;
    });

    const [mdFocus, setMdFocus] = React.useState(false);

    const topControls = schema.getIn(['view', 'topControls']) !== false;

    let editorState = internalValue.get('value');
    if(!editorState) {
        if(typeof value !== 'undefined') {
            editorState = editorStateFrom.markdown(value);
        } else {
            editorState = EditorState.createEmpty();
        }
    }

    React.useEffect(() => {
        if(!internalValue.get('value') && editorState) {
            onChange(storeKeys, ['internal'], ({internal: currentInternal = Map()}) => ({internal: currentInternal.set('value', editorState)}))
        }
    }, [internalValue, editorState, onChange, storeKeys.equals(prevStoreKeys.current)]);

    const handleChange = React.useCallback((state) => {
        onChange(
            storeKeys, ['value', 'internal'],
            {
                type: 'update',
                updater: ({internal: currentInternal = Map()}) => {
                    let stateHandler = state;
                    if(typeof stateHandler !== 'function') {
                        // DraftJS onChange does not use a function to update the state, but we use it everywhere
                        stateHandler = () => state;
                    }

                    let newState = stateHandler(currentInternal.get('value') || createMap());
                    return {
                        value: editorStateTo.markdown(newState),
                        internal: currentInternal.set('value', newState),
                    }
                },
                schema,
                required,
            },
        )
    }, [onChange, storeKeys.equals(prevStoreKeys.current), required, schema]);

    const handleKeyCommand = (command, editorState) => {
        if(onlyInline) return 'handled';

        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState) {
            handleChange(() => newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const onTab = (e) => {
        const maxDepth = 4;// somehow this doesn't restrict the ul/li depth
        handleChange(editorState => RichUtils.onTab(e, editorState, maxDepth));
    };

    const contentState = editorState.getCurrentContent();
    const anyContentExists = contentState.hasText() ||
        contentState.getBlockMap().first().getType() !== 'unstyled';

    const sameOrEmpty = (!value && !anyContentExists) ||
        editorStateTo.markdown(editorState) === value;

    React.useEffect(() => {
        if(!sameOrEmpty) {
            // renew store when content has changed
            handleChange(() => editorStateFrom.markdown(value));
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

