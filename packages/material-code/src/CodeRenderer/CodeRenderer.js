import React from 'react';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import {useUID} from 'react-uid';
import {Controlled as CodeMirror} from '@ui-schema/material-code/ReactCodeMirror';
import {useWidgetCode} from '@ui-schema/material-code/CodeProvider';

export const CodeRenderer = ({
                                 storeKeys, schema, value, onChange,
                                 valid, required, format,
                             }) => {
    const uid = useUID();
    const {theme, modes} = useWidgetCode();
    const [lines, setLines] = React.useState(1);
    const [editor, setEditor] = React.useState();
    const [focused, setFocused] = React.useState(false);

    React.useEffect(() => {
        onChange({
            storeKeys: storeKeys,
            scopes: ['valid'],
            type: 'set',
            schema,
            required,
            data: {valid: valid},
        })
    }, [onChange, valid, storeKeys]);

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

    const handleBeforeChange = React.useCallback((editor, data, storeValue) => {
        onChange({
            storeKeys: storeKeys,
            scopes: ['value'],
            type: 'set',
            schema,
            required,
            data: {value: storeValue},
        })
    }, [onChange, storeKeys, required, schema]);

    const mode = modes?.[format] ? modes[format] : format
    const options = React.useMemo(() => ({
        mode: mode,
        lineNumbers: true,
        ...(theme ? {theme} : {}),
    }), [format, theme, mode]);

    const onFocus = React.useCallback(() => setFocused(true), [setFocused])
    const onBlur = React.useCallback(() => setFocused(false), [setFocused])

    return <Box
        sx={{
            display: 'flex',
            minHeight: '2rem',
            height: lines ? ((lines + 1) * height) + 6 : 'auto',
            position: 'relative',
            ['& .' + 'uis-' + uid]: {
                flex: '1 1 auto',
                marginTop: 0,
                height: '100%',
                position: 'relative',
            },
            '& .CodeMirror': {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
            },
        }}
    >
        <CodeMirror
            className={clsx(
                'uis-' + uid,
                'MuiInput-underline',
                focused ? 'Mui-focused' : null,
            )}
            editorDidMount={setEditor}
            value={value}
            onBeforeChange={handleBeforeChange}
            onChange={handleOnChange}
            onFocus={onFocus}
            onBlur={onBlur}
            options={options}
        />
    </Box>
};
