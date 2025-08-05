export const Required =
    ({required}: { required?: boolean }) =>
        required ? <span className={'text-nowrap'} aria-hidden="true">{' *'}</span> : null
