import React from 'react'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import { Trans } from '@ui-schema/ui-schema'
import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    })
)

export const TablePaginationActions: React.ComponentType<TablePaginationActionsProps> = (props) => {
    const classes = useStyles1()
    const theme = useTheme()
    const {
        count, page, rowsPerPage, onPageChange,
        backIconButtonProps: backIconButtonPropsTmp, nextIconButtonProps: nextIconButtonPropsTmp,
    } = props

    const btnSize = backIconButtonPropsTmp?.size
    // @ts-ignore
    const {noFirstPageButton, ...backIconButtonProps} = backIconButtonPropsTmp || {}
    // @ts-ignore
    const {noLastPageButton, ...nextIconButtonProps} = nextIconButtonPropsTmp || {}

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0)
    }

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1)
    }

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    const iconStyle = {
        padding: btnSize === 'small' ? 2 : undefined,
    }

    return (
        <div className={classes.root}>
            {noFirstPageButton ? null :
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={<Trans text={'pagination.first-page'}/>}>
                        {theme.direction === 'rtl' ? <LastPageIcon style={iconStyle}/> : <FirstPageIcon style={iconStyle}/>}
                    </AccessTooltipIcon>
                </IconButton>}
            <IconButton
                onClick={handleBackButtonClick} disabled={page === 0}
                size={btnSize}
                {...backIconButtonProps}
            >
                <AccessTooltipIcon title={<Trans text={'pagination.prev-page'}/>}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight style={iconStyle}/> : <KeyboardArrowLeft style={iconStyle}/>}
                </AccessTooltipIcon>
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                style={{
                    padding: btnSize === 'small' ? 2 : undefined,
                }}
                size={btnSize}
                {...nextIconButtonProps}
            >
                <AccessTooltipIcon title={<Trans text={'pagination.next-page'}/>}>
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft style={iconStyle}/> : <KeyboardArrowRight style={iconStyle}/>}
                </AccessTooltipIcon>
            </IconButton>
            {noLastPageButton ? null :
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    size={btnSize}
                    style={{
                        padding: btnSize === 'small' ? 2 : undefined,
                    }}
                >
                    <AccessTooltipIcon title={<Trans text={'pagination.last-page'}/>}>
                        {theme.direction === 'rtl' ? <FirstPageIcon style={iconStyle}/> : <LastPageIcon style={iconStyle}/>}
                    </AccessTooltipIcon>
                </IconButton>}
        </div>
    )
}
