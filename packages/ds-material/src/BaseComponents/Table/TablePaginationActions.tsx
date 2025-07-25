import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { Translate } from '@ui-schema/react/Translate'
import { TablePaginationOwnProps } from '@mui/material/TablePagination'

export const TablePaginationActions: NonNullable<TablePaginationOwnProps['ActionsComponent']> = (props) => {
    const theme = useTheme()
    const {
        count, page, rowsPerPage, onPageChange,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
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
        <div style={{flexShrink: 0, marginLeft: theme.spacing(2.5)}}>
            {noFirstPageButton ? null :
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={<Translate text={'pagination.first-page'}/>}>
                        {theme.direction === 'rtl' ? <LastPageIcon style={iconStyle}/> : <FirstPageIcon style={iconStyle}/>}
                    </AccessTooltipIcon>
                </IconButton>}
            <IconButton
                onClick={handleBackButtonClick} disabled={page === 0}
                size={btnSize}
                {...backIconButtonProps}
            >
                <AccessTooltipIcon title={<Translate text={'pagination.prev-page'}/>}>
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
                <AccessTooltipIcon title={<Translate text={'pagination.next-page'}/>}>
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
                    <AccessTooltipIcon title={<Translate text={'pagination.last-page'}/>}>
                        {theme.direction === 'rtl' ? <FirstPageIcon style={iconStyle}/> : <LastPageIcon style={iconStyle}/>}
                    </AccessTooltipIcon>
                </IconButton>}
        </div>
    )
}
