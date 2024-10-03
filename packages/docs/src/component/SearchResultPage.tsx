import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Highlighter from 'react-highlight-words'
import { SearchHighlight, SearchHighlight2, SearchLink } from './SearchBoxUtils'
import { useSearch } from '@control-ui/docs/DocsSearchProvider'
import IcPage from '@mui/icons-material/Article'
import Slide from '@mui/material/Slide'
import IcTag from '@mui/icons-material/Tag'
import { useTheme } from '@mui/material/styles'
import { useDrawer } from '@control-ui/app/DrawerProvider'
import useMediaQuery from '@mui/material/useMediaQuery'

export const SearchResultPage: React.FC<{
    match: any
    term: string | undefined
    showHeadlines?: boolean
}> = (
    {
        match, term,
        showHeadlines,
    },
) => {
    const {setOpen: setDrawerOpen} = useDrawer()
    const {setOpen} = useSearch()
    const {palette, breakpoints} = useTheme()
    const isMd = useMediaQuery(breakpoints.up('md'))
    const headlineMatches = match.matchKeys?.filter(
        (mk: any) =>
            mk.key === 'headings.headline' && (
                mk.index !== 0 ||
                match.headings[mk.index].headline !== match.label
            )
    )
    return <Box mb={1} style={{overflow: 'hidden'}}>
        <SearchLink
            to={match.pagePath}
            onClick={() => {
                setOpen(false)
                if(!isMd) {
                    setDrawerOpen(false)
                }
            }}
            style={{/*textDecoration: 'none', */position: 'relative', zIndex: 2}}
        >
            <Paper variant={'outlined'} style={{borderRadius: 5}}>
                <Box p={1}>
                    <Box style={{display: 'flex', alignItems: 'center'}}>
                        <IcPage/>
                        <Typography style={{marginLeft: 12}}>
                            <Highlighter
                                searchWords={term?.split(' ') || []}
                                textToHighlight={match.label}
                                highlightTag={SearchHighlight}
                                autoEscape
                            />
                        </Typography>
                    </Box>
                    <Box style={{display: 'flex'}}>
                        {match.parentLabel ? <Typography variant={'body2'}>{match.parentLabel.join(' > ')}</Typography> : null}
                        <Typography variant={'caption'} style={{marginLeft: 'auto', opacity: 0.6}}>Score: {match.score.toFixed(2)}</Typography>
                    </Box>
                </Box>
            </Paper>
        </SearchLink>

        {headlineMatches.length > 0 ?
            <Box style={{marginTop: -1, borderLeft: '1px solid ' + palette.divider}}>
                {headlineMatches.map((mk: any) =>
                    <Slide
                        key={mk.index}
                        in={showHeadlines} mountOnEnter unmountOnExit timeout={325}
                        style={{position: 'relative', zIndex: 1}}
                    >
                        <Box ml={2}>
                            <SearchLink
                                to={match.pagePath + '#' + match.headings[mk.index].fragment}
                                onClick={() => {
                                    setOpen(false)
                                    if(!isMd) {
                                        setDrawerOpen(false)
                                    }
                                }}
                                style={{/*textDecoration: 'none', */padding: '8px 0', color: 'inherit', display: 'flex', alignItems: 'center'}}
                            >
                                <IcTag/>
                                <Typography variant={'body2'} style={{marginLeft: 8}}>
                                    <Highlighter
                                        searchWords={term?.split(' ') || []}
                                        textToHighlight={match.headings[mk.index].headline}
                                        highlightTag={SearchHighlight2}
                                        autoEscape
                                    />
                                </Typography>
                            </SearchLink>
                        </Box>
                    </Slide>)}
            </Box>
            : null}
    </Box>
}
