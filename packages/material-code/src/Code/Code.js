import React from "react";
import clsx from "clsx";
import {beautifyKey, updateValidity, updateValue} from "@ui-schema/ui-schema";
import {useUID} from "react-uid";
import FormLabel from "@material-ui/core/FormLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ValidityHelperText} from "@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText";
import {Controlled as CodeMirror} from "react-codemirror2";
import {useWidgetCode} from "../CodeProvider/CodeProvider";

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

export const Code = ({
                  storeKeys, ownKey, schema, value, onChange,
                  showValidity, valid, errors, required,
              }) => {
    const uid = useUID();
    const {theme} = useWidgetCode();
    const [lines, setLines] = React.useState(1);
    const [editor, setEditor] = React.useState();
    const [focused, setFocused] = React.useState(false);

    const classes = useStyles();

    const format = schema.get('format');
    // todo: multi format w/ selection
    if(typeof format !== 'string') return null;

    React.useEffect(() => {
        onChange(updateValidity(storeKeys, valid));
    }, [valid]);

    React.useEffect(() => {
        if(editor && editor.refresh) {
            editor.refresh();
        }
    }, [editor]);

    let height = 0;
    if(editor && editor.display && editor.display.lineDiv && editor.display.lineDiv.children && editor.display.lineDiv.children[0]
    ) {
        height = editor.display.lineDiv.children[0].clientHeight;
    }

    if(editor && editor.display && editor.display.gutters && editor.display.wrapper) {
        if(schema.getIn(['view', 'bg']) !== true) {
            editor.display.gutters.style.background = 'transparent';
            editor.display.wrapper.style.background = 'transparent';
        }
    }

    const handleOnChange = React.useCallback((editor,) => {
        if(editor.doc.size !== lines) {
            setLines(editor.doc.size);
        }
    }, [setLines, lines]);

    const handleBeforeChange = React.useCallback((editor, data, value) => {
        onChange(updateValue(storeKeys, value));
    }, [onChange, storeKeys]);

    const options = React.useMemo(() => ({
        mode: format,
        lineNumbers: true
    }), [format]);

    if(theme) {
        options.theme = theme;
    }

    return <React.Fragment>
        <FormLabel error={!valid && showValidity} style={{marginBottom: 12, display: 'block'}}>
            {beautifyKey(ownKey, schema.get('tt'))}{required ? ' *' : null}
        </FormLabel>
        <div style={{minHeight: '2rem', height: lines ? ((lines + 1) * height) + 6 : 'auto', position: 'relative'}}>
            <CodeMirror
                className={clsx(
                    classes.root, 'uis-' + uid,
                    'MuiInput-underline',
                    focused ? 'Mui-focused' : null
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
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};
