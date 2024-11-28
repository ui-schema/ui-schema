export const ERROR_EMAIL_INVALID = 'email-invalid'

export const validateEmail = (value) => {
    /*
     *  regex from https://emailregex.com/
     */
    if (
        typeof value === 'string' &&
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
    ) {
        return false
    }
    return true
}
