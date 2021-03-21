import React from 'react';
import clsx from 'clsx';
import {useUID} from 'react-uid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Controlled as CodeMirror} from 'react-codemirror2';
import {useWidgetCode} from '@ui-schema/material-code/CodeProvider/CodeProvider';
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable';

const useStyles = makeStyles({
    root: {
        flex: '1 1 auto',
        marginTop: 0,
        height: '100%',
        position: 'relative',
        '& .CodeMirror': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
        },
    },
});

export const CodeRenderer = ({
                                 storeKeys, schema, value, onChange,
                                 valid, required, format,
                             }) => {
    const uid = useUID();
    const {theme} = useWidgetCode();
    const [lines, setLines] = React.useState(1);
    const [editor, setEditor] = React.useState();
    const [focused, setFocused] = React.useState(false);
    const currentStoreKeys = useImmutable(storeKeys)

    const classes = useStyles();

    React.useEffect(() => {
        onChange(currentStoreKeys, ['valid'], () => ({valid: valid}))
    }, [onChange, valid, currentStoreKeys]);

    React.useEffect(() => {
        if(editor && editor.refresh) {
            editor.refresh();
        }
    }, [editor]);

    let height = 0;
    if(editor?.display?.lineDiv?.children && editor.display.lineDiv.children[0]) {
        height = editor.display.lineDiv.children[0].clientHeight;
    }

    if(editor?.display && editor.display.gutters && editor.display.wrapper) {
        if(schema.getIn(['view', 'bg']) !== true) {
            editor.display.gutters.style.background = 'transparent';
            editor.display.wrapper.style.background = 'transparent';
        }
    }

    const handleOnChange = React.useCallback((changedEditor) => {
        setLines(changedEditor.doc.size);
    }, [setLines]);

    const type = schema.get('type');
    const deleteOnEmpty = schema.get('deleteOnEmpty') || required;
    const handleBeforeChange = React.useCallback((editor, data, storeValue) => {
        onChange(
            currentStoreKeys, ['value'], () => ({value: storeValue}),
            deleteOnEmpty, type,
        )
    }, [onChange, currentStoreKeys, deleteOnEmpty, type]);

    const options = React.useMemo(() => ({
        mode: format,
        lineNumbers: true,
    }), [format]);

    if(theme) {
        options.theme = theme;
    }

    return <div
        style={{minHeight: '2rem', height: lines ? ((lines + 1) * height) + 6 : 'auto', position: 'relative'}}
    >
        <CodeMirror
            className={clsx(
                classes.root,
                'uis-' + uid,
                'MuiInput-underline',
                focused ? 'Mui-focused' : null,
            )}
            editorDidMount={setEditor}
            value={value}
            onBeforeChange={handleBeforeChange}
            onChange={handleOnChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            options={options}
        />
    </div>
};
