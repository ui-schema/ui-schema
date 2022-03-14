import React from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom'
import {Map, List} from 'immutable'
import {FormControl, Select, MenuItem, Box, Button, Paper, Typography, useTheme} from '@material-ui/core';
import {
    DragHandle, Opacity,
    SpeakerNotes, SpeakerNotesOff, Add, Remove,
    Visibility, VisibilityOff,
    FormatSize, FormatShapes, Code, SpaceBar, RestorePage, HorizontalSplit, VerticalSplit,
} from '@material-ui/icons';
import {isInvalid, createOrderedMap, UIRootRenderer, createStore, storeUpdater, UIStoreProvider, useUIStore} from '@ui-schema/ui-schema';
import {RichCodeEditor, themes} from '../RichCodeEditor';
import {Markdown} from '../Markdown';
import PageNotFound from '../../page/PageNotFound';
import {schemas} from '../../schemas/_list';
import style from 'codemirror/lib/codemirror.css';
import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';
import {WidgetCodeProvider} from '@ui-schema/material-code';
import LuxonAdapter from '@date-io/luxon';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {createEmptyStore} from '@ui-schema/ui-schema/UIStore';
import {KitDndProvider, useOnIntent} from '@ui-schema/kit-dnd';
import {useOnDirectedMove} from '@ui-schema/material-dnd/useOnDirectedMove';

const IconInput = ({
                       verticalSplit, title,
                       onChange, value, min, max = 15,
                       Icon, opacity = 0.4, scale = 0.8,
                   }) => {
    const {palette} = useTheme();
    const [hasFocus, setFocus] = React.useState(false);
    const [hasHover, setHover] = React.useState(false);

    return <div
        style={{
            margin: verticalSplit ? '0 0 6px 0' : '3px 6px 3px 0',
            border: '1px solid ' + palette.divider,
            zIndex: 2,
            flexShrink: 0,
            padding: 6,
            display: 'flex',
            position: 'relative',
        }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
        {hasFocus || hasHover ? <button
            style={{
                position: 'absolute', padding: 0, cursor: 'pointer',
                top: verticalSplit ? 0 : 'calc(-100% - 1px)', right: verticalSplit ? '-100%' : 0, left: verticalSplit ? 'auto' : 0,
                width: '100%', height: '100%', border: 0,
                background: palette.text.primary, color: palette.background.default,
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onClick={() => onChange(value + 1)}
            disabled={value >= max}
        >
            <Add fontSize={'small'} style={{transform: 'scale(0.85)'}} fill={palette.background.default}/>
        </button> : null}

        <input
            type={'number'} className={'no-spin'}
            title={title}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
                position: 'absolute', zIndex: 2, top: 0, right: 0, bottom: 0, left: 0,
                background: 'transparent', border: 0, boxSizing: 'border-box',
                textAlign: 'center', fontSize: '0.9rem', fontFamily: 'Consolas, "Lucida Console", Courier, monospace', fontWeight: 'bold',
                width: '100%', height: '100%', paddingBottom: 10, color: palette.text.primary,
            }}
            value={value} onChange={e => e.target.value <= max ? onChange(e.target.value * 1) : undefined} min={min} max={max}/>

        {hasFocus || hasHover ? <button
            style={{
                position: 'absolute', padding: 0, cursor: 'pointer',
                width: '100%', height: '100%', border: 0,
                background: palette.text.primary, color: palette.background.default,
                bottom: verticalSplit ? 0 : 'calc(-100% - 1px)', left: verticalSplit ? '-100%' : 0, right: verticalSplit ? 'auto' : 0,
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onClick={() => onChange(value - 1)}
            disabled={value <= min}
        >
            <Remove fontSize={'small'} style={{transform: 'scale(0.85)'}} fill={palette.background.default}/>
        </button> : null}

        <Icon
            style={{visibility: 'hidden', display: 'block'}}
            fontSize={'small'}
        />
        <Icon
            style={{opacity, display: 'block', transform: 'scale(' + scale + ')', position: 'absolute', bottom: -3}}
            fontSize={'small'}
        />
    </div>
};

const unFocus = e => {
    let found = false;
    let parent = e.target;

    do {
        if(parent.nodeName === 'BUTTON') {
            let t = parent;
            setTimeout(() => t ? t.blur() : undefined, 400);
            found = true
        } else parent = parent.parentElement;
    } while(!found && parent);
};

const DragHandleStyled = () => {
    const theme = useTheme();
    return <DragHandle style={{pointerEvents: 'none', transform: 'translateY(-3px)', fill: theme.palette.text.primary}} fontSize={'small'}/>
};

const NavButton = ({verticalSplit, onClick, Icon, label}) => {
    const {palette} = useTheme();

    return <Button
        style={{
            cursor: 'pointer', flexShrink: 0, padding: 6, minWidth: 'auto',
            margin: verticalSplit ? '0 0 6px 0' : '3px 6px 3px 0',
            display: 'flex', border: '1px solid ' + palette.divider,
        }}
        onClick={onClick} onMouseUp={unFocus}
        aria-label={label}
    >
        <span style={{margin: 'auto'}}>
            <Icon
                titleAccess={label}
                style={{display: 'block', fill: palette.text.primary}}
                fontSize={'small'}
            />
        </span>
    </Button>
};

const EditorsNavWrapper = ({verticalSplit, children}) => {
    const {palette} = useTheme();

    return <div
        style={{
            marginTop: verticalSplit ? 'auto' : 0, marginLeft: verticalSplit ? 12 : 0, padding: verticalSplit ? 0 : '6px 0',
            display: 'flex', order: 2, position: 'relative',
            borderTop: '1px solid ' + palette.divider,
            flexWrap: verticalSplit ? 'no-wrap' : 'wrap',
        }}
    >
        {children}
    </div>
};

const IdeThemeChange = ({editorTheme, verticalSplit, setEditorTheme}) => {
    const {palette} = useTheme();

    return palette.type === 'dark' ? <NavButton
        onClick={() => {
            let themePos = themes.indexOf(editorTheme);
            setEditorTheme(themePos >= themes.length - 1 ? themes[0] : themes[themePos + 1])
        }}
        Icon={Opacity}
        verticalSplit={verticalSplit}
        label={'Toggle Theme'}
    /> : null;
};

const EditorsNav = ({
                        verticalSplit, changeSplit,
                        setTabSize, tabSize,
                        setFontSize, fontSize,
                        activeSchema, changeSchema,
                        toggleRichIde, richIde,
                        schemas,
                        showInfo, toggleInfoBox, hasInfo,
                        setJsonEditHeight, setRenderChange,
                        setEditorTheme, editorTheme,
                    }) => {
    const [upDownHandler, setUpDownHandler] = React.useState(false);

    const handleMouseDown = React.useCallback((e) => {
        let clientY = false;
        if(e.touches) {
            if(e.touches[0]) {
                clientY = e.touches[0].clientY;
            }
        } else {
            clientY = e.clientY;
        }

        let nextPos = window.innerHeight - clientY - 40;
        if(clientY !== false && nextPos % 2 === 0) {
            if(nextPos < (window.innerHeight - 40 - 60)) {
                // throttle to every second pixel
                setJsonEditHeight(window.innerHeight - clientY - 40);
            } else {
                setJsonEditHeight(window.innerHeight - 40 - 60);
            }
        }
    }, [setJsonEditHeight]);

    return <EditorsNavWrapper verticalSplit={verticalSplit}>
        {verticalSplit ? null : <button
            style={{
                height: '1rem', overflow: 'hidden', border: 0, position: 'absolute', cursor: 'grab',
                left: '50%', transform: 'translate(-50%, -14px)', display: 'flex', margin: 0, padding: '1px 4px 1px 4px',
            }}
            onMouseDown={(e) => {
                let target = e.target;

                if(!upDownHandler) {
                    setUpDownHandler(true);
                    document.addEventListener('mousemove', handleMouseDown);
                    document.addEventListener('mouseup', function mouseUpHandler() {
                        this.removeEventListener('mouseup', mouseUpHandler, false);
                        document.removeEventListener('mousemove', handleMouseDown);
                        setUpDownHandler(false);
                        target.blur();

                        setRenderChange(p => p + 1);
                    });
                }
            }}
            onTouchStart={(e) => {
                let target = e.target;

                if(!upDownHandler) {
                    setUpDownHandler(true);
                    document.addEventListener('touchmove', handleMouseDown);
                    document.addEventListener('touchend', function mouseUpHandler() {
                        this.removeEventListener('touchend', mouseUpHandler, false);
                        document.removeEventListener('touchmove', handleMouseDown);
                        setUpDownHandler(false);
                        target.blur();

                        setRenderChange(p => p + 1);
                    });
                }
            }}
            onClick={() => undefined}
            title={'Drag to change Height'}
        ><DragHandleStyled/></button>}

        {verticalSplit ? null : <div style={{marginRight: 'auto', display: 'flex', minWidth: '200px'}}>
            <SchemaChanger
                schemas={schemas} style={{margin: 'auto 4px'}} activeSchema={activeSchema}
                verticalSplit={verticalSplit}
                changeSchema={changeSchema} toggleInfoBox={toggleInfoBox} showInfo={showInfo} hasInfo={hasInfo} setRenderChange={setRenderChange}/>
        </div>}

        <div style={{display: 'flex', flexDirection: verticalSplit ? 'column' : 'row', paddingLeft: 4}}>
            {hasInfo ? <NavButton
                onClick={() => {
                    toggleInfoBox(p => !p);
                    if(setRenderChange) {
                        setRenderChange(p => p + 1);
                    }
                }}
                Icon={({style = {}, ...p}) => showInfo ?
                    <SpeakerNotesOff {...p} style={{fill: 'currentColor', ...style}}/> :
                    <SpeakerNotes {...p} style={{fill: 'currentColor', ...style}}/>}
                verticalSplit={verticalSplit}
                label={'Toggle Example Description'}
            /> : null}

            <IdeThemeChange editorTheme={editorTheme} setEditorTheme={setEditorTheme} verticalSplit={verticalSplit}/>

            <IconInput
                title={'Font Size'} value={fontSize} onChange={setFontSize}
                verticalSplit={verticalSplit} min={6} max={30}
                Icon={FormatSize}
            />
            <IconInput
                title={'Indentation Size'} value={tabSize} onChange={setTabSize}
                verticalSplit={verticalSplit} min={2} max={8}
                Icon={SpaceBar} opacity={0.5} scale={0.9}
            />

            <NavButton
                label={'reset data and schema'}
                Icon={RestorePage}
                onClick={() => changeSchema(activeSchema)}
                verticalSplit={verticalSplit}
            />

            <NavButton
                label={'Switch to ' + (richIde ? 'text' : 'web ide')}
                Icon={richIde ? Code : FormatShapes}
                onClick={toggleRichIde}
                verticalSplit={verticalSplit}
            />

            <NavButton
                label={'Switch to ' + (verticalSplit ? 'horizontal' : 'vertical') + ' split'}
                Icon={verticalSplit ? HorizontalSplit : VerticalSplit}
                onClick={changeSplit}
                verticalSplit={verticalSplit}
            />
        </div>
    </EditorsNavWrapper>
};

const SchemaJSONEditor = ({schema, setJsonError, setSchema, tabSize, fontSize, richIde, renderChange, theme}) => {
    return <RichCodeEditor
        tabSize={tabSize}
        fontSize={fontSize}
        raw={!richIde}
        theme={theme}
        renderChange={renderChange}
        value={typeof schema === 'string' ? schema : JSON.stringify(schema.toJS(), null, tabSize)}
        onChange={(newValue) => {
            try {
                setJsonError(false);
                setSchema(createOrderedMap(JSON.parse(newValue)));
            } catch(e) {
                setJsonError(e.toString());
                setSchema(newValue);
            }
        }}
    />
};

const SchemaDataDebug = ({tabSize, fontSize, richIde, renderChange, theme}) => {
    const {store} = useUIStore();

    return <RichCodeEditor
        value={Map.isMap(store.getValues()) || List.isList(store.getValues()) ? JSON.stringify(store.valuesToJS(), null, tabSize) : store.valuesToJS()}
        theme={theme}
        tabSize={tabSize}
        fontSize={fontSize}
        renderChange={renderChange}
        raw={!richIde}
        readOnly
    />
};

const SchemaChanger = ({activeSchema, changeSchema, schemas, verticalSplit}) => {

    return <FormControl fullWidth style={{padding: verticalSplit ? '20px 0 20px 3px' : '0 0 0 12px'}}>
        <Select value={activeSchema} onChange={e => changeSchema(e.target.value * 1)} displayEmpty>
            <MenuItem value="" disabled>
                Examples
            </MenuItem>
            {schemas.map((schema, i) => (
                <MenuItem key={i} value={i}>{schema[0]}</MenuItem>
            ))}
        </Select>
    </FormControl>;
};

const initialLocalBoolean = (key, def) => {
    if(
        typeof window.localStorage.getItem(key) !== 'undefined' &&
        window.localStorage.getItem(key) !== null &&
        !isNaN(window.localStorage.getItem(key) * 1)
    ) {
        return !!(window.localStorage.getItem(key) * 1);
    }

    return def;
};

const toggleLocalBoolean = (setter, key) => {
    setter(p => {
        window.localStorage.setItem(key, p ? '0' : '1');
        return !p;
    })
};

const searchActiveSchema = (schemas, schema) => {
    let found = false;
    for(let id in schemas) {
        if(schemas[id][0].split(' ').join('-') === schema) {
            found = id;
            break;
        }
    }

    return found;
};
const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use();
        return () => styles.unuse();
    }, [styles]);
};

const EditorHandler = ({matchedSchema, activeSchema, setActiveSchema}) => {
    const history = useHistory();
    const {palette} = useTheme();
    let initialVertical = initialLocalBoolean('live-editor-vertical', 800 < window.innerWidth);// Vertical by default for desktop
    let initialRichIde = initialLocalBoolean('live-editor-rich-ide', true);
    const [verticalSplit, setVerticalSplit] = React.useState(initialVertical);
    const [richIde, setRichIde] = React.useState(initialRichIde);
    const [jsonError, setJsonError] = React.useState(false);
    const [tabSize, setTabSize] = React.useState(2);
    const [fontSize, setFontSize] = React.useState(13);
    const [showInfo, setInfoBox] = React.useState(true);
    const [showStore, setStoreBox] = React.useState(true);
    const [jsonEditHeight, setJsonEditHeight] = React.useState(350);
    const [renderChange, setRenderChange] = React.useState(0);// Ace Editor Re-Size Re-Calc
    const [editorTheme, setEditorTheme] = React.useState('gruvbox');
    const infoBox = React.useRef();// to scroll to top of info text when toggling/switching sides

    useStyle(style);
    useStyle(palette.type === 'dark' ? themeDark : themeLight);

    // default schema state - begin
    const [showValidity, setShowValidity] = React.useState(false);
    const [schema, setSchema] = React.useState(() => schemas[activeSchema][1]);
    const [store, setStore] = React.useState(() => createStore(schemas[activeSchema][2]));
    // end - default schema state

    const toggleInfoBox = React.useCallback((setter) => {
        setInfoBox(setter);
        if(setRenderChange) {
            setRenderChange(p => p + 1);
        }
    }, [setInfoBox, setRenderChange]);

    const toggleDataBox = React.useCallback((setter) => {
        setStoreBox(setter);
        if(setRenderChange) {
            setRenderChange(p => p + 1);
        }
    }, [setStoreBox, setRenderChange]);

    const changeSplit = React.useCallback(() => {
        // toggle verticalSplit and change selected in localStorage
        toggleLocalBoolean(setVerticalSplit, 'live-editor-vertical');
        setRenderChange(p => p + 1);
    }, [setVerticalSplit, setRenderChange]);

    const toggleRichIde = React.useCallback(() => {
        // toggle richIde and change selected in localStorage
        toggleLocalBoolean(setRichIde, 'live-editor-rich-ide');
    }, [setRichIde]);

    const changeSchema = React.useCallback(i => {
        setShowValidity(false);
        setActiveSchema(i);
        setSchema(schema => {
            if(!schemas[i][1].equals(schema)) {
                setStore(createStore(schemas[i][2]));
            }
            return schemas[i][1]
        });
        setRenderChange(p => p + 1);
        history.push('/examples/' + (schemas[i][0].split(' ').join('-')));
    }, [setActiveSchema, setShowValidity, setSchema, setStore, history]);

    React.useEffect(() => {
        if(infoBox.current) {
            infoBox.current.scrollTo(0, 0)
        }
    }, [activeSchema, infoBox]);

    React.useEffect(() => {
        if(showInfo && infoBox.current) {
            infoBox.current.scrollTo(0, 0)
        }
    }, [showInfo, infoBox]);

    React.useEffect(() => {
        if(typeof matchedSchema !== 'undefined') {
            let foundSchema = matchedSchema ? searchActiveSchema(schemas, matchedSchema) : matchedSchema;
            if(foundSchema !== activeSchema && foundSchema !== false) {
                changeSchema(foundSchema)
            }
        }
    }, [matchedSchema, changeSchema, activeSchema]);

    const onSchemaManual = React.useCallback((schema) => {
        setSchema((oldSchema) => {
            const oldType = Map.isMap(oldSchema) && oldSchema.get('type')
            const type = Map.isMap(schema) && schema.get('type')
            if(oldType !== type && type) {
                setStore(createEmptyStore(type))
            }
            return schema
        })
    }, [setSchema, setStore]);

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
        })
    }, [setStore]);

    const {onIntent} = useOnIntent({edgeSize: 12})
    const {onMove} = useOnDirectedMove(onIntent, onChange)

    return <WidgetCodeProvider theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'}>
        <MuiPickersUtilsProvider utils={LuxonAdapter}>
            <KitDndProvider onMove={onMove}>
                <UIStoreProvider store={store} onChange={onChange} showValidity={showValidity}>
                    <div style={{display: 'flex', flexGrow: 2, overflow: 'auto', flexDirection: verticalSplit ? 'row' : 'column'}}>
                        <div style={{
                            width: verticalSplit ? '45%' : '100%',
                            height: verticalSplit ? 'auto' : (jsonEditHeight + 'px'),
                            maxHeight: verticalSplit ? 'none' : '95vh',
                            display: 'flex', flexShrink: 0,
                            order: verticalSplit ? 1 : 3,
                            overflow: 'auto',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: verticalSplit ? 'column' : 'row',
                                minWidth: verticalSplit ? 'auto' : 800,
                                flexGrow: 2,
                            }}>
                                {verticalSplit ? <SchemaChanger
                                    toggleInfoBox={toggleInfoBox} showInfo={showInfo} hasInfo={!!schemas[activeSchema][3]}
                                    schemas={schemas} style={{marginLeft: 4}}
                                    setRenderChange={setRenderChange} verticalSplit={verticalSplit}
                                    activeSchema={activeSchema} changeSchema={changeSchema}
                                /> : null}

                                {schemas[activeSchema][3] ?
                                    <div style={{
                                        height: verticalSplit ? 'auto' : 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0,
                                        width: verticalSplit ? 'auto' : schemas[activeSchema][3] ? showInfo ? '33%' : 'auto' : showInfo ? '50%' : 'auto',
                                        maxHeight: verticalSplit ? '35%' : 'none', paddingLeft: verticalSplit ? 0 : 6, marginRight: !verticalSplit && showInfo ? 12 : 0,
                                    }}>
                                        <Button
                                            variant={'outlined'} size={'small'}
                                            style={{display: 'flex', lineHeight: 2.66, flexShrink: 0, minWidth: 0, color: 'inherit', border: 0, padding: '0 0 0 4px', cursor: 'pointer'}}
                                            onClick={() => toggleInfoBox(o => !o)} onMouseUp={unFocus}>
                                            {showInfo || verticalSplit ? 'Info:' : 'I·'}

                                            {showInfo ?
                                                <SpeakerNotesOff fontSize={'small'} style={{margin: 'auto ' + (verticalSplit ? 0 : 9) + 'px auto auto'}}/> :
                                                <SpeakerNotes fontSize={'small'} style={{margin: 'auto ' + (verticalSplit ? 0 : 9) + 'px auto auto'}}/>}
                                        </Button>

                                        {showInfo ? <Paper style={{overflow: 'auto', padding: '0 6px 0 0'}} ref={infoBox}><Box mt={1} mb={1} ml={2} mr={verticalSplit ? 0 : 1.5}>
                                            <div style={{overflow: 'visible', margin: 0}}>
                                                <Markdown source={schemas[activeSchema][3]}/>
                                            </div>
                                        </Box></Paper> : null}
                                    </div> : null}

                                <div style={{
                                    height: 'auto', flexGrow: 2, flexShrink: 0, display: 'flex', flexDirection: 'column', width: 'auto',
                                }}>
                                    <Typography component={'p'} variant={'overline'} style={{paddingLeft: 4}}>
                                        Schema:
                                    </Typography>
                                    <SchemaJSONEditor
                                        schema={schema}
                                        setJsonError={setJsonError}
                                        setSchema={onSchemaManual}
                                        tabSize={tabSize}
                                        fontSize={fontSize}
                                        richIde={richIde}
                                        renderChange={renderChange}
                                        theme={editorTheme}
                                    />
                                </div>

                                <div style={{
                                    height: verticalSplit ? showStore ? '30%' : 'auto' : 'auto', display: 'flex', flexDirection: 'column', flexShrink: 1,
                                    width: verticalSplit ? 'auto' : showStore ? '33%' : 'auto',
                                    paddingLeft: verticalSplit ? 0 : 12, boxSizing: 'border-box',
                                }}>
                                    <Button
                                        variant={'outlined'} size={'small'}
                                        style={{display: 'flex', lineHeight: 2.66, minWidth: 0, flexShrink: 0, color: 'inherit', border: 0, padding: '0 0 0 4px', cursor: 'pointer'}}
                                        onClick={() => toggleDataBox(o => !o)} onMouseUp={unFocus}>
                                        {showStore || verticalSplit ? 'Data:' : 'D·'}

                                        {showStore ?
                                            <VisibilityOff fontSize={'small'} style={{margin: 'auto 0 auto auto'}}/> :
                                            <Visibility fontSize={'small'} style={{margin: 'auto 0 auto auto'}}/>}
                                    </Button>
                                    {schemas[activeSchema][3] && showStore ?
                                        <SchemaDataDebug tabSize={tabSize} fontSize={fontSize} richIde={richIde} renderChange={renderChange} theme={editorTheme}/> :
                                        null}
                                </div>
                            </div>
                        </div>

                        <EditorsNav
                            setJsonError={setJsonError}
                            changeSplit={changeSplit}
                            verticalSplit={verticalSplit}
                            activeSchema={activeSchema}
                            changeSchema={changeSchema}
                            setTabSize={setTabSize}
                            tabSize={tabSize}
                            setFontSize={setFontSize}
                            fontSize={fontSize}
                            toggleRichIde={toggleRichIde}
                            richIde={richIde}
                            schemas={schemas}
                            showInfo={showInfo}
                            toggleInfoBox={toggleInfoBox}
                            hasInfo={!!schemas[activeSchema][3]}
                            jsonEditHeight={jsonEditHeight}
                            setJsonEditHeight={setJsonEditHeight}
                            setRenderChange={setRenderChange}
                            setEditorTheme={setEditorTheme}
                            editorTheme={editorTheme}
                        />

                        <main className="App-main" style={{height: '100%', overflow: 'auto', maxWidth: 'none', margin: verticalSplit ? '0 auto' : 0, order: verticalSplit ? 3 : 1}}>
                            {jsonError ?
                                <Paper style={{margin: 12, padding: 24}}>
                                    <Typography component={'h2'} variant={'h5'} color={'error'}>
                                        JSON-Error:
                                    </Typography>

                                    <Typography component={'p'} variant={'subtitle1'} style={{marginTop: 12}}>
                                        {jsonError.replace('SyntaxError: JSON.parse: ', '')}
                                    </Typography>
                                </Paper> :
                                typeof schema === 'string' ? null : <Paper style={{margin: 12, padding: 24}}>
                                    <UIRootRenderer schema={schema}/>

                                    <InvalidLabel invalid={isInvalid(store.getValidity())} setShowValidity={setShowValidity} showValidity={showValidity}/>
                                </Paper>}

                            <div style={{height: 24, width: 1, flexShrink: 0}}/>
                        </main>
                    </div>
                </UIStoreProvider>
            </KitDndProvider>
        </MuiPickersUtilsProvider>
    </WidgetCodeProvider>;
};

const Editor = () => {
    const match = useRouteMatch();

    // Custom State for Live-Editor
    const [activeSchema, setActiveSchema] = React.useState(() =>
        match.params.schema ?
            searchActiveSchema(schemas, match.params.schema) : 0,
    );

    React.useEffect(() => {
        let foundSchema = searchActiveSchema(schemas, match.params.schema);
        if(foundSchema !== activeSchema && foundSchema !== false) {
            setActiveSchema(foundSchema)
        } else if(foundSchema === false && typeof match.params.schema === 'undefined') {
            setActiveSchema(0)
        }
    }, [activeSchema, setActiveSchema, match]);

    if(activeSchema === false) return <PageNotFound/>;

    return <EditorHandler
        activeSchema={activeSchema}
        setActiveSchema={setActiveSchema}
        matchedSchema={match.params.schema}
    />
};

const InvalidLabel = ({invalid, setShowValidity, showValidity}) => {
    const {palette} = useTheme();

    return <div>
        <Typography
            component={'p'} variant={'body1'}
            style={{color: invalid ? palette.error.main : palette.success.dark, margin: '24px 0'}}
        >
            {invalid ? ' ❌ failed data validation' : ' ✔ valid data'}
        </Typography>
        <Button
            onClick={() => setShowValidity(p => !p)}
            variant={'contained'}
        >{showValidity ? 'Hide' : 'Show'} Validity</Button>
    </div>;
}

export default Editor;
