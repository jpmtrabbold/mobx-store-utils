import React, { useMemo } from 'react'
import { useObserver } from 'mobx-react-lite'
import FormInputHandler, { StandardErrorProps } from './FormInputHandler'

export interface FormInputWrapperProps<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps> {
    handler: FormInputHandler<T, P, A, E>
    children: React.ReactElement
    isCheckbox: boolean
}
export default function FormInputWrapper<T extends Object, P extends Extract<keyof T, string>, A extends Object, E extends Object = StandardErrorProps>
    (props: FormInputWrapperProps<T, P, A, E>) {

    const newProps = useObserver(() => props.isCheckbox ? props.handler.checkboxProps : props.handler.inputProps)
    const errorProps = useObserver(() => props.handler.errorProps)
    
    const allProps = { ...newProps, ...errorProps }
    const deps = Object.entries(allProps).map(d => d[1])
    return useMemo(() => React.cloneElement(props.children, allProps), deps)
}