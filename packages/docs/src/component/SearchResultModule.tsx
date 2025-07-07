import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Highlighter from 'react-highlight-words'
import { SearchHighlight, SearchLink } from './SearchBoxUtils'
import { useSearch } from '@control-ui/docs/DocsSearchProvider'
import { useDrawer } from '@control-ui/app/DrawerProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export const SearchResultModule: React.FC<{
    match: any
    term: string | undefined
}> = (
    {
        match, term,
    },
) => {
    const {setOpen} = useSearch()
    const {setOpen: setDrawerOpen} = useDrawer()
    const {breakpoints} = useTheme()
    const isMd = useMediaQuery(breakpoints.up('md'))
    return <Box mb={1}>
        <SearchLink
            to={match.pagePath + '#doc-module--' + match.module}
            onClick={() => {
                setOpen(false)
                if(!isMd) {
                    setDrawerOpen(false)
                }
            }}
            // style={{textDecoration: 'none'}}
        >
            <Paper variant={'outlined'} style={{borderRadius: 5}}>
                <Box p={1}>
                    <Typography>
                        <Highlighter
                            searchWords={term?.split(' ') || []}
                            textToHighlight={match.module}
                            autoEscape
                            highlightTag={SearchHighlight}
                        />
                    </Typography>
                    <Box style={{display: 'flex'}}>
                        <Typography variant={'body2'}>{match.package}</Typography>
                        <Typography variant={'caption'} style={{marginLeft: 'auto', opacity: 0.6}}>Score: {match.score.toFixed(2)}</Typography>
                    </Box>
                </Box>
            </Paper>
        </SearchLink>
    </Box>
}
