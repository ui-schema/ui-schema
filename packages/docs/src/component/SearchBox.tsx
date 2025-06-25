import { TransitionProps } from '@mui/material/transitions/transition'
import React from 'react'
import IcHistory from '@mui/icons-material/History'
import IcSearch from '@mui/icons-material/Search'
import IcDelete from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import FuseJs from 'fuse.js'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useRouter } from '@control-ui/routes/RouterProvider'
import { useSearch, useSearchHistory } from '@control-ui/docs/DocsSearchProvider'
import { useDocsIndex } from '@control-ui/docs/DocsIndexProvider'
import { DocsIndexValueModules, DocsIndexValuePackages, DocsIndexValuePages, DocsIndexValuesCombiner } from '@control-ui/docs/createDocsIndex'
import { MatchMakerType, useSearchMatching } from '@control-ui/docs'
import { SearchResultModule } from './SearchResultModule'
import { SearchResultPage } from './SearchResultPage'
import { useDebounceValue } from '@ui-schema/react/Utils/useDebounceValue'

export type CustomDocsIndexModules = DocsIndexValuesCombiner<DocsIndexValueModules & DocsIndexValuePackages>
export type CustomDocsIndex = {
    modules: CustomDocsIndexModules
    pages: DocsIndexValuesCombiner<DocsIndexValuePages>
}

const pid = {current: 0}

export interface CustomSearchOptions {
    headlines?: boolean
}

const matchMaker: MatchMakerType<CustomDocsIndex, CustomSearchOptions> = {
    modules: {
        factory: (moduleIndex) => {
            const fuse = new FuseJs(moduleIndex.modules, {
                includeScore: true,
                includeMatches: true,
                threshold: 0.29,
                useExtendedSearch: true,
                keys: ['module'],
            })
            return {
                search: (term) => fuse.search(term),
            }
        },
    },
    pages: {
        factory: (data) => {
            const fuse = new FuseJs(data.pages, {
                includeScore: true,
                includeMatches: true,
                threshold: 0.29,
                useExtendedSearch: true,
                keys: [
                    'label',
                ],
            })
            const fuseWithHeadlines = new FuseJs(data.pages, {
                includeScore: true,
                includeMatches: true,
                threshold: 0.29,
                useExtendedSearch: true,
                keys: [
                    'label',
                    'headings.headline',
                ],
            })
            return {
                search: (term, options) => {
                    return options?.headlines ?
                        fuseWithHeadlines.search(term) :
                        fuse.search(term)
                },
            }
        },
    },
}

export const SearchBox: React.ComponentType = () => {
    const {open, setOpen} = useSearch()
    const [showHeadlines, setShowHeadlines] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState('')
    const searchRef = React.useRef<null | HTMLElement>(null)
    const {index} = useDocsIndex<CustomDocsIndex>()
    const {routes} = useRouter()
    const setter = React.useCallback((t) => setSearchTerm(t), [setSearchTerm])
    const {bounceVal, setBounceVal, bubbleBounce} = useDebounceValue<string>(searchTerm, 115, setter)
    const {history, addTerm, clearHistory, bindKey} = useSearchHistory()
    // @ts-ignore
    const searchFns = useSearchMatching<CustomDocsIndex>(index, matchMaker)

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === bindKey?.toLowerCase()) {
                searchRef.current?.focus()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [bindKey, searchRef])

    const [searchResult, setSearchResult] = React.useState<undefined | {
        matches: { [k: string]: any[] }
        term: string
        found: number
    }>(undefined)

    React.useEffect(() => {
        if (open) return
        setBounceVal({value: '', changed: true})
    }, [setBounceVal, open])

    React.useEffect(() => {
        const ppid = pid.current = pid.current + 1
        if (searchTerm.trim().length < 3) {
            setSearchResult(undefined)
            return
        }

        const result = searchFns.reduce((tmpResult, {matcher, id}) => {
            const matched =
                matcher.search(searchTerm, {headlines: showHeadlines})
                    .map(m => ({
                        ...m.item,
                        matchKeys: m.matches.map((m: { key: string, refIndex: number }) => ({
                            key: m.key,
                            index: m.refIndex,
                        })),
                        matches: m.matches,
                        score: m.score,
                    }))
                    .filter(m => m.pagePath)
            return {
                matches: {
                    ...tmpResult.matches,
                    [id]: matched,
                },
                found: tmpResult.found + matched.length,
            }
        }, {matches: {}, found: 0} as {
            matches: { [k: string]: any[] }
            found: number
        })

        if (ppid === pid.current) {
            setSearchResult({
                ...result,
                term: searchTerm.trim(),
            })
        }
    }, [searchTerm, routes, searchFns, showHeadlines])

    return <Dialog
        open={open} onClose={() => setOpen(false)}
        maxWidth={'sm'} fullWidth
        slotProps={{
            paper: {
                style: {
                    background: 'transparent', overflow: 'visible',
                    margin: '24px 32px 32px 12px',
                },
                elevation: 0,
            },
            transition: {
                style: {
                    alignItems: 'flex-start',
                },
            },
        }}
    >
        <Paper style={{overflow: 'visible', flexShrink: 0, borderRadius: 5, marginTop: 6, display: 'flex', alignItems: 'center'}} elevation={0}>
            <TextField
                aria-label={'Search'}
                fullWidth
                value={bounceVal.value}
                onChange={e => setBounceVal({value: e.target.value, changed: true})}
                autoFocus
                inputRef={searchRef}
                slotProps={{
                    input: {
                        style: {borderRadius: 5},
                        startAdornment: (
                            <InputAdornment position="start">
                                <IcSearch/>
                            </InputAdornment>
                        ),
                        endAdornment:
                            searchTerm && searchTerm.length >= 3 ?
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setSearchTerm('')}>
                                        <IcHistory/>
                                    </IconButton>
                                </InputAdornment> : null,
                    },
                }}
                onBlur={() => {
                    bubbleBounce(searchTerm as string)
                    if (
                        typeof bounceVal.value === 'string' &&
                        searchResult?.term === bounceVal.value &&
                        searchResult?.found > 0
                    ) {
                        addTerm(bounceVal.value)
                    }
                }}
            />
            <Button
                style={{
                    marginRight: 'calc(-100% + 4px)',
                    minWidth: 16,
                    padding: 6,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                }}
                onClick={() => setOpen(false)}
                variant={'contained'}
            >
                <strong><small>ESC</small></strong>
            </Button>
        </Paper>

        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 ?
            <Box style={{display: 'flex'}}>
                <Typography variant={'caption'}>min. length: 3</Typography>
            </Box> : null}

        <Collapse
            in={Boolean(searchResult)} timeout="auto" unmountOnExit appear
            sx={{overflow: 'auto', mt: 1}}
            component={Paper as React.ComponentType<TransitionProps>}
            // @ts-expect-error props overwrite is missing in mui
            variant={'outlined'}
        >
            <Box px={2} pb={2} pt={1}>
                <Typography variant={'subtitle1'} style={{display: 'flex'}} color={'primary'}>
                    <span style={{marginRight: 'auto'}}>Pages</span>
                    <FormControlLabel
                        labelPlacement={'start'}
                        slotProps={{typography: {variant: 'body2'}}}
                        label={'search Headlines'}
                        control={<Switch size={'small'}/>}
                        checked={showHeadlines}
                        onChange={() => setShowHeadlines(h => !h)}
                    />
                </Typography>
                <Typography style={{display: 'flex'}} color={'textSecondary'} variant={'caption'} gutterBottom>{searchResult?.matches.pages?.length} matches</Typography>
                {searchResult?.matches.pages?.map((match, i) =>
                    <SearchResultPage
                        key={i}
                        match={match} term={searchResult?.term}
                        showHeadlines={showHeadlines}
                    />)}
            </Box>

            <Box px={2} pb={2} pt={1}>
                <Typography variant={'subtitle1'} color={'primary'}>Module APIs</Typography>
                <Typography style={{display: 'flex'}} color={'textSecondary'} variant={'caption'} gutterBottom>{searchResult?.matches.modules?.length} matches</Typography>
                {searchResult?.matches.modules?.map((match, i) =>
                    <SearchResultModule key={i} match={match} term={searchResult?.term}/>,
                )}
            </Box>
        </Collapse>

        <Collapse
            in={history.length > 0 && !searchResult} timeout="auto" unmountOnExit appear
            sx={{overflow: 'auto', mt: 1}}
            component={Paper as React.ComponentType<TransitionProps>}
            // @ts-expect-error props overwrite is missing in mui
            variant={'outlined'}
        >
            <Box pt={1} pr={2} pl={1}>
                <Typography variant={'subtitle1'} gutterBottom style={{display: 'flex', alignItems: 'center'}} color={'primary'}>
                    <IcHistory fontSize={'small'}/>

                    <span style={{paddingLeft: 8, paddingRight: 4}}>History</span>

                    <Tooltip title={'clear history'}>
                        <IconButton
                            size={'small'}
                            onClick={() => clearHistory()}
                            style={{marginLeft: 'auto'}}
                        ><IcDelete/></IconButton>
                    </Tooltip>
                </Typography>
            </Box>
            <Box pb={1}>
                <List>
                    {[...history].reverse().map((h, i) =>
                        <ListItemButton key={i} onClick={() => setSearchTerm(h)} style={{paddingLeft: 32}}>
                            <ListItemText primary={h}/>
                        </ListItemButton>)}
                </List>
            </Box>
        </Collapse>
    </Dialog>
}

