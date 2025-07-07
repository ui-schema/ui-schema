import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { PageContent, PageTitle } from '@control-ui/kit/PageContent'
import { HeadMeta } from '@control-ui/kit/HeadMeta'
import { Link } from '@control-ui/kit/Link'
import Nav from '../component/Nav'
import { useTranslation } from 'react-i18next'

export const PageNotFound = (
    {title = '404 Page Not Found', error}: {
        title?: string
        error?: string
    },
) => {
    const {i18n} = useTranslation()
    return (
        <>
            <HeadMeta
                title={title + ' · UI-Schema'}
                description={''}
            />
            <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2, padding: 8}}>
                <PageTitle title={title}/>

                {error ?
                    <PageContent><Typography gutterBottom>{error}</Typography></PageContent> : null}

                <Paper style={{margin: 12, padding: 24, borderRadius: 5}} variant={'outlined'}>
                    <Typography component={'p'} variant={'body1'}>
                        <span role={'img'} aria-label={'Home Icon'}>🏠</span> <Link to={'/' + i18n.language} primary={'Home'} style={{display: 'inline-block'}}/>
                    </Typography>
                    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
                    <Nav/>
                </Paper>
            </Container>
        </>
    )
}

export default PageNotFound
