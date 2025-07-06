import Checkbox from '@mui/material/Checkbox'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import { toPointer } from '@ui-schema/json-pointer/toPointer'
import { useUIMeta, UIMetaProvider } from '@ui-schema/react/UIMeta'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { resourceFromSchema } from '@ui-schema/ui-schema/SchemaResource'
import { SchemaResourceProvider } from '@ui-schema/react/SchemaResourceProvider'
import React, { MouseEvent, useMemo, useState } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { Map, List } from 'immutable'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import DragHandle from '@mui/icons-material/DragHandle'
import Opacity from '@mui/icons-material/Opacity'
import SpeakerNotes from '@mui/icons-material/SpeakerNotes'
import SpeakerNotesOff from '@mui/icons-material/SpeakerNotesOff'
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import FormatSize from '@mui/icons-material/FormatSize'
import FormatShapes from '@mui/icons-material/FormatShapes'
import Code from '@mui/icons-material/Code'
import SpaceBar from '@mui/icons-material/SpaceBar'
import RestorePage from '@mui/icons-material/RestorePage'
import HorizontalSplit from '@mui/icons-material/HorizontalSplit'
import VerticalSplit from '@mui/icons-material/VerticalSplit'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { RichCodeEditor, themes } from '../RichCodeEditor'
import { Markdown } from '../Markdown'
import PageNotFound from '../../page/PageNotFound'
import { schemas } from '../../schemas/_list'
// import LuxonAdapter from '@date-io/luxon';
// import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import { KitDndProvider, useOnIntent } from '@ui-schema/kit-dnd'
import { useOnDirectedMove } from '@ui-schema/material-dnd/useOnDirectedMove'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { createEmptyStore, createStore, onChangeHandler, UIStoreProvider, UIStoreType, useUIStore } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { SchemaInspectorLocation, SchemaInspectorProvider } from './SchemaInspector'

const IconInput = (
    {
        verticalSplit, title,
        onChange, value, min, max = 15,
        Icon, opacity = 0.4, scale = 0.8,
        noButtons = false,
    },
) => {
    const {palette} = useTheme()
    const [hasFocus, setFocus] = React.useState(false)
    const [hasHover, setHover] = React.useState(false)

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
        {!noButtons && (hasFocus || hasHover) ?
            <button
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
            value={value}
            onChange={e => Number(e.target.value) <= max ? onChange(Number(e.target.value)) : undefined}
            min={min} max={max}
        />

        {!noButtons && (hasFocus || hasHover) ?
            <button
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
}

const unFocus = (e: MouseEvent<HTMLElement>) => {
    let found = false
    let parent: HTMLElement | null = e.currentTarget

    do {
        if (parent.nodeName === 'BUTTON') {
            const t = parent
            setTimeout(() => t ? t.blur() : undefined, 400)
            found = true
        } else {
            parent = parent.parentElement
        }
    } while (!found && parent)
}

const DragHandleStyled = () => {
    const theme = useTheme()
    return <DragHandle style={{pointerEvents: 'none', transform: 'translateY(-3px)', fill: theme.palette.text.primary}} fontSize={'small'}/>
}

const NavButton = ({verticalSplit, onClick, Icon, label}: any) => {
    const {palette} = useTheme()

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
}

const EditorsNavWrapper = ({verticalSplit, children}: React.PropsWithChildren<{ verticalSplit?: boolean }>) => {
    const {palette} = useTheme()

    return <div
        style={{
            marginTop: verticalSplit ? 'auto' : 0, marginLeft: verticalSplit ? 12 : 0, padding: verticalSplit ? 0 : '6px 0',
            display: 'flex', order: 2, position: 'relative',
            borderTop: '1px solid ' + palette.divider,
            // flexWrap: verticalSplit ? 'no-wrap' : 'wrap',
        }}
    >
        {children}
    </div>
}

const IdeThemeChange = ({editorTheme, verticalSplit, setEditorTheme}: any) => {
    const {palette} = useTheme()

    return palette.mode === 'dark' ? <NavButton
        onClick={() => {
            const themePos = themes.indexOf(editorTheme)
            setEditorTheme(themePos >= themes.length - 1 ? themes[0] : themes[themePos + 1])
        }}
        Icon={Opacity}
        verticalSplit={verticalSplit}
        label={'Toggle Theme'}
    /> : null
}

const EditorsNavBase = (
    {
        verticalSplit, changeSplit,
        setTabSize, tabSize,
        setFontSize, fontSize,
        activeSchema, changeSchema,
        resetState,
        toggleRichIde, richIde,
        schemas,
        showInfo, toggleInfoBox, hasInfo,
        setJsonEditHeight, setRenderChange,
        setEditorTheme, editorTheme,
    }: any,
) => {
    const [upDownHandler, setUpDownHandler] = React.useState(false)

    const handleMouseDown = React.useCallback((e) => {
        let clientY: number = 0
        if (e.touches) {
            if (e.touches[0]) {
                clientY = e.touches[0].clientY
            }
        } else {
            clientY = e.clientY
        }

        const nextPos = window.innerHeight - clientY - 40
        if (nextPos % 2 === 0) {
            if (nextPos < (window.innerHeight - 40 - 60)) {
                // throttle to every second pixel
                setJsonEditHeight(window.innerHeight - clientY - 40)
            } else {
                setJsonEditHeight(window.innerHeight - 40 - 60)
            }
        }
    }, [setJsonEditHeight])

    return <EditorsNavWrapper verticalSplit={verticalSplit}>
        {verticalSplit ? null : <button
            style={{
                height: '1rem', overflow: 'hidden', border: 0, position: 'absolute', cursor: 'grab',
                left: '50%', transform: 'translate(-50%, -14px)', display: 'flex', margin: 0, padding: '1px 4px 1px 4px',
            }}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement

                if (!upDownHandler) {
                    setUpDownHandler(true)
                    document.addEventListener('mousemove', handleMouseDown)
                    document.addEventListener('mouseup', function mouseUpHandler() {
                        this.removeEventListener('mouseup', mouseUpHandler, false)
                        document.removeEventListener('mousemove', handleMouseDown)
                        setUpDownHandler(false)
                        target.blur()

                        setRenderChange(p => p + 1)
                    })
                }
            }}
            onTouchStart={(e) => {
                const target = e.target as HTMLElement

                if (!upDownHandler) {
                    setUpDownHandler(true)
                    document.addEventListener('touchmove', handleMouseDown)
                    document.addEventListener('touchend', function mouseUpHandler() {
                        this.removeEventListener('touchend', mouseUpHandler, false)
                        document.removeEventListener('touchmove', handleMouseDown)
                        setUpDownHandler(false)
                        target.blur()

                        setRenderChange(p => p + 1)
                    })
                }
            }}
            onClick={() => undefined}
            title={'Drag to change Height'}
        ><DragHandleStyled/></button>}

        <div style={{
            display: 'flex', overflowX: 'auto',
            flexDirection: verticalSplit ? 'column' : 'row',
            paddingLeft: 4,
        }}>
            {verticalSplit ? null : <div style={{marginRight: 'auto', display: 'flex', minWidth: '200px', paddingRight: 6}}>
                <SchemaChanger
                    schemas={schemas} style={{margin: 'auto 4px'}} activeSchema={activeSchema}
                    verticalSplit={verticalSplit}
                    changeSchema={changeSchema} toggleInfoBox={toggleInfoBox} showInfo={showInfo} hasInfo={hasInfo} setRenderChange={setRenderChange}/>
            </div>}

            {hasInfo ? <NavButton
                onClick={() => {
                    toggleInfoBox(p => !p)
                    if (setRenderChange) {
                        setRenderChange(p => p + 1)
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
                Icon={FormatSize} noButtons
            />
            <IconInput
                title={'Indentation Size'} value={tabSize} onChange={setTabSize}
                verticalSplit={verticalSplit} min={2} max={8}
                Icon={SpaceBar} noButtons opacity={0.5} scale={0.9}
            />

            <NavButton
                label={'reset data and schema'}
                Icon={RestorePage}
                onClick={() => resetState()}
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
}
const EditorsNav = React.memo(EditorsNavBase)

const SchemaJSONEditor = (
    {
        schema, setSchema,
        tabSize, fontSize, richIde, renderChange, theme,
    }: any,
) => {
    return <RichCodeEditor
        tabSize={tabSize}
        fontSize={fontSize}
        raw={!richIde}
        theme={theme}
        renderChange={renderChange}
        value={typeof schema === 'string' ? schema : ''}
        onChange={(newValue) => {
            setSchema(newValue)
        }}
    />
}

const SchemaDataDebug = (
    {
        tabSize, fontSize, richIde, renderChange, theme,
    }: any,
) => {
    const {store} = useUIStore()

    return <RichCodeEditor
        value={Map.isMap(store?.getValues()) || List.isList(store?.getValues()) ? JSON.stringify(store?.valuesToJS(), null, tabSize) : store?.valuesToJS()}
        theme={theme}
        tabSize={tabSize}
        fontSize={fontSize}
        renderChange={renderChange}
        raw={!richIde}
        readOnly
    />
}

const SchemaChanger = (
    {
        activeSchema, changeSchema, schemas, verticalSplit,
    }: any,
) => {
    return <FormControl fullWidth style={{padding: verticalSplit ? '20px 0 20px 3px' : '0 0 0 12px'}}>
        <Select value={activeSchema} onChange={e => changeSchema(e.target.value * 1)} displayEmpty size={'small'}>
            <MenuItem value="" disabled>
                Examples
            </MenuItem>
            {schemas.map((schema, i) => (
                <MenuItem key={i} value={i}>{schema[0]}</MenuItem>
            ))}
        </Select>
    </FormControl>
}

const initialLocalBoolean = (key: string, def: boolean): boolean => {
    const localValue = window.localStorage.getItem(key)
    if (
        typeof localValue === 'string' &&
        !isNaN(Number(localValue))
    ) {
        return !!Number(localValue)
    }

    return def
}

const toggleLocalBoolean = (setter: (updater: (old: boolean) => boolean) => void, key: string) => {
    setter(p => {
        window.localStorage.setItem(key, p ? '0' : '1')
        return !p
    })
}

const searchActiveSchema = (schemas: any, schema: any) => {
    let found: undefined | number = undefined
    for (const id in schemas) {
        if (schemas[id][0].split(' ').join('-') === schema) {
            found = Number(id)
            break
        }
    }

    return found
}

const EditorSchemaInfoBase = (
    {
        verticalSplit, toggleInfoBox, info, infoBox, showInfo, setRenderChange, activeSchema, changeSchema, schema,
        onSchemaManual, tabSize, fontSize, richIde, renderChange, editorTheme,
    }: any,
) => {
    return <>
        {verticalSplit ?
            <SchemaChanger
                toggleInfoBox={toggleInfoBox} showInfo={showInfo} hasInfo={!!schema}
                schemas={schemas} style={{marginLeft: 4}}
                setRenderChange={setRenderChange} verticalSplit={verticalSplit}
                activeSchema={activeSchema} changeSchema={changeSchema}
            /> : null}

        {schema ?
            <div style={{
                height: verticalSplit ? 'auto' : 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0,
                width: verticalSplit ? 'auto' : schema ? showInfo ? '33%' : 'auto' : showInfo ? '50%' : 'auto',
                maxHeight: verticalSplit ? '35%' : 'none', paddingLeft: verticalSplit ? 0 : 6, marginRight: !verticalSplit && showInfo ? 12 : 0,
            }}>
                <Button
                    variant={'outlined'} size={'small'}
                    style={{display: 'flex', lineHeight: 2.66, flexShrink: 0, minWidth: 0, color: 'inherit', border: 0, padding: '0 0 0 4px', cursor: 'pointer'}}
                    onClick={() => toggleInfoBox(o => !o)} onMouseUp={unFocus}
                >
                    {showInfo || verticalSplit ? 'Info:' : 'I·'}

                    {showInfo ?
                        <SpeakerNotesOff fontSize={'small'} style={{margin: 'auto ' + (verticalSplit ? 0 : 9) + 'px auto auto'}}/> :
                        <SpeakerNotes fontSize={'small'} style={{margin: 'auto ' + (verticalSplit ? 0 : 9) + 'px auto auto'}}/>}
                </Button>

                {showInfo ? <Paper style={{overflow: 'auto', padding: '0 6px 0 0'}} ref={infoBox}><Box mt={1} mb={1} ml={2} mr={verticalSplit ? 0 : 1.5}>
                    <div style={{overflow: 'visible', margin: 0}}>
                        <Markdown source={info}/>
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
                setSchema={onSchemaManual}
                tabSize={tabSize}
                fontSize={fontSize}
                richIde={richIde}
                renderChange={renderChange}
                theme={editorTheme}
            />
        </div>
    </>
}
const EditorSchemaInfo = React.memo(EditorSchemaInfoBase)

const EditorHandler = ({activeSchema}: any) => {
    const history = useHistory()
    const initialVertical = initialLocalBoolean('live-editor-vertical', 800 < window.innerWidth)// Vertical by default for desktop
    const initialRichIde = initialLocalBoolean('live-editor-rich-ide', true)
    const [verticalSplit, setVerticalSplit] = React.useState(initialVertical)
    const [richIde, setRichIde] = React.useState(initialRichIde)
    const [tabSize, setTabSize] = React.useState(2)
    const [fontSize, setFontSize] = React.useState(13)
    const [showInfo, setInfoBox] = React.useState(true)
    const [showStore, setStoreBox] = React.useState(true)
    const [jsonEditHeight, setJsonEditHeight] = React.useState(350)
    const [renderChange, setRenderChange] = React.useState(0)// Ace Editor Re-Size Re-Calc
    const [editorTheme, setEditorTheme] = React.useState('gruvbox')
    const [resetId, setResetId] = React.useState(activeSchema)
    const infoBox = React.useRef<HTMLElement>(null)// to scroll to top of info text when toggling/switching sides

    // default schema state - begin
    const [showValidity, setShowValidity] = React.useState(false)
    const [activeState, setActiveState] = React.useState<{
        id: number
        schema: any
        input: string
        jsonError?: string
        store: UIStoreType
    }>(() => ({
        id: activeSchema,
        schema: schemas[activeSchema][1],
        input: JSON.stringify(schemas[activeSchema][1].toJS(), undefined, tabSize),
        store: createStore(schemas[activeSchema][2]),
    }))
    // end - default schema state

    const toggleInfoBox = React.useCallback((setter) => {
        setInfoBox(setter)
        if (setRenderChange) {
            setRenderChange(p => p + 1)
        }
    }, [setInfoBox, setRenderChange])

    const toggleDataBox = React.useCallback((setter) => {
        setStoreBox(setter)
        if (setRenderChange) {
            setRenderChange(p => p + 1)
        }
    }, [setStoreBox, setRenderChange])

    const changeSplit = React.useCallback(() => {
        // toggle verticalSplit and change selected in localStorage
        toggleLocalBoolean(setVerticalSplit, 'live-editor-vertical')
        setRenderChange(p => p + 1)
    }, [setVerticalSplit, setRenderChange])

    const toggleRichIde = React.useCallback(() => {
        // toggle richIde and change selected in localStorage
        toggleLocalBoolean(setRichIde, 'live-editor-rich-ide')
    }, [setRichIde])

    const changeSchema = React.useCallback(i => {
        setShowValidity(false)
        history.push('/examples/' + (schemas[i][0].split(' ').join('-')))
    }, [history])

    React.useEffect(() => {
        if (infoBox.current) {
            infoBox.current.scrollTo(0, 0)
        }
    }, [activeSchema, infoBox])

    React.useEffect(() => {
        if (showInfo && infoBox.current) {
            infoBox.current.scrollTo(0, 0)
        }
    }, [showInfo, infoBox])

    React.useEffect(() => {
        if (typeof activeSchema === 'number') {
            setActiveState((activeState) => activeState.id === activeSchema ? activeState : ({
                id: activeSchema,
                schema: schemas[activeSchema][1],
                input: JSON.stringify(schemas[activeSchema][1], undefined, tabSize),
                store: createStore(schemas[activeSchema][2]),
            }))
            setRenderChange(p => p + 1)
        }
    }, [activeSchema, tabSize])

    const resetState = React.useCallback(() => {
        if (typeof activeSchema === 'number') {
            setActiveState(() => ({
                id: activeSchema,
                schema: schemas[activeSchema][1],
                input: JSON.stringify(schemas[activeSchema][1], undefined, tabSize),
                store: createStore(schemas[activeSchema][2]),
            }))
            setRenderChange(p => p + 1)
            setResetId(Date.now().toString())
        }
    }, [activeSchema, tabSize])

    React.useEffect(() => {
        setActiveState((activeState) => ({
            ...activeState,
            input: JSON.stringify(activeState.schema?.toJS(), undefined, tabSize),
        }))
    }, [tabSize])

    const [fullWidth] = React.useState(true)

    const onSchemaManual = React.useCallback((schema) => {
        setActiveState((activeState) => {
            const oldSchema = activeState.schema
            const oldType = Map.isMap(oldSchema) && oldSchema.get('type')
            let nextSchema = oldSchema
            let jsonError: string | undefined = undefined
            try {
                nextSchema = createOrderedMap(JSON.parse(schema))
            } catch (e) {
                jsonError = e instanceof Error ? e.toString() : JSON.stringify(e)
            }
            const type = nextSchema && Map.isMap(nextSchema) && nextSchema.get('type')
            return {
                ...activeState,
                input: schema,
                schema: nextSchema,
                store: type && oldType !== type ? createEmptyStore(type) : activeState.store,
                jsonError: jsonError,
            }
        })
    }, [])

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setActiveState(activeState => {
            return {
                ...activeState,
                store: storeUpdater(actions)(activeState.store),
            }
        })
    }, [])

    const {onIntent} = useOnIntent({edgeSize: 12})
    const {onMove} = useOnDirectedMove(onIntent, onChange)

    const resource = useMemo(() => {
        try {
            return activeState.schema ? resourceFromSchema(activeState.schema, {}) : undefined
        } catch (e) {
            // todo: make available for users, including more details about not resolved schemas
            console.error('Resource building failed', e)
            return undefined
        }
    }, [activeState.schema])

    const [defaultArrayWidget, setDefaultArrayWidget] = useState(false)

    const {binding, ...mainMeta} = useUIMeta()
    const activeWidgets = useMemo(() => ({
        ...binding,
        widgets: {
            ...binding?.widgets,
            // @ts-ignore
            array: defaultArrayWidget ? binding?.widgets?.GenericList : undefined,
        },
    }), [defaultArrayWidget, binding])

    const [inspectorEnabled, setInspectorEnabled] = useState(true)
    const [inspectorOpen, setInspectorOpen] = useState<SchemaInspectorLocation | null>(null)
    const onInspectorOpen = setInspectorOpen

    return <>
        {/*<MuiPickersUtilsProvider utils={LuxonAdapter}>*/}
        <UIMetaProvider binding={activeWidgets} {...mainMeta}>
            <KitDndProvider onMove={onMove}>
                <UIStoreProvider store={activeState.store} onChange={onChange} showValidity={showValidity}>
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
                                <EditorSchemaInfo
                                    verticalSplit={verticalSplit}
                                    toggleInfoBox={toggleInfoBox}
                                    info={schemas[activeSchema][3]}
                                    schema={activeState.input}
                                    infoBox={infoBox}
                                    showInfo={showInfo}
                                    setRenderChange={setRenderChange}
                                    activeSchema={activeSchema}
                                    changeSchema={changeSchema}
                                    onSchemaManual={onSchemaManual}
                                    tabSize={tabSize}
                                    fontSize={fontSize}
                                    richIde={richIde}
                                    renderChange={renderChange}
                                    editorTheme={editorTheme}
                                />

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
                            changeSplit={changeSplit}
                            verticalSplit={verticalSplit}
                            activeSchema={activeSchema}
                            changeSchema={changeSchema}
                            resetState={resetState}
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

                        <main className="App-main" style={{height: '100%', overflow: 'auto', width: fullWidth ? '100%' : undefined, maxWidth: 'none', margin: verticalSplit ? '0 auto' : 0, order: verticalSplit ? 3 : 1}}>
                            {activeState.jsonError ?
                                <Paper sx={{margin: 2, padding: 3}}>
                                    <Typography component={'h2'} variant={'h5'} color={'error'}>
                                        JSON-Error:
                                    </Typography>

                                    <Typography component={'p'} variant={'subtitle1'} style={{marginTop: 12}}>
                                        {activeState.jsonError.replace('SyntaxError: JSON.parse: ', '')}
                                    </Typography>
                                </Paper> :
                                resource ? <Paper sx={{margin: 2, padding: 3}}>
                                    <SchemaResourceProvider
                                        resource={resource}
                                    >
                                        <SchemaInspectorProvider
                                            onOpen={inspectorEnabled ? onInspectorOpen : undefined}
                                            openStoreKeys={inspectorOpen?.storeKeys}
                                        >
                                            <GridContainer>
                                                <WidgetEngine key={resetId} schema={resource.branch.value()} isRoot/>
                                            </GridContainer>
                                        </SchemaInspectorProvider>

                                        <Popover
                                            open={Boolean(inspectorOpen)}
                                            anchorEl={inspectorOpen?.element || null}
                                            onClose={() => setInspectorOpen(null)}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            // todo: optimize transform origin and top-bottom vs left-right layout
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            slotProps={{
                                                paper: {
                                                    sx: {
                                                        borderRadius: 1,
                                                        border: '1px solid transparent',
                                                        borderColor: 'info.main',
                                                    },
                                                },
                                            }}
                                        >
                                            {inspectorOpen ?
                                                <Box pt={1} pb={2} px={2}>
                                                    <Typography variant={'overline'} color={'primary'} gutterBottom>
                                                        {'Schema Inspector'}
                                                    </Typography>
                                                    <Typography variant={'body2'} gutterBottom>
                                                        {'Store Keys: '}
                                                        <code>{'[ '}{inspectorOpen?.storeKeys.toArray().map(k => JSON.stringify(k)).join(', ')}{' ]'}</code>
                                                    </Typography>
                                                    <Typography variant={'body2'} gutterBottom>
                                                        {'JSON-Pointer: '}
                                                        <code>{'#' + toPointer(inspectorOpen?.storeKeys)}</code>
                                                    </Typography>
                                                    <Typography variant={'body2'} gutterBottom>
                                                        {'Widget Match: '}
                                                        {inspectorOpen?.matchedWidget
                                                            ? inspectorOpen?.matchedWidget instanceof Error ? inspectorOpen?.matchedWidget?.message :
                                                                <Box component={'span'} display={'block'} pl={1.5}>
                                                                    {'scope: ' + inspectorOpen.matchedWidget.scope}<br/>
                                                                    {'id: ' + inspectorOpen.matchedWidget.id}
                                                                </Box> :
                                                            <em>{'none'}</em>}
                                                    </Typography>
                                                    <Typography variant={'body2'} gutterBottom>
                                                        {'WidgetOverride: '}
                                                        {inspectorOpen?.WidgetOverride ? 'yes' : 'no'}
                                                    </Typography>
                                                    <Typography variant={'body2'} gutterBottom>
                                                        {'Applied Schema:'}
                                                    </Typography>

                                                    <Typography
                                                        variant={'body2'}
                                                        component={'pre'}
                                                        sx={{
                                                            whiteSpace: 'pre-wrap', p: 0,
                                                            minWidth: {
                                                                xs: '80vw',
                                                                sm: '70vw',
                                                                md: 320,
                                                                lg: 360,
                                                            },
                                                        }}
                                                    >
                                                        {/* @ts-expect-error */}
                                                        <code style={{fontSize: '0.92em'}}>{JSON.stringify(inspectorOpen?.schema?.toJS(), undefined, 2)}</code>
                                                    </Typography>

                                                    {/* todo: could not get editor height working in popover */}
                                                    {/*<RichCodeEditor
                                                    // @ts-expect-error
                                                    value={JSON.stringify(inspectorOpen?.schema?.toJS(), undefined, 2)} readOnly mode={'json'}
                                                    fontSize={14}
                                                    style={{margin: '8px 0 12px 0'}}
                                                />*/}
                                                </Box> : null}
                                        </Popover>

                                    </SchemaResourceProvider>

                                    <InvalidLabel invalid={isInvalid(activeState.store?.getValidity())} setShowValidity={setShowValidity} showValidity={showValidity}/>
                                </Paper> : null}

                            <Paper
                                sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mx: 2, mb: 2, p: 2}}
                            >
                                {/* todo: dynamic width is confusing, but toggling without change also, enable this with fixed width breakpoint select */}
                                {/*<Tooltip title={fullWidth ? 'show in dynamic width' : 'show full width'}>
                                <Button
                                    onClick={() => {
                                        setFullWidth(f => !f)
                                    }}
                                    color={'secondary'} size={'small'}
                                >
                                    {fullWidth ? <IcShowCompact style={{transform: 'rotate(90deg)'}}/> : <IcShowFull style={{transform: 'rotate(90deg)'}}/>}
                                </Button>
                            </Tooltip>*/}

                                <Tooltip
                                    title={
                                        'right click on a rendered widget to inspect the storeKeys, widget matching info and its applied schema'
                                    }
                                >
                                    <Button
                                        color={'secondary'}
                                        onClick={() => setInspectorEnabled(s => !s)}
                                        endIcon={
                                            <Checkbox
                                                checked={inspectorEnabled}
                                                disableRipple
                                                size={'small'}
                                                color={'secondary'}
                                                sx={{p: 0}}
                                            />
                                        }
                                    >
                                        {'inspector'}
                                    </Button>
                                </Tooltip>

                                <Tooltip
                                    title={'enable a default array widget, as the best UX for editing arrays depends heavily on the setup, no default array widget is set by default.'}
                                    // todo: add a info dialog, this is way too long for a tooltip
                                    // as array widgets often need more specialized code as others, this allows using the default type widgets without unnecessary overhead when adding an own default array widget.
                                >
                                    <Button
                                        onClick={() => setDefaultArrayWidget(s => !s)}
                                        color={'secondary'}
                                        endIcon={
                                            <Checkbox
                                                checked={defaultArrayWidget}
                                                disableRipple
                                                size={'small'}
                                                color={'secondary'}
                                                sx={{p: 0}}
                                            />
                                        }
                                        sx={{whiteSpace: 'pre'}}
                                    >{'array widget'}</Button>
                                </Tooltip>

                                <Tooltip
                                    title={'this force remounts the widget engine, use it to clear runtime component errors (e.g. due to invalid schema input)'}
                                >
                                    <Button
                                        onClick={() => setResetId(Date.now().toString())}
                                        color={'secondary'}
                                        sx={{justifySelf: 'flex-end'}}
                                    >{'remount'}</Button>
                                </Tooltip>
                            </Paper>

                            <div style={{height: 24, width: 1, flexShrink: 0}}/>
                        </main>
                    </div>
                </UIStoreProvider>
            </KitDndProvider>
        </UIMetaProvider>
        {/*</MuiPickersUtilsProvider>*/}
    </>
}

const Editor = () => {
    const match = useRouteMatch<{ schema?: string }>()

    // Custom State for Live-Editor
    const [activeSchema, setActiveSchema] = React.useState(() =>
        match.params.schema ?
            searchActiveSchema(schemas, match.params.schema) : 0,
    )

    React.useEffect(() => {
        const foundSchema = searchActiveSchema(schemas, match.params.schema)
        if (typeof foundSchema === 'number') {
            setActiveSchema(foundSchema)
        } else if (typeof match.params.schema === 'undefined') {
            setActiveSchema(0)
        }
    }, [setActiveSchema, match.params.schema])

    if (typeof activeSchema === 'undefined') return <PageNotFound/>

    return <EditorHandler
        activeSchema={activeSchema}
        setActiveSchema={setActiveSchema}
    />
}

const InvalidLabel = (
    {
        invalid, setShowValidity, showValidity,
    }: {
        invalid?: number
        setShowValidity: (updater: (old: boolean) => boolean) => void
        showValidity?: boolean
    },
) => {
    const {palette} = useTheme()

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
    </div>
}

export default Editor
